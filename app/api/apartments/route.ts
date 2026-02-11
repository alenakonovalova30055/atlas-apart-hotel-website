import { NextResponse } from 'next/server'
import { loadApartments, apartments as fallbackData } from '@/lib/apartments-data'

export async function GET() {
  try {
    const apartments = await loadApartments()
    if (apartments && apartments.length > 0) {
      return NextResponse.json(apartments)
    }
  } catch (error) {
    // Strapi unavailable - fall through to local data
  }
  
  // Always return local data if Strapi fails
  return NextResponse.json(fallbackData)
}
