'use client'

import React from "react"

import { useState } from 'react'
import { X, Send, Phone, Mail, User, MessageSquare } from 'lucide-react'

interface InquiryFormProps {
  isOpen: boolean
  onClose: () => void
  subject?: string
}

export function InquiryForm({ isOpen, onClose, subject = 'Общий вопрос' }: InquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // Reset after showing success
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: '', phone: '', email: '', message: '' })
      onClose()
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#174051] to-[#2d80a1] px-6 py-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="font-serif text-xl text-white">Узнать подробнее</h3>
          <p className="text-white/70 text-sm mt-1">{subject}</p>
        </div>

        {isSubmitted ? (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="font-serif text-xl text-[#174051] mb-2">Заявка отправлена!</h4>
            <p className="text-[#4A7A8C] text-sm">Мы свяжемся с вами в ближайшее время</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs text-[#4A7A8C] uppercase tracking-wider mb-2">Ваше имя</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A7A8C]" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d80a1]/20 focus:border-[#2d80a1] transition-all text-sm"
                  placeholder="Иван Иванов"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs text-[#4A7A8C] uppercase tracking-wider mb-2">Телефон</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A7A8C]" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d80a1]/20 focus:border-[#2d80a1] transition-all text-sm"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs text-[#4A7A8C] uppercase tracking-wider mb-2">Сообщение</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-[#4A7A8C]" />
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d80a1]/20 focus:border-[#2d80a1] transition-all text-sm resize-none"
                  placeholder="Ваш вопрос или пожелание..."
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
                  Отправить заявку
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
