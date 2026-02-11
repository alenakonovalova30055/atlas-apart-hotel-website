"use client"

import React from "react"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const images = [
  { src: "/gallery/pool-deck.jpg", alt: "Бассейн" },
  { src: "/gallery/terrace-view.jpg", alt: "Терраса" },
  { src: "/gallery/beach-equipment.jpg", alt: "Пляж" },
  { src: "/gallery/pool-girl.jpg", alt: "Отдых у бассейна" },
  { src: "/gallery/paddleboard-sea.jpg", alt: "Водные виды спорта" },
]

// Full gallery including main photo for mobile
const mobileImages = [
  { src: "/gallery/lounging-pool.jpg", alt: "Отдых у бассейна" },
  ...images,
]

interface GalleryCarouselProps {
  includeMainPhoto?: boolean
}

export function GalleryCarousel({ includeMainPhoto = false }: GalleryCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  
  const displayImages = includeMainPhoto ? mobileImages : images
  const minSwipeDistance = 50

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % displayImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [displayImages.length])

  const prev = () => setCurrent((current - 1 + displayImages.length) % displayImages.length)
  const next = () => setCurrent((current + 1) % displayImages.length)

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
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isLeftSwipe) {
      next()
    } else if (isRightSwipe) {
      prev()
    }
  }

  return (
    <div 
      className="relative w-full h-full rounded-lg overflow-hidden group touch-pan-y"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {displayImages.map((image, index) => (
        <img
          key={image.src}
          src={image.src || "/placeholder.svg"}
          alt={image.alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 select-none pointer-events-none ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
          draggable={false}
        />
      ))}
      
      {/* Navigation arrows - hidden on mobile */}
      <button
        onClick={prev}
        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-white"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-4 h-4 text-gray-700" />
      </button>
      <button
        onClick={next}
        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-white"
        aria-label="Next image"
      >
        <ChevronRight className="w-4 h-4 text-gray-700" />
      </button>
      
      {/* Image counter for mobile */}
      <div className="md:hidden absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
        {current + 1} / {displayImages.length}
      </div>
      
      {/* Dots indicator - desktop only */}
      <div className="hidden md:flex absolute bottom-3 left-1/2 -translate-x-1/2 gap-1.5">
        {displayImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === current ? "bg-white w-4" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
