"use client"

import { useState, useEffect } from 'react'

const slides = [
  '/hero-slides/scenic1.jpg',
  '/hero-slides/scenic2.jpg',
  '/hero-slides/resort.jpg',
  '/hero-slides/beach.jpg',
]

export function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  
  useEffect(() => {
    // Preload images
    const imagePromises = slides.map((src) => {
      return new Promise((resolve) => {
        const img = new window.Image()
        img.crossOrigin = "anonymous"
        img.onload = resolve
        img.onerror = resolve
        img.src = src
      })
    })
    
    Promise.all(imagePromises).then(() => {
      setImagesLoaded(true)
    })
  }, [])
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 7000) // Change slide every 7 seconds
    
    return () => clearInterval(timer)
  }, [])
  
  return (
    <>
      {/* Use img tags for better mobile compatibility */}
      {slides.map((slide, index) => (
        <div
          key={slide}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide || "/placeholder.svg"}
            alt=""
            className="w-full h-full object-cover"
            loading={index === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
    </>
  )
}
