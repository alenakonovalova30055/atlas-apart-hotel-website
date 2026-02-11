import { NextResponse } from 'next/server'
import { apartments } from '@/lib/apartments-data'

const STRAPI_URL = process.env.STRAPI_URL
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN

// Shelter category ID mapping
const SHELTER_CATEGORY_MAPPING: Record<string, number> = {
  'azure': 56018,
  'sea-deluxe': 56019,
  'sunrise-terrace': 56020
}

// Strapi field mapping based on your Content Type schema
interface StrapiApartmentData {
  title: string       // maps to name
  slug: string
  description: string
  size: string
  maxguests: number   // lowercase in Strapi
  rooms: string
  price: number       // was basePrice
  shelterCategoryId: number
  amenities: string   // JSON string
  active: boolean     // was isActive
  sortOrder: number   // was order
}

export async function POST() {
  if (!STRAPI_URL || !STRAPI_API_TOKEN) {
    return NextResponse.json({
      success: false,
      error: 'Missing STRAPI_URL or STRAPI_API_TOKEN'
    }, { status: 400 })
  }

  const results: Array<{ id: string; success: boolean; error?: string }> = []

  for (let i = 0; i < apartments.length; i++) {
    const apt = apartments[i]
    
    // Only import real apartments (with Shelter ID)
    if (!SHELTER_CATEGORY_MAPPING[apt.id]) {
      continue
    }

    try {
      // Prepare data for Strapi - matching your Content Type schema
      const strapiData: StrapiApartmentData = {
        title: apt.name,
        slug: apt.id,
        description: apt.description,
        size: apt.size,
        maxguests: parseInt(apt.guests.match(/\d+/)?.[0] || '4'),
        rooms: apt.rooms,
        price: apt.price,
        shelterCategoryId: SHELTER_CATEGORY_MAPPING[apt.id],
        amenities: JSON.stringify(apt.amenities),
        active: true,
        sortOrder: i
      }

      // Log what we're sending for debugging
      console.log('[v0] Sending to Strapi:', JSON.stringify(strapiData, null, 2))

      // Check if apartment already exists
      const checkResponse = await fetch(
        `${STRAPI_URL}/api/apartments?filters[slug][$eq]=${apt.id}`,
        {
          headers: {
            'Authorization': `Bearer ${STRAPI_API_TOKEN}`
          }
        }
      )

      if (!checkResponse.ok) {
        results.push({
          id: apt.id,
          success: false,
          error: `Check failed: ${checkResponse.status}`
        })
        continue
      }

      const existingData = await checkResponse.json()
      const existingArray = existingData.data || existingData
      
      if (Array.isArray(existingArray) && existingArray.length > 0) {
        // Update existing
        const existingId = existingArray[0].id || existingArray[0].documentId
        const updateResponse = await fetch(
          `${STRAPI_URL}/api/apartments/${existingId}`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: strapiData })
          }
        )

        if (updateResponse.ok) {
          results.push({ id: apt.id, success: true })
        } else {
          const errorData = await updateResponse.json().catch(() => null)
          results.push({
            id: apt.id,
            success: false,
            error: `Update failed: ${JSON.stringify(errorData)}`
          })
        }
      } else {
        // Create new - Strapi v5 format
        const createResponse = await fetch(
          `${STRAPI_URL}/api/apartments`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: strapiData })
          }
        )

        if (createResponse.ok) {
          results.push({ id: apt.id, success: true })
        } else {
          const errorData = await createResponse.json().catch(() => null)
          console.log('[v0] Strapi error response:', JSON.stringify(errorData, null, 2))
          results.push({
            id: apt.id,
            success: false,
            error: `Create failed: ${JSON.stringify(errorData)}`
          })
        }
      }
    } catch (error) {
      results.push({
        id: apt.id,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  const successful = results.filter(r => r.success).length
  const failed = results.filter(r => !r.success).length

  return NextResponse.json({
    success: failed === 0,
    imported: successful,
    failed,
    results
  })
}

// GET - show what will be imported
export async function GET() {
  const toImport = apartments
    .filter(apt => SHELTER_CATEGORY_MAPPING[apt.id])
    .map(apt => ({
      id: apt.id,
      name: apt.name,
      shelterCategoryId: SHELTER_CATEGORY_MAPPING[apt.id],
      price: apt.price
    }))

  return NextResponse.json({
    message: 'Apartments ready for import to Strapi',
    count: toImport.length,
    apartments: toImport,
    instruction: 'POST to this endpoint to import apartments'
  })
}
