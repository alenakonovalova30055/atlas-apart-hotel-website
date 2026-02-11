"use client"

import { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

interface AttractionCardProps {
  href: string
  image: string
  title: string
  description?: string
}

export function AttractionCard({ href, image, title, description }: AttractionCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="group relative block aspect-[4/3] overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-full text-left"
      >
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105 brightness-[0.7] group-hover:brightness-[0.8]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10 group-hover:from-black/60 transition-all" />
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end h-full">
          <div className="flex items-center justify-between w-full">
            <h3 className="font-serif text-sm md:text-base font-medium text-white">
              {title}
            </h3>
            <svg className="w-4 h-4 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <div 
            className="relative bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-md"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
            
            <div className="aspect-video relative">
              <Image
                src={image || "/placeholder.svg"}
                alt={title}
                fill
                className="object-cover rounded-t-xl"
              />
            </div>
            
            <div className="p-6">
              <h3 className="font-serif text-2xl font-bold text-[#174051] mb-4">{title}</h3>
              {description && (
                <p className="text-sm text-[#4A7A8C] leading-relaxed mb-4">{description}</p>
              )}
              <a 
                href={href}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#2d80a1] hover:text-[#1f5a78] transition-colors"
              >
                Подробнее
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
