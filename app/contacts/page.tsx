'use client'

import React from "react"

import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'

export default function ContactsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form submission logic would go here
    console.log('Form submitted:', formData)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Свяжитесь с нами</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Контакты
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Мы всегда рады ответить на ваши вопросы и помочь организовать <br />
            незабываемый отдых в Крыму
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <ContactCard
              icon={<MapPin className="w-6 h-6" />}
              title="Адрес"
              content={
                <>
                  <p>298000, Республика Крым</p>
                  <p>г. Судак, ул. Набережная, 75</p>
                  <p className="font-semibold mt-2">Atlas Apart Hotel & Spa</p>
                </>
              }
            />
            <ContactCard
              icon={<Phone className="w-6 h-6" />}
              title="Телефон"
              content={
                <>
                  <a href="tel:+79789651180" className="block hover:text-primary transition-colors">
                    +7 978 965 11 80
                  </a>
                  <p className="text-sm text-muted-foreground mt-2">Все мессенджеры</p>
                </>
              }
            />
            <ContactCard
              icon={<Mail className="w-6 h-6" />}
              title="Email"
              content={
                <>
                  <a href="mailto:info@atlas-krym.ru" className="block hover:text-primary transition-colors">
                    info@atlas-krym.ru
                  </a>
                  <p className="text-sm text-muted-foreground mt-2">Ответим в течение часа</p>
                </>
              }
            />
            <ContactCard
              icon={<Clock className="w-6 h-6" />}
              title="Режим работы"
              content={
                <>
                  <p>Заезд с 14:00</p>
                  <p>Выезд до 12:00</p>
                </>
              }
            />
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-muted p-8 md:p-12 rounded-lg">
              <h2 className="font-serif text-3xl font-bold mb-6 text-center">Напишите нам</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Ваше имя *
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Иван Иванов"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Телефон
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+7 (___) ___-__-__"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Сообщение *
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Ваш вопрос или пожелания..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    className="bg-white resize-none"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-medium tracking-wide"
                >
                  ОТПРАВИТЬ СООБЩЕНИЕ
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="h-96 bg-muted/50">
        <iframe
          src="https://yandex.ru/map-widget/v1/?ll=34.985715,44.838326&z=15&pt=34.985715,44.838326,pm2rdm&um=constructor:e1b4d4a8765d84aa15c83b90ba51b2a2ef4a3f1e28e63eb36f8c1e35a3b4d4a8&source=constructor"
          width="100%"
          height="100%"
          frameBorder="0"
          title="Atlas Apart Hotel Location"
          className="border-0"
        />
      </section>

      <Footer />
    </div>
  )
}

function ContactCard({ icon, title, content }: { icon: React.ReactNode; title: string; content: React.ReactNode }) {
  return (
    <div className="bg-muted/50 p-6 text-center">
      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-3">{title}</h3>
      <div className="text-sm text-muted-foreground">{content}</div>
    </div>
  )
}
