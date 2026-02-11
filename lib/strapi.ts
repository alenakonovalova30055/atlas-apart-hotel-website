// Strapi API client with timeout handling

const STRAPI_URL = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || process.env.NEXT_PUBLIC_STRAPI_API_TOKEN

interface StrapiApartment {
  id: string
  title?: string
  slug?: string
  description?: string
  shortDescription?: string
  rooms?: string
  image?: string | string[]
  price?: number
  size?: string | number
  maxguests?: number
  guests?: string
  amenities?: string[]
  fullAmenities?: string[] | Array<{ title: string; description: string; included: boolean }>
  amenity?: Array<{ title: string; description: string; included: boolean }>
  isActive?: boolean
  active?: boolean
  isAvailable?: boolean
  bedroom?: number
  bathroom?: number
  roomCount?: number
  rooms?: number
  rules?: { checkIn: string; checkOut: string; smoking: boolean; pets: boolean; description: string }
  bonuses?: Array<{ title: string; description: string; included: boolean }>
  bonus?: Array<{ Title: string; description: string; included: boolean }>
}

/**
 * Fetch apartments from Strapi with timeout handling
 * Timeout is set to 30 seconds to handle slow responses
 */
export async function getApartments(): Promise<any[]> {
  if (!STRAPI_URL || !STRAPI_API_TOKEN) {
    console.log('[Strapi] Missing configuration, skipping Strapi')
    return []
  }

  try {
    // Create AbortController for timeout handling
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    const response = await fetch(`${STRAPI_URL}/api/apartments`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!response.ok) {
      console.error(`[Strapi] API returned ${response.status}`)
      return []
    }

    const data = await response.json()
    const apartments = data.data || []

    // Transform Strapi response to match expected format
    return apartments.map((item: any) => {
      const apt: StrapiApartment = item.attributes || item
      
      // Normalize amenities
      const fullAmenities = apt.amenity || apt.fullAmenities || []
      
      // Normalize bonuses
      const bonuses = (apt.bonus || apt.bonuses || []).map((b: any) => ({
        title: b.Title || b.title,
        description: b.description,
        included: b.included
      }))

      return {
        id: apt.slug || item.documentId || item.id,
        name: apt.title,
        description: apt.description,
        shortDescription: apt.shortDescription,
        rooms: apt.rooms,
        image: apt.image,
        price: apt.price,
        size: typeof apt.size === 'number' ? `${apt.size} м²` : apt.size,
        guests: apt.guests || (apt.maxguests ? `до ${apt.maxguests} гостей` : undefined),
        amenities: apt.amenities || [],
        fullAmenities,
        isAvailable: apt.active ?? apt.isActive ?? apt.isAvailable ?? true,
        bedroom: apt.bedroom,
        bathroom: apt.bathroom,
        roomCount: apt.roomCount || apt.rooms,
        rules: apt.rules,
        bonuses,
      }
    })
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('[Strapi] Request timeout after 30 seconds')
    } else {
      console.error('[Strapi] Error fetching apartments:', error)
    }
    return []
  }
}
