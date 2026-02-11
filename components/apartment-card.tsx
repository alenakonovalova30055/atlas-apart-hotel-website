'use client';

import React from "react"

import { Maximize2, Users, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ApartmentCardProps {
  id: string
  name: string
  description: string
  image: string | string[]
  price: number
  size: string
  guests: string
  rooms: string
  amenities: string[]
  fullAmenities: string[] | Array<{ title: string; description?: string; included?: boolean }>
  bookingUrl?: string
}

export const ApartmentCard = ({
  id,
  name,
  description,
  image,
  price,
  size,
  guests,
  rooms,
  amenities,
  fullAmenities,
  bookingUrl = 'https://homereserve.ru/j9G8jmSaeI/basket/295313',
}: ApartmentCardProps) => {
  const router = useRouter()
  const images = Array.isArray(image) ? image : [image]
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [expandedAmenities, setExpandedAmenities] = useState(false)
  const hasMultipleImages = images.length > 1
  
  // Swipe state
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const minSwipeDistance = 50

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isLeftSwipe || isRightSwipe) {
      e.preventDefault()
      e.stopPropagation()
      if (isLeftSwipe) {
        nextImage()
      } else {
        prevImage()
      }
    }
  }
  return (
    <Link href={`/apartments/${id}`} className="block h-full">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full cursor-pointer hover:shadow-lg transition-shadow duration-300">
        {/* Image Container with Swipe */}
        <div 
          className="relative aspect-square overflow-hidden group touch-pan-y"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
        <img
          src={images[currentImageIndex] || '/placeholder.svg'}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 select-none pointer-events-none"
          draggable={false}
        />
        
        {/* Navigation Arrows - Show on hover */}
        {hasMultipleImages && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                prevImage()
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                nextImage()
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
              {currentImageIndex + 1}/{images.length}
            </div>
          </>
        )}
        

      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-serif text-xl text-[#2C4A5E] mb-1">{name}</h3>
        <p className="text-[#4A7A8C] text-xs font-medium mb-2">{rooms}</p>
        <p className="text-gray-500 text-sm mb-2 leading-relaxed line-clamp-2">
          {description.split('\n\n')[0]}
        </p>
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            router.push(`/apartments/${id}`)
          }}
          className="flex items-center gap-1 text-[#2d80a1] hover:text-[#226079] font-medium text-sm mb-4 transition-colors w-fit"
        >
          Далее
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Info Row */}
        <div className="flex items-center gap-5 mb-4 text-sm text-[#4A7A8C]">
          <div className="flex items-center gap-1.5">
            <Maximize2 className="w-4 h-4" />
            <span>{size}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{guests}</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {amenities.map((amenity) => (
              <span
                key={amenity}
                className="text-xs bg-gray-50 text-[#4A7A8C] px-2.5 py-1 rounded border border-gray-200"
              >
                {amenity}
              </span>
            ))}
          </div>

          {/* Expandable Amenities */}
          {expandedAmenities && (
            <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
              <div className="grid grid-cols-2 gap-2">
                {fullAmenities.map((amenity, index) => {
                  const label = typeof amenity === 'string' ? amenity : amenity.title
                  return (
                    <div key={label || index} className="text-xs text-[#4A7A8C] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#2d80a1] rounded-full"></span>
                      {label}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Expand Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setExpandedAmenities(!expandedAmenities)
            }}
            className="flex items-center gap-2 text-[#2d80a1] hover:text-[#226079] font-medium text-sm mb-4 transition-colors"
          >
            {expandedAmenities ? (
              <>
                <X className="w-5 h-5" />
                Скрыть все
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Показать все удобства
              </>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex gap-3">
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              router.push(`/apartments/${id}`)
            }}
            className="flex-1 bg-[#2d80a1] hover:bg-[#D4B896] active:bg-[#c4a886] text-white hover:text-[#174051] active:text-[#174051] font-medium py-3 rounded text-center transition-colors uppercase tracking-wide text-sm"
          >
            Забронировать
          </button>
        </div>
      </div>
      </div>
    </Link>
  )
}
