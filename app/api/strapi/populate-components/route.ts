import { NextResponse } from 'next/server'

const STRAPI_URL = 'https://whimsical-laughter-bb3c04df0e.strapiapp.com'
const STRAPI_TOKEN = 'f10c68d75349960ef64637fadf78996bf5388110dccd846dfa76dfbc1b88ba65bd3ea697d4c2d77ddbf76117316135731a1871966a7431acc724f284f04df25d3facf89bc52f066b5887c83076709ebdf0826609628d5a88042e5e6ebfb1300513558fe14665e515aafbde13cda59e6598168ee94d0cba72c2c04d047c97fe58'

async function strapiGet(endpoint: string) {
  const res = await fetch(`${STRAPI_URL}/api${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${STRAPI_TOKEN}`,
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) return null
  const text = await res.text()
  try { return JSON.parse(text) } catch { return null }
}

async function strapiPut(endpoint: string, data: Record<string, unknown>) {
  const res = await fetch(`${STRAPI_URL}/api${endpoint}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${STRAPI_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data }),
  })
  const text = await res.text()
  let json
  try { json = JSON.parse(text) } catch { json = { raw: text } }
  return { status: res.status, ok: res.ok, data: json }
}

// Component data for each apartment
const apartmentComponents: Record<string, {
  amenity: Array<{ title: string; description: string; included: boolean }>;
  rules: { checkIn: string; checkOut: string; smoking: boolean; pets: boolean; description: string };
  bonus: Array<{ Title: string; description: string; included: boolean }>;
}> = {
  azure: {
    amenity: [
      { title: 'Кондиционер', description: 'Индивидуальный климат-контроль', included: true },
      { title: 'Wi-Fi', description: 'Высокоскоростной интернет', included: true },
      { title: 'Smart TV', description: 'Телевизор с подпиской', included: true },
      { title: 'Голосовой помощник Алиса', description: '', included: true },
      { title: 'Кухня', description: 'Полностью оборудованная', included: true },
      { title: 'Холодильник', description: '', included: true },
      { title: 'Стиральная машина', description: '', included: true },
      { title: 'Посудомоечная машина', description: '', included: true },
      { title: 'Кофемашина', description: '', included: true },
      { title: 'Фен', description: '', included: true },
      { title: 'Выпрямитель для волос', description: '', included: true },
      { title: 'Халаты', description: 'Взрослые и детские', included: true },
      { title: 'Тапочки', description: '', included: true },
      { title: 'Премиум косметика', description: '', included: true },
      { title: 'Полотенца', description: 'Для апартаментов и пляжа', included: true },
      { title: 'Утюг', description: '', included: true },
      { title: 'Настольные игры', description: '', included: true },
      { title: 'Детская кроватка', description: 'По запросу', included: false },
    ],
    rules: { checkIn: '14:00', checkOut: '12:00', smoking: false, pets: false, description: 'Тихий час с 23:00 до 8:00' },
    bonus: [
      { Title: 'Подогреваемый бассейн', description: 'Посещение подогреваемого бассейна входит в стоимость проживания', included: true },
      { Title: 'Пляжные полотенца', description: 'Комплект полотенец для пляжа', included: true },
    ],
  },
  'sea-deluxe': {
    amenity: [
      { title: 'Кондиционер', description: '', included: true },
      { title: 'Wi-Fi', description: '', included: true },
      { title: 'Балкон', description: 'С видом на море', included: true },
      { title: 'Кухня', description: '', included: true },
      { title: 'Микроволновая печь', description: '', included: true },
      { title: 'Телевизор', description: '', included: true },
      { title: 'Кофемашина', description: '', included: true },
      { title: 'Индукционная плита', description: '', included: true },
      { title: 'Стиральная машина', description: '', included: true },
      { title: 'Фен', description: '', included: true },
      { title: 'Холодильник', description: '', included: true },
      { title: 'Халаты', description: 'Взрослые и детские', included: true },
      { title: 'Тапочки', description: '', included: true },
      { title: 'Премиум косметика', description: '', included: true },
      { title: 'Полотенца', description: 'Для апартаментов и пляжа', included: true },
      { title: 'Утюг', description: '', included: true },
      { title: 'Настольные игры', description: '', included: true },
      { title: 'Детская кроватка', description: 'По запросу', included: false },
    ],
    rules: { checkIn: '14:00', checkOut: '12:00', smoking: false, pets: false, description: 'Тихий час с 23:00 до 8:00' },
    bonus: [
      { Title: 'Вид на море', description: 'Панорамный вид с балкона', included: true },
      { Title: 'Подогреваемый бассейн', description: 'Посещение подогреваемого бассейна входит в стоимость проживания', included: true },
    ],
  },
  'sunrise-terrace': {
    amenity: [
      { title: 'Кондиционер', description: '', included: true },
      { title: 'Wi-Fi', description: '', included: true },
      { title: 'Smart TV', description: '', included: true },
      { title: 'Голосовой помощник Алиса', description: '', included: true },
      { title: 'Кухня', description: 'Полностью оборудованная', included: true },
      { title: 'Холодильник', description: '', included: true },
      { title: 'Стиральная машина', description: '', included: true },
      { title: 'Посудомоечная машина', description: '', included: true },
      { title: 'Кофемашина', description: '', included: true },
      { title: 'Фен', description: '', included: true },
      { title: 'Фен-выпрямитель для волос', description: '', included: true },
      { title: 'Сейф', description: '', included: true },
      { title: 'Халаты', description: 'Взрослые и детские', included: true },
      { title: 'Тапочки', description: '', included: true },
      { title: 'Премиум косметика', description: '', included: true },
      { title: 'Полотенца', description: 'С регулярной заменой', included: true },
      { title: 'Пляжные полотенца', description: 'С регулярной заменой', included: true },
      { title: 'Утюг', description: '', included: true },
      { title: 'Настольные игры', description: '', included: true },
      { title: 'Детская кроватка', description: 'По запросу', included: false },
    ],
    rules: { checkIn: '14:00', checkOut: '12:00', smoking: false, pets: false, description: 'Тихий час с 23:00 до 8:00' },
    bonus: [
      { Title: 'Терраса', description: 'Приватная терраса с видом на море', included: true },
      { Title: 'Подогреваемый бассейн', description: 'Посещение подогреваемого бассейна входит в стоимость проживания', included: true },
    ],
  },
}

export async function POST() {
  const results: Record<string, any> = {}

  for (const [slug, components] of Object.entries(apartmentComponents)) {
    // Find apartment by slug
    const existing = await strapiGet(`/apartments?filters[slug][$eq]=${slug}`)
    const docId = existing?.data?.[0]?.documentId

    if (!docId) {
      results[slug] = { error: `Apartment with slug "${slug}" not found in Strapi` }
      continue
    }

    // Try updating with component fields
    const r = await strapiPut(`/apartments/${docId}`, components as any)
    results[slug] = {
      documentId: docId,
      ...r,
    }
  }

  return NextResponse.json({
    success: true,
    message: 'Component population attempt complete',
    hint: 'If you see "Invalid key" errors, you need to add the component fields to Apartment in Content-Type Builder first. See instructions below.',
    instructions: {
      step1: 'Go to Strapi Admin -> Content-Type Builder -> Apartment',
      step2: 'Click "Add another field" -> Component',
      step3_amenity: 'Name: amenity, Type: Repeatable, Component: apartment.amenity (existing)',
      step4_rules: 'Name: rules, Type: Single, Component: apartment.rules (existing)',
      step5_bonus: 'Name: bonus, Type: Repeatable, Component: apartment.bonus (existing)',
      step6: 'Click Save (Strapi will restart)',
      step7: 'Come back here and click "Add Amenities/Rules/Bonuses" again',
    },
    results,
  })
}
