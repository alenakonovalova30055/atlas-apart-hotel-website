import { NextResponse } from 'next/server'

const STRAPI_URL = 'https://whimsical-laughter-bb3c04df0e.strapiapp.com'
const STRAPI_TOKEN = 'f10c68d75349960ef64637fadf78996bf5388110dccd846dfa76dfbc1b88ba65bd3ea697d4c2d77ddbf76117316135731a1871966a7431acc724f284f04df25d3facf89bc52f066b5887c83076709ebdf0826609628d5a88042e5e6ebfb1300513558fe14665e515aafbde13cda59e6598168ee94d0cba72c2c04d047c97fe58'

export async function GET() {
  if (!STRAPI_URL || !STRAPI_TOKEN) {
    return NextResponse.json({ error: 'STRAPI_URL or STRAPI_API_TOKEN not set' }, { status: 500 })
  }

  console.log('[v0] Strapi URL:', STRAPI_URL)
  console.log('[v0] Strapi Token set:', !!STRAPI_TOKEN)

  const found: Record<string, unknown> = {}
  const notFound: string[] = []

  try {
    const endpoints = [
      '/api/apartments',
      '/api/categories',
      '/api/attractions',
      '/api/promotions',
      '/api/infrastructure-items',
      '/api/articles',
      '/api/authors',
      '/api/home',
      '/api/single-type',
      '/api/about',
      '/api/global',
    ]

    for (const endpoint of endpoints) {
      try {
        const res = await fetch(`${STRAPI_URL}${endpoint}?populate=*`, {
          headers: {
            'Authorization': `Bearer ${STRAPI_TOKEN}`,
            'Content-Type': 'application/json',
          },
        })
        
        if (res.ok) {
          const data = await res.json()
          found[endpoint] = data
          console.log(`[v0] FOUND: ${endpoint}`, JSON.stringify(data).slice(0, 500))
        } else {
          notFound.push(`${endpoint} (${res.status})`)
        }
      } catch (e) {
        notFound.push(`${endpoint} (error: ${String(e)})`)
      }
    }

    console.log('[v0] Found endpoints:', Object.keys(found))
    console.log('[v0] Not found:', notFound)

    return NextResponse.json({
      strapiUrl: STRAPI_URL,
      tokenSet: !!STRAPI_TOKEN,
      foundEndpoints: Object.keys(found),
      found,
      notFound,
    })
  } catch (error) {
    console.error('[v0] Error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
