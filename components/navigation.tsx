'use client'

import React from "react"
import { createPortal } from 'react-dom'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { scrollToTop } from '@/lib/scroll-to-top'

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', comment: '' })
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [formError, setFormError] = useState('')
  
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.phone.trim()) {
      setFormError('Пожалуйста, заполните имя и телефон')
      return
    }
    
    setFormSubmitting(true)
    setFormError('')
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setFormSuccess(true)
        setFormData({ name: '', phone: '', email: '', comment: '' })
      } else {
        setFormError(data.error || 'Ошибка отправки')
      }
    } catch {
      setFormError('Ошибка соединения. Попробуйте позже.')
    } finally {
      setFormSubmitting(false)
    }
  }
  
  const closeForm = () => {
    setShowBookingForm(false)
    setFormSuccess(false)
    setFormError('')
  }
  
  const navItems = [
    { href: '/', label: 'ГЛАВНАЯ' },
    { href: '/apartments', label: 'АПАРТАМЕНТЫ' },
    { href: '/about', label: 'О НАС' },
    { href: '/sudak', label: 'СУДАК' },
    { href: '/contacts', label: 'КОНТАКТЫ' },
  ]

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <>
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center flex-shrink-0" onClick={scrollToTop}>
            <img src="/logo.png" alt="Атлас Апарт" className="h-10 md:h-12 w-auto object-contain" />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={scrollToTop}
                className={`text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                  pathname === item.href ? 'text-primary' : 'text-foreground/80'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Contact Icons - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              <a 
                href="tel:+79789651180"
                onClick={(e) => {
                  window.location.href = 'tel:+79789651180'
                }}
                className="w-9 h-9 rounded-full bg-[#174051]/10 flex items-center justify-center hover:bg-[#174051]/20 transition-colors cursor-pointer"
                aria-label="Позвонить"
              >
                <svg className="w-4 h-4 text-[#174051]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
              <a 
                href="https://t.me/sydakhotel" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#0088cc]/10 flex items-center justify-center hover:bg-[#0088cc]/20 transition-colors"
                aria-label="Telegram"
              >
                <svg className="w-4 h-4 text-[#0088cc]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            </div>

            {/* Book Button - opens booking form */}
            <button 
              onClick={() => { setShowBookingForm(true); setFormSuccess(false); setFormError('') }}
              className="bg-primary text-primary-foreground px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-medium tracking-wide hover:bg-primary/90 transition-colors"
            >
              ЗАБРОНИРОВАТЬ
            </button>

            {/* Mobile Burger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
              aria-label="Меню"
            >
              <span className={`block w-6 h-0.5 bg-[#174051] transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-[#174051] transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-[#174051] transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div 
        className={`fixed top-16 right-0 h-[calc(100vh-4rem)] w-72 bg-white z-50 md:hidden shadow-xl transition-transform duration-300 ease-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col py-6 px-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                scrollToTop()
                setMobileMenuOpen(false)
              }}
              className={`py-4 text-base font-medium tracking-wide border-b border-gray-100 transition-colors ${
                pathname === item.href ? 'text-[#2d80a1]' : 'text-[#174051]'
              }`}
            >
              {item.label}
            </Link>
          ))}
          
          {/* Mobile Book Button */}
          <button 
            onClick={() => {
              setMobileMenuOpen(false)
              setShowBookingForm(true)
              setFormSuccess(false)
              setFormError('')
            }}
            className="mt-6 bg-[#2d80a1] text-white px-6 py-4 text-center text-sm font-medium tracking-wide hover:bg-[#236a87] transition-colors rounded-lg"
          >
            ЗАБРОНИРОВАТЬ
          </button>

          {/* Contact Info */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Связаться с нами</p>
            <div className="flex items-center gap-3">
              <a 
                href="tel:+79789651180"
                onClick={(e) => {
                  window.location.href = 'tel:+79789651180'
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#174051]/10 rounded-lg hover:bg-[#174051]/20 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5 text-[#174051]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-[#174051] font-medium text-sm">Позвонить</span>
              </a>
              <a 
                href="https://t.me/sydakhotel" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#0088cc]/10 rounded-lg hover:bg-[#0088cc]/20 transition-colors"
              >
                <svg className="w-5 h-5 text-[#0088cc]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                <span className="text-[#0088cc] font-medium text-sm">Telegram</span>
              </a>
            </div>
          </div>
        </div>
      </div>

    </nav>
    {showBookingForm && createPortal(
      <div 
        className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 overflow-y-auto"
        style={{ zIndex: 9999 }}
        onClick={(e) => { if (e.target === e.currentTarget) closeForm() }}
      >
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md relative my-8">
          <button
            onClick={closeForm}
            className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            aria-label="Закрыть"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {formSuccess ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-semibold text-[#174051] mb-2">Заявка отправлена!</h3>
              <p className="text-sm text-[#4A7A8C] mb-6">Мы свяжемся с вами в ближайшее время для подбора дат бронирования.</p>
              <button
                onClick={closeForm}
                className="bg-[#2d80a1] hover:bg-[#236580] text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Закрыть
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="p-6">
              <h3 className="text-xl font-serif font-semibold text-[#174051] mb-1 pr-8">Заявка на бронирование</h3>
              <p className="text-sm text-[#4A7A8C] mb-5">Оставьте ваши данные и мы свяжемся с вами</p>
              
              {formError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {formError}
                </div>
              )}
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-[#174051] mb-1">
                    Имя <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ваше имя"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-[#174051] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2d80a1]/30 focus:border-[#2d80a1] transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#174051] mb-1">
                    Телефон <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+7 (___) ___-__-__"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-[#174051] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2d80a1]/30 focus:border-[#2d80a1] transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#174051] mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@example.com"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-[#174051] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2d80a1]/30 focus:border-[#2d80a1] transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#174051] mb-1">Комментарий</label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Даты, пожелания, количество гостей..."
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-[#174051] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2d80a1]/30 focus:border-[#2d80a1] transition-colors resize-none"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={formSubmitting}
                className="w-full mt-5 bg-[#2d80a1] hover:bg-[#236580] text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {formSubmitting ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Отправка...
                  </>
                ) : (
                  'Отправить заявку'
                )}
              </button>
              
              <p className="text-xs text-center text-[#4A7A8C] mt-3">
                Мы свяжемся с вами в ближайшее время
              </p>
            </form>
          )}
        </div>
      </div>,
      document.body
    )}
    </>
  )
}
