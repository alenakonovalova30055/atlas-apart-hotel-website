"use client"

import { X } from 'lucide-react'
import { useEffect } from 'react'

interface FeatureModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  image: string
  details: string[]
}

export function FeatureModal({ isOpen, onClose, title, description, image, details }: FeatureModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
        >
          <X className="w-5 h-5 text-[#2C4A5E]" />
        </button>

        {/* Image */}
        <div className="relative h-64 md:h-80">
          <img 
            src={image || "/placeholder.svg"} 
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <h2 className="absolute bottom-6 left-6 right-6 font-serif text-2xl md:text-3xl text-white" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}>
            {title}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <p className="text-lg text-[#4A7A8C] leading-relaxed mb-6">
            {description}
          </p>
          
          <div className="space-y-4">
            {details.map((detail, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#D4B896] rounded-full mt-2 shrink-0" />
                <p className="text-[#2C4A5E]/80">{detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-[#E8E4DF]">
            <a
              href="/contacts"
              className="inline-block bg-[#3D6B7D] text-white px-8 py-3 text-sm tracking-wide hover:bg-[#2C4A5E] transition-colors"
            >
              ЗАБРОНИРОВАТЬ
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
