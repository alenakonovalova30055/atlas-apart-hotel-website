'use client';

import React from "react"
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { scrollToTop } from '@/lib/scroll-to-top'

export function Footer() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    scrollToTop()
  }
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div>
            <Image src="/logo.png" alt="Atlas Apart" width={120} height={70} className="h-16 w-auto mb-4 brightness-0 invert" />
            <p className="text-sm opacity-90 leading-relaxed">
              Премиальный апарт-отель на берегу Чёрного моря в самом сердце солнечного Крыма
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Навигация</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" onClick={handleNavClick} className="opacity-90 hover:opacity-100 transition-opacity">Главная</Link></li>
              <li><Link href="/apartments" onClick={handleNavClick} className="opacity-90 hover:opacity-100 transition-opacity">Апартаменты</Link></li>
              <li><Link href="/about" onClick={handleNavClick} className="opacity-90 hover:opacity-100 transition-opacity">О нас</Link></li>
              <li><Link href="/sudak" onClick={handleNavClick} className="opacity-90 hover:opacity-100 transition-opacity">Судак</Link></li>
              <li><Link href="/contacts" onClick={handleNavClick} className="opacity-90 hover:opacity-100 transition-opacity">Контакты</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Услуги</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/amenities/spa" onClick={handleNavClick} className="opacity-90 hover:opacity-100 transition-opacity">SPA & Wellness</Link></li>
              <li><Link href="/amenities/pool" onClick={handleNavClick} className="opacity-90 hover:opacity-100 transition-opacity">Бассейн</Link></li>
              <li><Link href="/sudak" onClick={handleNavClick} className="opacity-90 hover:opacity-100 transition-opacity">Экскурсии</Link></li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Контакты</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="opacity-90">
                  <p>г. Судак, ул. Набережная, 15</p>
                  <p>Atlas Apart Hotel & Spa</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:+79789651180" className="opacity-90 hover:opacity-100 transition-opacity">
                  +7 978 965-11-80
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:booking@atlas-krym.ru" className="opacity-90 hover:opacity-100 transition-opacity">
                  booking@atlas-krym.ru
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p className="opacity-90">Заезд с 14:00, выезд до 12:00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-primary-foreground/20">
          <a 
            href="tel:+79789651180"
            onClick={(e) => {
              window.location.href = 'tel:+79789651180'
            }}
            className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Позвонить"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </a>
          <a 
            href="https://t.me/sydakhotel" 
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full bg-[#0088cc] flex items-center justify-center hover:bg-[#0077b5] transition-colors"
            aria-label="Telegram"
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
          </a>
        </div>

        <div className="mt-6 text-sm text-center opacity-80">
          <p>© {new Date().getFullYear()} Atlas Apart Hotel & Spa. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
