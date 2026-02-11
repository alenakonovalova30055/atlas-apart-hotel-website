// Strapi CMS Client
// Handles all communication with Strapi headless CMS

const STRAPI_URL = 'https://whimsical-laughter-bb3c04df0e.strapiapp.com'
const STRAPI_API_TOKEN = 'f10c68d75349960ef64637fadf78996bf5388110dccd846dfa76dfbc1b88ba65bd3ea697d4c2d77ddbf76117316135731a1871966a7431acc724f284f04df25d3facf89bc52f066b5887c83076709ebdf0826609628d5a88042e5e6ebfb1300513558fe14665e515aafbde13cda59e6598168ee94d0cba72c2c04d047c97fe58'

// --- Types ---

export interface StrapiImage {
  id: number
  url: string
  alternativeText?: string
  width?: number
  height?: number
  formats?: {
    thumbnail?: { url: string }
    small?: { url: string }
    medium?: { url: string }
    large?: { url: string }
  }
}

export interface StrapiApartment {
  id: number
  documentId: string
  title: string
  slug: string
  description: string
  shortDescription?: string
  maxguests: number
  price: number
  active: boolean
  sortOrder: number
  images?: StrapiImage[]
  size: number
  bedroom: number
  bathroom: number
  rooms: number
  category?: StrapiCategory
  amenities?: Array<{ title: string; description: string; included: boolean }>
  rules?: { checkIn: string; checkOut: string; smoking: boolean; pets: boolean; description: string }
  bonuses?: Array<{ Title: string; description: string; included: boolean }>
  seo?: { metaTitle: string; metadesctiption: string; ogImage?: StrapiImage }
}

export interface StrapiCategory {
  id: number
  documentId: string
  title: string
  slug: string
  order: number
  active: boolean
}

export interface StrapiAttraction {
  id: number
  documentId: string
  text: string
  slug: string
  type: string
  image?: StrapiImage
  time: string
  difficulty: string
  height: number
  order: number
  antive: boolean
  description?: string
  seo?: { metaTitle: string; metadesctiption: string; ogImage?: StrapiImage }
}

export interface StrapiPromotion {
  id: number
  documentId: string
  title: string
  badge?: string
  conditions: string
  validFrom: string
  ValidTo: string
  active: boolean
  order: number
  description?: string
  code?: string
  shortText?: string
  icon?: StrapiImage
  showInBooking: boolean
}

export interface StrapiInfrastructureItem {
  id: number
  documentId: string
  title: string
  subtitle?: string
  description?: string
  image?: StrapiImage
  order: number
  active: boolean
}

export interface StrapiHome {
  heroTitle: string
  heroSubtitle: string
  heroText: string
  heroImage?: StrapiImage[]
  aboutTitle: string
  aboutText: string
  aboutImages?: StrapiImage[]
}

export interface StrapiSettings {
  adress: string
  phone: string
  email: string
  checkInTime: string
  checkOutTime: string
  telegram: string
  max: string
}

export interface StrapiGlobal {
  siteName: string
  favicon?: StrapiImage
  siteDescription: string
  defaultSeo?: {
    metaTitle: string
    metaDescription: string
    shareImage?: StrapiImage
  }
}

// --- Exported Apartment type for site usage ---

export interface Apartment {
  id: string
  name: string
  description: string
  shortDescription?: string
  size: string
  guests: string
  rooms: string
  price: number
  amenities: string[]
  fullAmenities: Array<{ title: string; description: string; included: boolean }> | string[]
  image: string[]
  isActive: boolean
  order: number
  bedroom: number
  bathroom: number
  roomCount: number
  rules?: { checkIn: string; checkOut: string; smoking: boolean; pets: boolean; description: string }
  bonuses?: Array<{ title: string; description: string; included: boolean }>
}

// --- Helpers ---

function getImageUrl(url: string): string {
  if (!url) return '/placeholder.svg'
  if (url.startsWith('http')) return url
  return `${STRAPI_URL}${url}`
}

function transformApartment(apt: StrapiApartment): Apartment {
  const images: string[] = []
  if (apt.images && Array.isArray(apt.images)) {
    for (const img of apt.images) {
      const url = img.url || (img as any)?.attributes?.url
      if (url) images.push(getImageUrl(url))
    }
  }

  // Strapi component fields: amenity (repeatable), rules (single), bonus (repeatable)
  // Also handle legacy field names: amenities, bonuses
  const amenityData = (apt as any).amenity || apt.amenities || []
  const amenityTitles = amenityData.filter((a: any) => a.included).map((a: any) => a.title)
  const bonusData = (apt as any).bonus || apt.bonuses || []

  return {
    id: apt.slug || `apartment-${apt.id}`,
    name: apt.title,
    description: apt.description || '',
    shortDescription: apt.shortDescription,
    size: `${apt.size} м²`,
    guests: `до ${apt.maxguests} гостей`,
    rooms: apt.bedroom && apt.rooms && apt.bathroom
      ? `${apt.bedroom} спальн${apt.bedroom > 1 ? 'и' : 'я'} + ${apt.rooms - apt.bedroom} гостиная + ${apt.bathroom} ванн${apt.bathroom > 1 ? 'ые' : 'ая'}`
      : apt.bedroom ? `${apt.bedroom} спальн${apt.bedroom > 1 ? 'и' : 'я'}` : '',
    price: apt.price,
    amenities: amenityTitles.slice(0, 4),
    fullAmenities: amenityData,
    image: images.length > 0 ? images : ['/placeholder.svg'],
    isActive: apt.active ?? true,
    order: apt.sortOrder ?? 0,
    bedroom: apt.bedroom || 1,
    bathroom: apt.bathroom || 1,
    roomCount: apt.rooms || 2,
    rules: apt.rules,
    bonuses: bonusData.map((b: any) => ({ title: b.Title || b.title, description: b.description, included: b.included })),
  }
}

// --- Fetch helper ---

async function strapiRequest<T>(endpoint: string): Promise<T | null> {
  const url = `${STRAPI_URL}/api${endpoint}`
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  if (STRAPI_API_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    const response = await fetch(url, {
      headers,
      cache: 'no-store',
      signal: controller.signal,
    })
    clearTimeout(timeout)
    if (!response.ok) {
      const body = await response.text().catch(() => '')
      console.log(`[v0] Strapi ${response.status} for ${endpoint}: ${body.slice(0, 200)}`)
      return null
    }
    const json = await response.json()
    return json.data ?? json
  } catch {
    return null
  }
}

// --- Public API ---

export async function getApartments(): Promise<Apartment[]> {
  const data = await strapiRequest<StrapiApartment[]>('/apartments?populate=*')
  if (!data || !Array.isArray(data)) return []
  // Sort by sortOrder client-side (avoids Strapi 400 if field doesn't exist)
  const sorted = [...data].sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999))
  // Filter active client-side
  const active = sorted.filter(a => a.active !== false)
  return active.map(transformApartment)
}

export async function getAllApartments(): Promise<Apartment[]> {
  const data = await strapiRequest<StrapiApartment[]>('/apartments?populate=*')
  if (!data || !Array.isArray(data)) return []
  const sorted = [...data].sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999))
  return sorted.map(transformApartment)
}

export async function getApartmentBySlug(slug: string): Promise<Apartment | null> {
  const data = await strapiRequest<StrapiApartment[]>(`/apartments?populate=*&filters[slug][$eq]=${slug}`)
  if (!data || !Array.isArray(data) || data.length === 0) return null
  return transformApartment(data[0])
}

export async function getApartmentById(id: string): Promise<Apartment | null> {
  return getApartmentBySlug(id)
}

export async function getCategories(): Promise<StrapiCategory[]> {
  const data = await strapiRequest<StrapiCategory[]>('/categories?populate=*')
  if (!data || !Array.isArray(data)) return []
  return [...data].filter(c => c.active !== false).sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
}

export async function getAttractions(): Promise<StrapiAttraction[]> {
  const data = await strapiRequest<StrapiAttraction[]>('/attractions?populate=*')
  if (!data || !Array.isArray(data)) return []
  return [...data].filter(a => a.antive !== false).sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
}

export async function getPromotions(): Promise<StrapiPromotion[]> {
  const data = await strapiRequest<StrapiPromotion[]>('/promotions?populate=*')
  if (!data || !Array.isArray(data)) return []
  return [...data].filter(p => p.active !== false).sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
}

export async function getInfrastructureItems(): Promise<StrapiInfrastructureItem[]> {
  const data = await strapiRequest<StrapiInfrastructureItem[]>('/infrastructure-items?populate=*')
  if (!data || !Array.isArray(data)) return []
  return [...data].filter(i => i.active !== false).sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
}

export async function getHomePage(): Promise<StrapiHome | null> {
  // Home is a single type
  const data = await strapiRequest<StrapiHome>('/home?populate=*')
  if (data) return data
  // Fallback: try as collection type
  const arr = await strapiRequest<StrapiHome[]>('/homes?populate=*')
  if (Array.isArray(arr) && arr.length > 0) return arr[0]
  return null
}

export async function getSettings(): Promise<StrapiSettings | null> {
  return strapiRequest<StrapiSettings>('/single-type')
}

export async function getGlobalSettings(): Promise<StrapiGlobal | null> {
  return strapiRequest<StrapiGlobal>('/global?populate=*')
}

export async function checkStrapiConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/apartments`, {
      headers: STRAPI_API_TOKEN ? { 'Authorization': `Bearer ${STRAPI_API_TOKEN}` } : {},
    })
    return response.ok
  } catch {
    return false
  }
}
