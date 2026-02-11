import { NextResponse } from 'next/server'

const STRAPI_URL = process.env.STRAPI_URL
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN

export async function GET() {
  if (!STRAPI_URL || !STRAPI_API_TOKEN) {
    return NextResponse.json({
      connected: false,
      error: 'Missing STRAPI_URL or STRAPI_API_TOKEN environment variables'
    })
  }

  try {
    // Check connection
    const response = await fetch(`${STRAPI_URL}/api/apartments`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`
      }
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json({
        connected: true,
        url: STRAPI_URL,
        apartmentsCount: data.data?.length || 0,
        hasApartmentsContentType: true
      })
    } else if (response.status === 404) {
      return NextResponse.json({
        connected: true,
        url: STRAPI_URL,
        apartmentsCount: 0,
        hasApartmentsContentType: false,
        message: 'Content Type "apartments" not found. Please create it in Strapi admin.'
      })
    } else {
      return NextResponse.json({
        connected: false,
        error: `API returned ${response.status}: ${await response.text()}`
      })
    }
  } catch (error) {
    return NextResponse.json({
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
