"use client"

import { useState } from 'react'
import { FeatureModal } from './feature-modal'

interface FeatureImageCardProps {
  title: string
  shortDescription: string
  image: string
  fullDescription: string
  details: string[]
}

export function FeatureImageCard({ title, shortDescription, image, fullDescription, details }: FeatureImageCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="group relative overflow-hidden aspect-[4/3] w-full text-left"
      >
        {/* Image */}
        <img 
          src={image || "/placeholder.svg"} 
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-all duration-300 group-hover:from-black/80" />
        
        {/* Content */}
        <div className="absolute inset-0 p-5 flex flex-col justify-end">
          <h3 className="font-serif text-xl text-white mb-2" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
            {title}
          </h3>
          <p className="text-white/80 text-sm leading-relaxed line-clamp-2" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.4)' }}>
            {shortDescription}
          </p>
          
          {/* Hover indicator */}
          <div className="mt-3 flex items-center gap-2 text-[#D4B896] text-xs tracking-wide opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            <span>ПОДРОБНЕЕ</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </button>

      <FeatureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        description={fullDescription}
        image={image}
        details={details}
      />
    </>
  )
}
