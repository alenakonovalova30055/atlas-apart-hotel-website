'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface SelectedApartment {
  id: string
  name: string
  image: string
  price: number
  totalPrice: number
  size: string
  guests: string
  rooms: string
  guestCount: number
}

interface StoredState {
  selectedApartments: SelectedApartment[]
  isMultiMode: boolean
  checkIn: string | null
  checkOut: string | null
}

interface MultiBookingContextType {
  // Selection state
  selectedApartments: SelectedApartment[]
  isMultiMode: boolean
  isHydrated: boolean
  
  // Booking dates
  checkIn: Date | null
  checkOut: Date | null
  nights: number
  
  // Actions
  setMultiMode: (value: boolean) => void
  addApartment: (apt: SelectedApartment) => void
  removeApartment: (id: string) => void
  updateGuestCount: (id: string, count: number) => void
  clearAll: () => void
  setDates: (checkIn: Date | null, checkOut: Date | null) => void
  
  // Computed
  totalPrice: number
  totalGuests: number
}

const STORAGE_KEY = 'multi-booking-state'

const MultiBookingContext = createContext<MultiBookingContextType | undefined>(undefined)

export function MultiBookingProvider({ children }: { children: ReactNode }) {
  const [selectedApartments, setSelectedApartments] = useState<SelectedApartment[]>([])
  const [isMultiMode, setIsMultiModeState] = useState(false)
  const [checkIn, setCheckIn] = useState<Date | null>(null)
  const [checkOut, setCheckOut] = useState<Date | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)
  
  // Restore state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed: StoredState = JSON.parse(stored)
        setSelectedApartments(parsed.selectedApartments || [])
        setIsMultiModeState(parsed.isMultiMode || false)
        if (parsed.checkIn) setCheckIn(new Date(parsed.checkIn))
        if (parsed.checkOut) setCheckOut(new Date(parsed.checkOut))
      }
    } catch (e) {
      // Ignore parsing errors
    }
    setIsHydrated(true)
  }, [])
  
  // Save state to localStorage on changes
  useEffect(() => {
    if (!isHydrated) return
    
    const state: StoredState = {
      selectedApartments,
      isMultiMode,
      checkIn: checkIn?.toISOString() || null,
      checkOut: checkOut?.toISOString() || null
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [selectedApartments, isMultiMode, checkIn, checkOut, isHydrated])
  
  const nights = checkIn && checkOut 
    ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    : 0

  const addApartment = (apt: SelectedApartment) => {
    if (selectedApartments.length >= 3) return // Max 3 apartments
    if (selectedApartments.find(a => a.id === apt.id)) return // Already added
    setSelectedApartments(prev => [...prev, apt])
  }

  const removeApartment = (id: string) => {
    setSelectedApartments(prev => prev.filter(a => a.id !== id))
  }

  const updateGuestCount = (id: string, count: number) => {
    setSelectedApartments(prev => 
      prev.map(a => a.id === id ? { ...a, guestCount: count } : a)
    )
  }

  const clearAll = () => {
    setSelectedApartments([])
    setIsMultiModeState(false)
    localStorage.removeItem(STORAGE_KEY)
  }

  const setDates = (newCheckIn: Date | null, newCheckOut: Date | null) => {
    setCheckIn(newCheckIn)
    setCheckOut(newCheckOut)
  }

  const setMultiMode = (value: boolean) => {
    setIsMultiModeState(value)
    if (!value) {
      setSelectedApartments([])
    }
  }

  const totalPrice = selectedApartments.reduce((sum, apt) => sum + apt.totalPrice, 0)
  const totalGuests = selectedApartments.reduce((sum, apt) => sum + apt.guestCount, 0)

  return (
    <MultiBookingContext.Provider value={{
      selectedApartments,
      isMultiMode,
      isHydrated,
      checkIn,
      checkOut,
      nights,
      setMultiMode,
      addApartment,
      removeApartment,
      updateGuestCount,
      clearAll,
      setDates,
      totalPrice,
      totalGuests
    }}>
      {children}
    </MultiBookingContext.Provider>
  )
}

export function useMultiBooking() {
  const context = useContext(MultiBookingContext)
  if (!context) {
    throw new Error('useMultiBooking must be used within MultiBookingProvider')
  }
  return context
}
