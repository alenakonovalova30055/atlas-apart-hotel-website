import { NextResponse } from "next/server";
import { checkAvailability } from "@/lib/shelter";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { apartmentId, checkIn, checkOut, adults, childrenAges } = body;

    if (!apartmentId || !checkIn || !checkOut || !adults) {
      return NextResponse.json(
        { success: false, error: "Не все параметры указаны" },
        { status: 400 }
      );
    }

    // Проверяем доступность в Shelter
    const result = await checkAvailability({
      apartmentId,
      checkIn,
      checkOut,
      adults: parseInt(adults, 10),
      childrenAges: childrenAges || undefined,
    });

    if (!result.available) {
      return NextResponse.json({
        success: false,
        available: false,
        error: result.error || "Номер недоступен на выбранные даты",
      });
    }

    // Вычисляем количество ночей
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

    return NextResponse.json({
      success: true,
      available: true,
      room: result.room,
      variant: result.variant,
      // Все доступные варианты с разными тарифами
      allVariants: result.allVariants,
      // Словарь тарифов: id -> name
      tariffs: result.tariffs,
      nights,
      // Если есть данные из Online API - используем их, иначе null (фронт возьмет локальную цену)
      pricePerNight: result.variant ? Math.round(result.variant.price / nights) : null,
      totalPrice: result.variant?.price || null,
    });
  } catch (error) {
    console.error("[Availability API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Ошибка проверки доступности" },
      { status: 500 }
    );
  }
}
