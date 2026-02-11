import { NextRequest, NextResponse } from "next/server";
import { getVariantsOnline, getShelterCategoryId } from "@/lib/shelter";

interface CategoryInfo {
  id: number;
  name: string;
  availableRooms: number;
  basePrice?: number;
  price?: number;
  minPrice?: number;
}

interface DayPrice {
  date: string;
  available: boolean;
  price: number | null;
}

// Simple in-memory cache for calendar data (5 min TTL)
const cache = new Map<string, { data: DayPrice[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const apartmentId = searchParams.get("apartmentId");
  const month1 = searchParams.get("month1"); // Format: "2026-02"
  const month2 = searchParams.get("month2"); // Format: "2026-03"

  if (!apartmentId || !month1 || !month2) {
    return NextResponse.json({
      success: false,
      error: "Missing required parameters: apartmentId, month1, month2",
    });
  }

  const categoryId = getShelterCategoryId(apartmentId);
  
  // Parse months
  const [year1, m1] = month1.split("-").map(Number);
  const [year2, m2] = month2.split("-").map(Number);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Helper function to get days for a month with caching
  const getMonthPrices = async (year: number, month: number): Promise<DayPrice[]> => {
    const cacheKey = `${apartmentId}-${year}-${month}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
    
    const daysInMonth = new Date(year, month, 0).getDate();
    const dates: string[] = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
    }
    
    // Process ALL days in parallel (much faster!)
    const results = await Promise.all(
      dates.map(async (date): Promise<DayPrice> => {
        const checkDate = new Date(date);
        
        // Skip past dates
        if (checkDate < today) {
          return { date, available: false, price: null };
        }
        
        const nextDate = new Date(checkDate);
        nextDate.setDate(nextDate.getDate() + 1);
        const nextDateStr = nextDate.toISOString().split("T")[0];
        
        try {
          const result = await getVariantsOnline({
            dateFrom: date,
            dateTo: nextDateStr,
            adults: 2,
          });
          
          if (result.success && result.data) {
            const categories = result.data.data?.[0] || [];
            const ourCategory = categories.find(
              (cat: CategoryInfo) => cat.id === categoryId
            );
            
            if (ourCategory && ourCategory.availableRooms > 0) {
              const price = ourCategory.minPrice || ourCategory.basePrice || ourCategory.price || null;
              return { date, available: true, price };
            }
          }
        } catch (e) {
          console.error(`[Calendar API] Error fetching ${date}:`, e);
        }
        
        return { date, available: false, price: null };
      })
    );
    
    // Cache the results
    cache.set(cacheKey, { data: results, timestamp: Date.now() });
    
    return results;
  };
  
  // Fetch both months in parallel
  const [month1Prices, month2Prices] = await Promise.all([
    getMonthPrices(year1, m1),
    getMonthPrices(year2, m2),
  ]);

  return NextResponse.json({
    success: true,
    month1: {
      year: year1,
      month: m1,
      days: month1Prices,
    },
    month2: {
      year: year2,
      month: m2,
      days: month2Prices,
    },
  });
}
