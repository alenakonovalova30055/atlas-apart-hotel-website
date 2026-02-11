'use client'

import { useRef } from "react"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Users, ChevronRight, Trash2, User, Mail, Phone, AlertCircle, Loader2, CheckCircle, XCircle, Home, CreditCard, Shield } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { useMultiBooking } from '@/contexts/multi-booking-context'

function formatDate(date: Date | null): string {
  if (!date) return ''
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatDateLong(date: Date | null): string {
  if (!date) return ''
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

interface GuestData {
  name: string
  lastName: string
  email: string
  phone: string
}

export default function GroupBookingPage() {
  const router = useRouter()
  const { 
    selectedApartments, 
    checkIn, 
    checkOut, 
    nights,
    totalPrice,
    removeApartment,
    clearAll,
    isHydrated,
    isLoading // Declare isLoading variable
  } = useMultiBooking()
  
  const [guestData, setGuestData] = useState<Record<string, GuestData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingResults, setBookingResults] = useState<{aptId: string, code: string | null, success: boolean}[]>([])
  const [bookingStep, setBookingStep] = useState<'guest' | 'prepay' | 'payment' | 'success'>('guest')
  const [prepaymentPercent] = useState(30) // 30% предоплаты
  
  // Initialize guest data for each apartment
  useEffect(() => {
    const initialData: Record<string, GuestData> = {}
    selectedApartments.forEach(apt => {
      if (!guestData[apt.id]) {
        initialData[apt.id] = { name: '', lastName: '', email: '', phone: '' }
      }
    })
    if (Object.keys(initialData).length > 0) {
      setGuestData(prev => ({ ...prev, ...initialData }))
    }
  }, [selectedApartments])
  
  // Redirect only after hydration is complete and apartments are empty
  useEffect(() => {
    if (isHydrated && selectedApartments.length === 0) {
      router.push('/')
    }
  }, [isHydrated, selectedApartments.length, router])
  
  const updateGuestData = (aptId: string, field: keyof GuestData, value: string) => {
    setGuestData(prev => ({
      ...prev,
      [aptId]: { ...prev[aptId], [field]: value }
    }))
    // Clear error when user types
    if (errors[`${aptId}-${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[`${aptId}-${field}`]
        return newErrors
      })
    }
  }
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    selectedApartments.forEach(apt => {
      const data = guestData[apt.id]
      if (!data?.name?.trim()) newErrors[`${apt.id}-name`] = 'Укажите имя'
      if (!data?.lastName?.trim()) newErrors[`${apt.id}-lastName`] = 'Укажите фамилию'
      if (!data?.email?.trim()) newErrors[`${apt.id}-email`] = 'Укажите email'
      else if (!/\S+@\S+\.\S+/.test(data.email)) newErrors[`${apt.id}-email`] = 'Неверный формат email'
      if (!data?.phone?.trim()) newErrors[`${apt.id}-phone`] = 'Укажите телефон'
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  // Вычисляем сумму предоплаты
  const prepaymentAmount = Math.ceil(totalPrice * (prepaymentPercent / 100))
  
  const handleSubmit = async () => {
    // Step 1: Validate guest data and go to prepay
    if (bookingStep === 'guest') {
      if (!validateForm()) return
      setBookingStep('prepay')
      return
    }
    
    // Step 2: Process payment AND create bookings in Shelter immediately after payment
    if (bookingStep === 'prepay') {
      setIsSubmitting(true)
      const results: {aptId: string, code: string | null, success: boolean}[] = []
      
      try {
        // Симуляция оплаты (в реальности - редирект на платежную систему)
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // После успешной оплаты сразу создаем бронирования в Shelter
        for (const apt of selectedApartments) {
          const guest = guestData[apt.id]
          const guestName = `${guest.lastName} ${guest.name}`.trim()
          
          try {
            const response = await fetch('/api/booking', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                apartmentId: apt.id,
                checkIn: checkIn?.toISOString().split('T')[0],
                checkOut: checkOut?.toISOString().split('T')[0],
                adults: apt.guestCount || 2,
                guestName,
                guestPhone: guest.phone,
                guestEmail: guest.email,
                comment: `Групповое бронирование (${selectedApartments.length} номеров)`,
              })
            })
            
            const data = await response.json()
            
            results.push({
              aptId: apt.id,
              code: data.data?.bookingCode || null,
              success: data.success === true
            })
          } catch (error) {
            console.error(`Booking error for ${apt.id}:`, error)
            results.push({
              aptId: apt.id,
              code: null,
              success: false
            })
          }
        }
        
        setBookingResults(results)
        setBookingSuccess(results.every(r => r.success))
        setBookingStep('success')
        
      } catch (error) {
        console.error('Booking error:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }
  
  if (!isHydrated || (selectedApartments.length === 0 && bookingResults.length === 0)) {
    return (
      <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#2d80a1] animate-spin" />
      </div>
    )
  }
  
  // Show booking results (success state)
  if (bookingStep === 'success' && bookingResults.length > 0) {
    const allSuccess = bookingResults.every(r => r.success)
    
    return (
      <div className="min-h-screen bg-[#f8f6f3]">
        <Navigation />
        
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              {allSuccess ? (
                <>
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h1 className="text-2xl font-serif font-semibold text-[#174051] mb-3">
                    Бронирование подтверждено!
                  </h1>
                  <p className="text-[#4A7A8C] mb-6">
                    Все {bookingResults.length} номера успешно забронированы. 
                    Подтверждения отправлены на email каждого гостя.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10 text-yellow-500" />
                  </div>
                  <h1 className="text-2xl font-serif font-semibold text-[#174051] mb-3">
                    Бронирование частично завершено
                  </h1>
                  <p className="text-[#4A7A8C] mb-6">
                    Некоторые номера не удалось забронировать. Свяжитесь с нами для помощи.
                  </p>
                </>
              )}
              
              {/* Booking results */}
              <div className="bg-[#f8f6f3] rounded-xl p-4 mb-6 text-left">
                <h3 className="font-medium text-[#174051] mb-3">Результаты бронирования:</h3>
                <div className="space-y-2">
                  {bookingResults.map((result, idx) => {
                    const apt = selectedApartments.find(a => a.id === result.aptId)
                    return (
                      <div key={result.aptId} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                        <div className="flex items-center gap-3">
                          {result.success ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                          <span className="text-[#174051]">
                            {apt?.name || `Номер ${idx + 1}`}
                          </span>
                        </div>
                        {result.code && (
                          <span className="text-sm text-[#4A7A8C]">
                            Код: {result.code}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
              
              {/* Dates */}
              <div className="bg-[#f8f6f3] rounded-xl p-4 mb-6 text-left">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-[#2d80a1]" />
                  <span className="text-[#174051] font-medium">Даты проживания</span>
                </div>
                <p className="text-[#4A7A8C] ml-8">
                  {formatDateLong(checkIn)} — {formatDateLong(checkOut)}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/"
                  onClick={() => clearAll()}
                  className="inline-flex items-center justify-center gap-2 bg-[#2d80a1] hover:bg-[#236580] text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  <Home className="w-5 h-5" />
                  На главную
                </Link>
                <a
                  href="tel:+79789651180"
                  className="inline-flex items-center justify-center gap-2 border border-[#2d80a1] text-[#2d80a1] px-6 py-3 rounded-xl font-medium hover:bg-[#2d80a1]/5 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  +7 978 965-11-80
                </a>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#4A7A8C] hover:text-[#2d80a1] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад к выбору
          </button>
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-semibold text-[#174051] mb-2">
              Групповое бронирование
            </h1>
            <p className="text-[#4A7A8C]">
              Заполните данные гостей для каждого номера
            </p>
          </div>
          
          {/* Dates summary */}
          <div className="bg-white rounded-xl p-4 mb-6 flex items-center gap-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#2d80a1]" />
              <div>
                <p className="text-xs text-[#4A7A8C] uppercase">Даты проживания</p>
                <p className="font-medium text-[#174051]">
                  {formatDateLong(checkIn)} — {formatDateLong(checkOut)}
                </p>
              </div>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div>
              <p className="text-xs text-[#4A7A8C] uppercase">Количество ночей</p>
              <p className="font-medium text-[#174051]">
                {nights} {nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'}
              </p>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div>
              <p className="text-xs text-[#4A7A8C] uppercase">Номеров</p>
              <p className="font-medium text-[#174051]">{selectedApartments.length}</p>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Apartments and guest forms */}
            <div className="lg:col-span-2 space-y-6">
              {selectedApartments.map((apt, index) => (
                <div key={apt.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  {/* Apartment header */}
                  <div className="flex items-center gap-4 p-4 border-b border-gray-100 bg-gray-50">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={apt.image || '/placeholder.svg'} 
                        alt={apt.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-[#2d80a1]/10 text-[#2d80a1] px-2 py-0.5 rounded-full font-medium">
                          Номер {index + 1}
                        </span>
                      </div>
                      <h3 className="font-semibold text-[#174051]">{apt.name}</h3>
                      <p className="text-sm text-[#4A7A8C]">{apt.size} · {apt.rooms}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#174051]">{apt.totalPrice.toLocaleString('ru-RU')} ₽</p>
                      <p className="text-xs text-[#4A7A8C]">за {nights} {nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'}</p>
                    </div>
                    <button
                      onClick={() => removeApartment(apt.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Guest form */}
                  <div className="p-5">
                    <h4 className="flex items-center gap-2 text-sm font-medium text-[#174051] mb-4">
                      <User className="w-4 h-4 text-[#2d80a1]" />
                      Данные гостя
                    </h4>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#4A7A8C] uppercase tracking-wide mb-1">Имя *</label>
                        <input
                          type="text"
                          value={guestData[apt.id]?.name || ''}
                          onChange={(e) => updateGuestData(apt.id, 'name', e.target.value)}
                          placeholder="Иван"
                          className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d80a1]/20 focus:border-[#2d80a1] ${
                            errors[`${apt.id}-name`] ? 'border-red-300 bg-red-50' : 'border-gray-200'
                          }`}
                        />
                        {errors[`${apt.id}-name`] && (
                          <p className="text-xs text-red-500 mt-1">{errors[`${apt.id}-name`]}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-xs text-[#4A7A8C] uppercase tracking-wide mb-1">Фамилия *</label>
                        <input
                          type="text"
                          value={guestData[apt.id]?.lastName || ''}
                          onChange={(e) => updateGuestData(apt.id, 'lastName', e.target.value)}
                          placeholder="Иванов"
                          className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d80a1]/20 focus:border-[#2d80a1] ${
                            errors[`${apt.id}-lastName`] ? 'border-red-300 bg-red-50' : 'border-gray-200'
                          }`}
                        />
                        {errors[`${apt.id}-lastName`] && (
                          <p className="text-xs text-red-500 mt-1">{errors[`${apt.id}-lastName`]}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-xs text-[#4A7A8C] uppercase tracking-wide mb-1">Email *</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="email"
                            value={guestData[apt.id]?.email || ''}
                            onChange={(e) => updateGuestData(apt.id, 'email', e.target.value)}
                            placeholder="email@example.com"
                            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d80a1]/20 focus:border-[#2d80a1] ${
                              errors[`${apt.id}-email`] ? 'border-red-300 bg-red-50' : 'border-gray-200'
                            }`}
                          />
                        </div>
                        {errors[`${apt.id}-email`] && (
                          <p className="text-xs text-red-500 mt-1">{errors[`${apt.id}-email`]}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-xs text-[#4A7A8C] uppercase tracking-wide mb-1">Телефон *</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="tel"
                            value={guestData[apt.id]?.phone || ''}
                            onChange={(e) => updateGuestData(apt.id, 'phone', e.target.value)}
                            placeholder="+7 (___) ___-__-__"
                            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d80a1]/20 focus:border-[#2d80a1] ${
                              errors[`${apt.id}-phone`] ? 'border-red-300 bg-red-50' : 'border-gray-200'
                            }`}
                          />
                        </div>
                        {errors[`${apt.id}-phone`] && (
                          <p className="text-xs text-red-500 mt-1">{errors[`${apt.id}-phone`]}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-28">
                {/* Step indicator */}
                <div className="flex items-center gap-2 mb-4">
                  <div className={`flex items-center gap-1.5 ${bookingStep === 'guest' ? 'text-[#2d80a1]' : 'text-green-600'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${bookingStep === 'guest' ? 'bg-[#2d80a1] text-white' : 'bg-green-100 text-green-600'}`}>
                      {bookingStep !== 'guest' ? '✓' : '1'}
                    </div>
                    <span className="text-xs font-medium">Данные</span>
                  </div>
                  <div className="w-6 h-px bg-gray-200" />
                  <div className={`flex items-center gap-1.5 ${bookingStep === 'prepay' ? 'text-[#2d80a1]' : 'text-gray-400'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${bookingStep === 'prepay' ? 'bg-[#2d80a1] text-white' : 'bg-gray-200 text-gray-500'}`}>
                      2
                    </div>
                    <span className="text-xs font-medium">Оплата</span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-[#174051] mb-4">
                  {bookingStep === 'guest' && 'Итого к оплате'}
                  {bookingStep === 'prepay' && 'Оплата бронирования'}
                </h3>
                
                {/* Apartments summary */}
                <div className="space-y-3 mb-4">
                  {selectedApartments.map((apt, index) => (
                    <div key={apt.id} className="flex justify-between text-sm">
                      <span className="text-[#4A7A8C]">
                        Номер {index + 1}: {apt.name}
                      </span>
                      <span className="text-[#174051] font-medium">
                        {apt.totalPrice.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-100 pt-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[#174051]">Общая сумма</span>
                    <span className="text-xl font-bold text-[#174051]">
                      {totalPrice.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                  <p className="text-xs text-[#4A7A8C] mt-1">
                    за {nights} {nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'} · {selectedApartments.length} {selectedApartments.length === 1 ? 'номер' : selectedApartments.length < 5 ? 'номера' : 'номеров'}
                  </p>
                </div>
                
                {/* Prepayment info - shown on prepay step */}
                {bookingStep === 'prepay' && (
                  <div className="bg-[#f8f6f3] rounded-xl p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-[#4A7A8C]">Предоплата ({prepaymentPercent}%)</span>
                      <span className="text-lg font-bold text-[#2d80a1]">
                        {prepaymentAmount.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                    <p className="text-xs text-[#4A7A8C]">
                      Остаток {(totalPrice - prepaymentAmount).toLocaleString('ru-RU')} ₽ оплачивается при заселении
                    </p>
                  </div>
                )}
                
                {/* Payment step content */}
                {bookingStep === 'prepay' && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">Безопасная оплата</span>
                    </div>
                    <p className="text-xs text-blue-600">
                      После оплаты бронирование будет создано автоматически
                    </p>
                  </div>
                )}
                
                {/* Back button for prepay step */}
                {bookingStep === 'prepay' && (
                  <button
                    onClick={() => setBookingStep('guest')}
                    className="w-full text-[#4A7A8C] hover:text-[#2d80a1] text-sm mb-3 flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Назад
                  </button>
                )}
                
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-[#2d80a1] hover:bg-[#236580] text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {bookingStep === 'prepay' ? 'Оформляем бронирование...' : 'Загрузка...'}
                    </>
                  ) : (
                    <>
                      {bookingStep === 'guest' && 'Перейти к оплате'}
                      {bookingStep === 'prepay' && `Оплатить ${prepaymentAmount.toLocaleString('ru-RU')} ₽`}
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
                
                <p className="text-xs text-center text-[#4A7A8C] mt-3">
                  Бесплатная отмена за 30 дней до заезда
                </p>
                
                {/* Info */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700">
                    После оформления вы получите подтверждение на email каждого гостя
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
