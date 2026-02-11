'use client'

import React, { useState } from 'react'
import useSWR from 'swr'
import { X, Send, Phone, Mail, User, Calendar, Users, Home, MessageSquare, CreditCard } from 'lucide-react'
import { apartments as fallbackApts } from '@/lib/apartments-data'

const fetcher = (url: string) => fetch(url).then(r => r.json())

interface BookingFormProps {
  isOpen: boolean
  onClose: () => void
  preselectedApartment?: string
  preselectedCheckIn?: string
  preselectedCheckOut?: string
}

export function BookingForm({ 
  isOpen, 
  onClose, 
  preselectedApartment,
  preselectedCheckIn,
  preselectedCheckOut 
}: BookingFormProps) {
  const [formData, setFormData] = useState({
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    checkIn: preselectedCheckIn || '',
    checkOut: preselectedCheckOut || '',
    adults: '2',
    children: '0',
    apartmentId: preselectedApartment || '',
    comment: '',
    prepayment: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const { data: rawApts } = useSWR('/api/apartments', fetcher, {
    fallbackData: fallbackApts,
    revalidateOnFocus: false,
  })
  const apartments = Array.isArray(rawApts) && rawApts.length > 0 ? rawApts : fallbackApts
  // Только доступные апартаменты
  const availableApartments = apartments.filter((apt: any) => apt.isAvailable !== false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')
    
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const result = await response.json()
      
      if (result.success) {
        setSubmitStatus('success')
        setTimeout(() => {
          setSubmitStatus('idle')
          setFormData({
            guestName: '',
            guestPhone: '',
            guestEmail: '',
            checkIn: '',
            checkOut: '',
            adults: '2',
            children: '0',
            apartmentId: '',
            comment: '',
            prepayment: '',
          })
          onClose()
        }, 3000)
      } else {
        setSubmitStatus('error')
        setErrorMessage(result.error || 'Произошла ошибка при бронировании')
      }
    } catch {
      setSubmitStatus('error')
      setErrorMessage('Ошибка соединения. Попробуйте позже.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Получаем минимальную дату (сегодня)
  const today = new Date().toISOString().split('T')[0]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#174051] to-[#2d80a1] px-6 py-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="font-serif text-xl text-white">Забронировать апартаменты</h3>
          <p className="text-white/70 text-sm mt-1">Заполните форму и мы свяжемся с вами</p>
        </div>

        {submitStatus === 'success' ? (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="font-serif text-xl text-[#174051] mb-2">Заявка отправлена!</h4>
            <p className="text-[#4A7A8C] text-sm">Мы свяжемся с вами для подтверждения бронирования</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}

            {/* Выбор апартамента */}
            <div>
              <label className="block text-xs text-[#4A7A8C] uppercase tracking-wider mb-2">Апартаменты *</label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A7A8C]" />
                <select
                  required
                  value={formData.apartmentId}
                  onChange={(e) => setFormData({ ...formData, apartmentId: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d80a1]/20 focus:border-[#2d80a1] transition-all text-sm appearance-none bg-white"
                >
                  <option value="">Выберите апартаменты</option>
                  {availableApartments.map(apt => (
                    <option key={apt.id} value={apt.id}>
                      {apt.name} - {apt.size}, {apt.guests} ({apt.price.toLocaleString('ru-RU')} руб/сутки)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Даты */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#4A7A8C] uppercase tracking-wider mb-2">Дата заезда *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A7A8C]" />
                  <input
                    type="date"
                    required
                    min={today}
                    value={formData.checkIn}
                    onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d80a1]/20 focus:border-[#2d80a1] transition-all text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#4A7A8C] uppercase tracking-wider mb-2">Дата выезда *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A7A8C]" />
                  <input
                    type="date"
                    required
                    min={formData.checkIn || today}
                    value={formData.checkOut}
                    onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d80a1]/20 focus:border-[#2d80a1] transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Гости */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#4A7A8C] uppercase tracking-wider mb-2">Взрослые *</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A7A8C]" />
                  <select
                    required
                    value={formData.adults}
                    onChange={(e) => setFormData({ ...formData, adults: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d80a1]/20 focus:border-[#2d80a1] transition-all text-sm appearance-none bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#4A7A8C] uppercase tracking-wider mb-2">Дети</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A7A8C]" />
                  <select
                    value={formData.children}
                    onChange={(e) => setFormData({ ...formData, children: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d80a1]/20 focus:border-[#2d80a1] transition-all text-sm appearance-none bg-white"
                  >
                    {[0, 1, 2, 3, 4].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Имя */}
            <div>
              <label className="block text-xs text-[#4A7A8C] uppercase tracking-wider mb-2">Ваше имя *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A7A8C]" />
                <input
                  type="text"
                  required
                  value={formData.guestName}
                  onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d80a1]/20 focus:border-[#2d80a1] transition-all text-sm"
                  placeholder="Иван Иванов"
                />
              </div>
            </div>

            {/* Телефон */}
            <div>
              <label className="block text-xs text-[#4A7A8C] uppercase tracking-wider mb-2">Телефон *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A7A8C]" />
                <input
                  type="tel"
                  required
                  value={formData.guestPhone}
                  onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d80a1]/20 focus:border-[#2d80a1] transition-all text-sm"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs text-[#4A7A8C] uppercase tracking-wider mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A7A8C]" />
                <input
                  type="email"
                  value={formData.guestEmail}
                  onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d80a1]/20 focus:border-[#2d80a1] transition-all text-sm"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            {/* Предоплата */}
            <div>
              <label className="block text-xs text-[#4A7A8C] uppercase tracking-wider mb-2">Сумма предоплаты (руб)</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A7A8C]" />
                <input
                  type="number"
                  min="0"
                  value={formData.prepayment}
                  onChange={(e) => setFormData({ ...formData, prepayment: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d80a1]/20 focus:border-[#2d80a1] transition-all text-sm"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Комментарий */}
            <div>
              <label className="block text-xs text-[#4A7A8C] uppercase tracking-wider mb-2">Комментарий</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-[#4A7A8C]" />
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d80a1]/20 focus:border-[#2d80a1] transition-all text-sm resize-none"
                  placeholder="Пожелания к бронированию..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#2d80a1] to-[#3d9fc4] hover:from-[#236a87] hover:to-[#2d80a1] text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Забронировать
                </>
              )}
            </button>

            <p className="text-xs text-center text-[#4A7A8C]">
              Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
