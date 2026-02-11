import { NextResponse } from 'next/server'
import { getApartmentById, apartments as fallbackData } from '@/lib/apartments-data'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const apartment = await getApartmentById(id)
    if (apartment) {
      return NextResponse.json(apartment)
    }
  } catch {
    // Strapi unavailable - fall through to local data
  }
  
  // Fallback to local data
  const localApt = fallbackData.find(apt => apt.id === id)
  if (localApt) {
    return NextResponse.json(localApt)
  }
  
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
