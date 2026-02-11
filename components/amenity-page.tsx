'use client'

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react'
import { InquiryForm } from './inquiry-form'

interface AmenityPageProps {
  title: string
  subtitle: string
  description: string
  features: string[]
  images: { src: string; alt: string }[]
  heroImage: string
  schedule?: string
  additionalInfo?: string
}

export function AmenityPage({
  title,
  subtitle,
  description,
  features,
  images,
  heroImage,
  schedule,
  additionalInfo
}: AmenityPageProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const minSwipeDistance = 50

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    if (distance > minSwipeDistance) nextImage()
    if (distance < -minSwipeDistance) prevImage()
  }

  return (
    <main className="min-h-screen bg-[#f8f6f1]">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <Image
          src={heroImage || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        
        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/20 transition-colors text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            На главную
          </Link>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto">
            <p className="text-[#C4A76C] text-xs md:text-sm uppercase tracking-[0.25em] mb-3">{subtitle}</p>
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-white mb-4">{title}</h1>
            {schedule && (
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {schedule}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Description */}
            <div>
              <h2 className="font-serif text-2xl md:text-3xl text-[#174051] mb-6">О месте</h2>
              <p className="text-[#4A7A8C] leading-relaxed mb-8 text-base md:text-lg">
                {description}
              </p>

              {additionalInfo && (
                <p className="text-[#4A7A8C] leading-relaxed mb-8">
                  {additionalInfo}
                </p>
              )}

              {/* Features */}
              <h3 className="font-serif text-xl text-[#174051] mb-4">Особенности</h3>
              <ul className="space-y-3 mb-8">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#2d80a1]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-[#2d80a1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[#4A7A8C]">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => setFormOpen(true)}
                className="inline-flex items-center gap-2 bg-[#2d80a1] hover:bg-[#236a87] text-white font-medium px-8 py-4 rounded-lg transition-colors"
              >
                Узнать подробнее
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>

            {/* Gallery Preview - 5 photos layout */}
            <div>
              <h2 className="font-serif text-2xl md:text-3xl text-[#174051] mb-6">Фотогалерея</h2>
              <div className="grid grid-cols-6 gap-3 md:gap-4">
                {/* First large photo - spans 4 columns */}
                {images[0] && (
                  <div
                    className="col-span-6 md:col-span-4 aspect-[4/3] relative overflow-hidden rounded-xl cursor-pointer group"
                    onClick={() => openLightbox(0)}
                  >
                    <Image
                      src={images[0].src || "/placeholder.svg"}
                      alt={images[0].alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
                        <Maximize2 className="w-5 h-5 text-[#174051]" />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Two stacked photos on the right - span 2 columns each */}
                <div className="col-span-3 md:col-span-2 flex flex-col gap-3 md:gap-4">
                  {images[1] && (
                    <div
                      className="aspect-[4/3] relative overflow-hidden rounded-xl cursor-pointer group"
                      onClick={() => openLightbox(1)}
                    >
                      <Image
                        src={images[1].src || "/placeholder.svg"}
                        alt={images[1].alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
                          <Maximize2 className="w-5 h-5 text-[#174051]" />
                        </div>
                      </div>
                    </div>
                  )}
                  {images[2] && (
                    <div
                      className="aspect-[4/3] relative overflow-hidden rounded-xl cursor-pointer group"
                      onClick={() => openLightbox(2)}
                    >
                      <Image
                        src={images[2].src || "/placeholder.svg"}
                        alt={images[2].alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
                          <Maximize2 className="w-5 h-5 text-[#174051]" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Second row - two photos on the right side */}
                <div className="col-span-3 md:col-span-2 flex flex-col gap-3 md:gap-4">
                  {images[3] && (
                    <div
                      className="aspect-[4/3] relative overflow-hidden rounded-xl cursor-pointer group"
                      onClick={() => openLightbox(3)}
                    >
                      <Image
                        src={images[3].src || "/placeholder.svg"}
                        alt={images[3].alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
                          <Maximize2 className="w-5 h-5 text-[#174051]" />
                        </div>
                      </div>
                    </div>
                  )}
                  {images[4] && (
                    <div
                      className="aspect-[4/3] relative overflow-hidden rounded-xl cursor-pointer group"
                      onClick={() => openLightbox(4)}
                    >
                      <Image
                        src={images[4].src || "/placeholder.svg"}
                        alt={images[4].alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
                          <Maximize2 className="w-5 h-5 text-[#174051]" />
                        </div>
                      </div>
                      {images.length > 5 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white text-xl font-medium">+{images.length - 5}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* View All Button */}
              {images.length > 5 && (
                <button
                  onClick={() => openLightbox(0)}
                  className="w-full mt-4 py-3 border border-[#2d80a1] text-[#2d80a1] rounded-lg hover:bg-[#2d80a1] hover:text-white transition-colors font-medium"
                >
                  Смотреть все фото ({images.length})
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-[#174051]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-white mb-4">Есть вопросы?</h2>
          <p className="text-white/70 mb-6 max-w-md mx-auto">
            Свяжитесь с нами для получения дополнительной информации
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:+79789651180"
              className="inline-flex items-center justify-center gap-2 bg-[#D4B896] hover:bg-[#c4a886] text-[#174051] font-medium px-6 py-3 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +7 978 965-11-80
            </a>
            <button
              onClick={() => setFormOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Оставить заявку
            </button>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="absolute top-4 left-4 text-white/70 text-sm">
            {lightboxIndex + 1} / {images.length}
          </div>

          <div
            className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center touch-pan-y"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <Image
              src={images[lightboxIndex].src || "/placeholder.svg"}
              alt={images[lightboxIndex].alt}
              width={1200}
              height={800}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Thumbnails */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto px-4 py-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(idx); }}
                className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden transition-all ${
                  lightboxIndex === idx ? 'ring-2 ring-white opacity-100' : 'opacity-50 hover:opacity-80'
                }`}
              >
                <Image src={img.src || "/placeholder.svg"} alt={`Миниатюра ${idx + 1}`} width={64} height={48} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Inquiry Form */}
      <InquiryForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        subject={title}
      />
    </main>
  )
}
