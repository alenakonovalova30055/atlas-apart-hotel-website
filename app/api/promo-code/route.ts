import { NextRequest, NextResponse } from 'next/server'

const SHELTER_API_KEY = process.env.SHELTER_API_KEY
const SHELTER_HOTEL_ID = process.env.SHELTER_HOTEL_ID || '6903'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, apartmentId, checkIn, checkOut, totalPrice } = body

    if (!code) {
      return NextResponse.json({ valid: false, message: 'Промокод не указан' })
    }

    if (!SHELTER_API_KEY) {
      console.error('[PromoCode] SHELTER_API_KEY not configured')
      return NextResponse.json({ valid: false, message: 'Сервис временно недоступен' })
    }

    // Проверяем промокод через Shelter API
    // API endpoint для проверки промокода: /online/api/discount-promo/check
    const shelterUrl = `https://online.shelter.org.ua/online/api/discount-promo/check`
    
    const response = await fetch(shelterUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': SHELTER_API_KEY,
      },
      body: JSON.stringify({
        hotelID: parseInt(SHELTER_HOTEL_ID),
        promoCode: code.trim().toUpperCase(),
        checkIn: checkIn,
        checkOut: checkOut,
      })
    })

    if (!response.ok) {
      console.error('[PromoCode] Shelter API error:', response.status)
      // Попробуем альтернативный способ - проверить через список промокодов
      return await checkPromoCodeAlternative(code, totalPrice)
    }

    const data = await response.json()
    console.log('[PromoCode] Shelter response:', data)

    if (data.success && data.discount) {
      return NextResponse.json({
        valid: true,
        discount: data.discount.value || 0,
        discountType: data.discount.type || 'percent', // 'percent' или 'fixed'
        message: `Скидка ${data.discount.value}${data.discount.type === 'percent' ? '%' : '₽'} применена!`
      })
    }

    return NextResponse.json({
      valid: false,
      message: data.message || 'Промокод недействителен или истек'
    })

  } catch (error) {
    console.error('[PromoCode] Error:', error)
    return NextResponse.json({
      valid: false,
      message: 'Ошибка проверки промокода'
    })
  }
}

// Альтернативная проверка если основной API не работает
async function checkPromoCodeAlternative(code: string, totalPrice: number) {
  try {
    // Список известных промокодов (можно расширить)
    // Эти промокоды должны быть синхронизированы с Shelter
    const knownPromoCodes: Record<string, { discount: number; type: 'percent' | 'fixed'; message: string; minNights?: number }> = {
      // Добавьте сюда промокоды из Shelter
      // 'WELCOME10': { discount: 10, type: 'percent', message: 'Скидка 10% для новых гостей!' },
      // 'SUMMER2026': { discount: 15, type: 'percent', message: 'Летняя скидка 15%!' },
    }

    const promoInfo = knownPromoCodes[code.toUpperCase()]
    
    if (promoInfo) {
      const discountAmount = promoInfo.type === 'percent' 
        ? Math.round(totalPrice * promoInfo.discount / 100)
        : promoInfo.discount

      return NextResponse.json({
        valid: true,
        discount: discountAmount,
        discountType: promoInfo.type,
        message: promoInfo.message
      })
    }

    return NextResponse.json({
      valid: false,
      message: 'Промокод не найден'
    })
  } catch {
    return NextResponse.json({
      valid: false,
      message: 'Ошибка проверки промокода'
    })
  }
}
