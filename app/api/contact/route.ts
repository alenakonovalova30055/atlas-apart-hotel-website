import { NextResponse } from 'next/server'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = '-4829925598'

export async function POST(request: Request) {
  try {
    const { name, phone, email, comment } = await request.json()

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: 'Имя и телефон обязательны' },
        { status: 400 }
      )
    }

    const message = [
      '📩 *Новая заявка с сайта*',
      '',
      `👤 *Имя:* ${name}`,
      `📞 *Телефон:* ${phone}`,
      email ? `📧 *Email:* ${email}` : '',
      comment ? `💬 *Комментарий:* ${comment}` : '',
      '',
      `🕐 *Время:* ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`,
    ].filter(Boolean).join('\n')

    if (!TELEGRAM_BOT_TOKEN) {
      console.error('[Contact API] TELEGRAM_BOT_TOKEN not set')
      return NextResponse.json(
        { success: false, error: 'Telegram bot token not configured' },
        { status: 500 }
      )
    }

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      }
    )

    const telegramData = await telegramResponse.json()

    if (!telegramData.ok) {
      console.error('[Contact API] Telegram error:', telegramData)
      return NextResponse.json(
        { success: false, error: 'Ошибка отправки сообщения' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Contact API] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}
