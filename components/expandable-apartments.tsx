'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { ApartmentCard } from './apartment-card'
import { apartments as fallbackApartments } from '@/lib/apartments-data'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function ExpandableApartments() {
  const { data } = useSWR('/api/apartments', fetcher, {
    fallbackData: fallbackApartments,
    revalidateOnFocus: false,
    revalidateIfStale: false,
    dedupingInterval: 60000,
    focusThrottleInterval: 300000,
    errorRetryCount: 2,
  })
  const allApartments = Array.isArray(data) && data.length > 0 ? data : fallbackApartments
  const [showAll, setShowAll] = useState(false)
  const displayCount = showAll ? allApartments.length : 6
  const apartments = allApartments.slice(0, displayCount)
  const hasMore = displayCount < allApartments.length

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {apartments.map((apt) => (
          <ApartmentCard
            key={apt.id}
            id={apt.id}
            name={apt.name}
            description={apt.description}
            image={apt.image}
            price={apt.price}
            size={apt.size}
            guests={apt.guests}
            rooms={apt.rooms}
            amenities={apt.amenities}
            fullAmenities={apt.fullAmenities}
          />
        ))}
      </div>

      {hasMore && (
        <div className="text-center">
          <button
            onClick={() => setShowAll(true)}
            className="inline-block border-2 border-[#3D6B7D] text-[#3D6B7D] px-10 py-4 text-base font-medium tracking-wide hover:bg-[#3D6B7D] hover:text-white transition-colors uppercase"
          >
            Смотреть ещё
          </button>
        </div>
      )}
    </>
  )
}
