"use client"

import React from "react"

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { Apartment } from '@/lib/apartments-data'

interface ApartmentCardProps {
  apt: Apartment
  images: string[]
  totalPrice: number
  pricePerNight: number
  nights: number
  bookingUrl?: string
  hideButton?: boolean
  onShowDetails?: () => void
  isMultiMode?: boolean
}

export default function ApartmentCard({ apt, images, totalPrice, pricePerNight, nights, bookingUrl, hideButton, onShowDetails, isMultiMode }: ApartmentCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }
  
  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }
  
  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 border border-gray-100 rounded-2xl hover:border-[#2d80a1]/30 hover:shadow-xl transition-all bg-white">
      {/* Image carousel with navigation */}
      <div className="relative w-full md:w-96 h-64 md:h-72 rounded-xl overflow-hidden flex-shrink-0 group">
        <img 
          src={images[currentImageIndex] || "/placeholder.svg"} 
          alt={`${apt.name} - фото ${currentImageIndex + 1}`} 
          className="w-full h-full object-cover transition-transform duration-300" 
        />
        
        {/* Navigation arrows - показываем только если несколько фото */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5 text-[#174051]" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5 text-[#174051]" />
            </button>
            
            {/* Dots indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.slice(0, 5).map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setCurrentImageIndex(idx)
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentImageIndex 
                      ? 'bg-white w-4' 
                      : 'bg-white/60 hover:bg-white/80'
                  }`}
                />
              ))}
              {images.length > 5 && (
                <span className="text-white text-xs ml-1">+{images.length - 5}</span>
              )}
            </div>
          </>
        )}
        
        {/* Image counter */}
        <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          {currentImageIndex + 1}/{images.length}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <h4 className="text-2xl font-semibold text-[#174051] mb-3">{apt.name}</h4>
          <p className="text-sm text-gray-500 line-clamp-3 mb-4">{apt.description.split('\n')[0]}</p>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span className="font-medium">{apt.size}</span>
            <span>·</span>
            <span>{apt.guests}</span>
            <span>·</span>
            <span>{apt.rooms}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {apt.amenities.slice(0, 4).map(amenity => (
              <span key={amenity} className="text-xs bg-[#f8f6f3] text-gray-600 px-3 py-1.5 rounded-full">
                {amenity}
              </span>
            ))}
            {isMultiMode && onShowDetails && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onShowDetails()
                }}
                className="text-xs bg-[#C4A76C] text-white px-4 py-1.5 rounded-full hover:bg-[#B39555] transition-colors font-medium flex items-center gap-1 shadow-sm"
              >
                Подробнее
              </button>
            )}
          </div>
        </div>
        
        <div className="flex items-end justify-between mt-5 pt-5 border-t border-gray-100">
          <div>
            {nights > 0 ? (
              <>
                <div className="text-3xl font-bold text-[#174051]">
                  {totalPrice.toLocaleString('ru-RU')} ₽
                </div>
                <div className="text-sm text-gray-500">
                  {pricePerNight.toLocaleString('ru-RU')} ₽/ночь · {nights} {nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'}
                </div>
              </>
            ) : (
              <>
                <div className="text-3xl font-bold text-[#174051]">
                  от {apt.price.toLocaleString('ru-RU')} ₽
                </div>
                <div className="text-sm text-gray-500">за ночь</div>
              </>
            )}
          </div>
          {!hideButton && bookingUrl && (
            <Link
              href={bookingUrl}
              className="bg-[#2d80a1] hover:bg-[#226079] text-white font-medium px-10 py-3.5 rounded-xl transition-colors text-base whitespace-nowrap"
            >
              Подробнее
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
