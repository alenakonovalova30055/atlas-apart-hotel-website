// Конфигурация платежной системы
// Универсальный слой - меняется только здесь при смене провайдера

export type PaymentProvider = 'moneta' | 'cloudpayments' | 'yookassa' | 'stripe'

interface PaymentConfig {
  provider: PaymentProvider
  // Монета (текущий)
  moneta?: {
    accountId: string
    testMode: boolean
  }
  // CloudPayments (будущий)
  cloudpayments?: {
    publicId: string
  }
  // ЮKassa (будущий)
  yookassa?: {
    shopId: string
  }
  // Stripe (будущий)
  stripe?: {
    publicKey: string
  }
}

// Текущая конфигурация - меняется при смене провайдера
export const paymentConfig: PaymentConfig = {
  provider: 'moneta',
  moneta: {
    accountId: process.env.MONETA_ACCOUNT_ID || '',
    testMode: process.env.NODE_ENV !== 'production',
  },
}

// Получить процент предоплаты из тарифа Shelter
// prepaymentType: 0 = процент, 1 = фиксированная сумма
export function calculatePrepayment(
  totalPrice: number,
  prepaymentPercent: number,
  prepaymentType: number = 0
): number {
  if (prepaymentType === 0) {
    // Процент от суммы
    return Math.ceil(totalPrice * (prepaymentPercent / 100))
  } else {
    // Фиксированная сумма
    return prepaymentPercent
  }
}

// Генерация ссылки на оплату для текущего провайдера
export function generatePaymentUrl(params: {
  orderId: string
  amount: number
  description: string
  email: string
  phone?: string
  successUrl: string
  failUrl: string
}): string {
  const { provider } = paymentConfig

  switch (provider) {
    case 'moneta': {
      // Монета использует форму на их сайте
      const baseUrl = paymentConfig.moneta?.testMode
        ? 'https://demo.moneta.ru/assistant.htm'
        : 'https://www.moneta.ru/assistant.htm'
      
      const urlParams = new URLSearchParams({
        MNT_ID: paymentConfig.moneta?.accountId || '',
        MNT_TRANSACTION_ID: params.orderId,
        MNT_AMOUNT: params.amount.toFixed(2),
        MNT_CURRENCY_CODE: 'RUB',
        MNT_DESCRIPTION: params.description,
        MNT_SUCCESS_URL: params.successUrl,
        MNT_FAIL_URL: params.failUrl,
        MNT_SUBSCRIBER_ID: params.email,
      })
      
      return `${baseUrl}?${urlParams.toString()}`
    }
    
    case 'cloudpayments':
    case 'yookassa':
    case 'stripe':
      // Заглушки для будущих провайдеров
      // При переключении нужно будет реализовать логику
      return ''
    
    default:
      return ''
  }
}

// Тип предоплаты для отображения
export function getPrepaymentTypeLabel(prepaymentType: number): string {
  return prepaymentType === 0 ? 'от стоимости' : 'фиксированная сумма'
}
