"use client"

import React from "react"
import ApartmentCard from './ApartmentCard'

import { useState, useRef, useEffect } from 'react'
import { Calendar, Users, Search, X, ChevronDown, ChevronLeft, ChevronRight, Loader2, Home, Plus, Check, Trash2, Info, Maximize2, Bath, BedDouble } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { apartments as fallbackData } from '@/lib/apartments-data'
import { useMultiBooking } from '@/contexts/multi-booking-context'


const fetcher = (url: string) => fetch(url).then(r => r.json())

function formatDate(date: Date | null): string {
  if (!date) return ''
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatDateForUrl(date: Date): string {
  return date.toISOString().split('T')[0]
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1 // Monday = 0
}

interface CalendarPickerProps {
  selectedDate: Date | null
  onSelect: (date: Date) => void
  onClose: () => void
  minDate?: Date
}

function CalendarPicker({ selectedDate, onSelect, onClose, minDate }: CalendarPickerProps) {
  const today = new Date()
  const [viewDate, setViewDate] = useState(selectedDate || today)
  
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  
  const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
                      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
  
  const days: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }
  
  const isDisabled = (day: number) => {
    const date = new Date(year, month, day)
    if (minDate && date < minDate) return true
    if (date < new Date(today.getFullYear(), today.getMonth(), today.getDate())) return true
    return false
  }
  
  const isSelected = (day: number) => {
    if (!selectedDate) return false
    return selectedDate.getDate() === day && 
           selectedDate.getMonth() === month && 
           selectedDate.getFullYear() === year
  }
  
  // Ограничиваем навигацию 8 месяцами вперед
  const maxDate = new Date(today.getFullYear(), today.getMonth() + 8, 1)
  const canGoNext = viewDate < maxDate
  const canGoPrev = viewDate > new Date(today.getFullYear(), today.getMonth(), 1)
  
  return (
    <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 z-50 min-w-[300px]">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => canGoPrev && setViewDate(new Date(year, month - 1, 1))}
          disabled={!canGoPrev}
          className={`p-2 rounded-lg transition-colors ${canGoPrev ? 'hover:bg-gray-100' : 'opacity-30 cursor-not-allowed'}`}
        >
          <ChevronDown className="w-5 h-5 rotate-90 text-[#174051]" />
        </button>
        <span className="font-medium text-[#174051]">{monthNames[month]} {year}</span>
        <button 
          onClick={() => canGoNext && setViewDate(new Date(year, month + 1, 1))}
          disabled={!canGoNext}
          className={`p-2 rounded-lg transition-colors ${canGoNext ? 'hover:bg-gray-100' : 'opacity-30 cursor-not-allowed'}`}
        >
          <ChevronDown className="w-5 h-5 -rotate-90 text-[#174051]" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs text-gray-500 py-1">{day}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => (
          <div key={i} className="aspect-square">
            {day && (
              <button
                onClick={() => {
                  if (!isDisabled(day)) {
                    onSelect(new Date(year, month, day))
                    onClose()
                  }
                }}
                disabled={isDisabled(day)}
                className={`w-full h-full flex items-center justify-center text-sm rounded-lg transition-colors
                  ${isSelected(day) ? 'bg-[#2d80a1] text-white' : ''}
                  ${isDisabled(day) ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-[#2d80a1]/10 text-[#174051]'}
                `}
              >
                {day}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

interface AvailabilityResult {
  apartmentId: string
  isAvailable: boolean
  price?: number
}

export function BookingSearch() {
  const { data: rawData } = useSWR('/api/apartments', fetcher, {
    fallbackData: fallbackData,
    revalidateOnFocus: false,
    revalidateIfStale: false,
    dedupingInterval: 60000,
    focusThrottleInterval: 300000,
    errorRetryCount: 2,
  })
  const allApartmentsData = Array.isArray(rawData) && rawData.length > 0 ? rawData : fallbackData
  const availableApartments = allApartmentsData.filter((apt: any) => apt.isAvailable !== false)
  const router = useRouter()
  const [checkIn, setCheckIn] = useState<Date | null>(null)
  const [checkOut, setCheckOut] = useState<Date | null>(null)
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [roomCount, setRoomCount] = useState(1)
  const [showCheckInCalendar, setShowCheckInCalendar] = useState(false)
  const [showCheckOutCalendar, setShowCheckOutCalendar] = useState(false)
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false)
  const [showRoomsDropdown, setShowRoomsDropdown] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [availabilityResults, setAvailabilityResults] = useState<AvailabilityResult[]>([])
  const [detailApartment, setDetailApartment] = useState<any>(null)
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)
  
  const { 
    selectedApartments, 
    isMultiMode, 
    setMultiMode, 
    addApartment, 
    removeApartment,
    setDates,
    clearAll 
  } = useMultiBooking()
  
  const totalGuests = adults + children
  
  const searchRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowCheckInCalendar(false)
        setShowCheckOutCalendar(false)
        setShowGuestsDropdown(false)
        setShowRoomsDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  const handleSearch = async () => {
    // Enable multi-mode if searching for multiple rooms
    if (roomCount > 1) {
      setMultiMode(true)
      setDates(checkIn, checkOut)
    } else {
      setMultiMode(false)
      clearAll()
    }
    
    if (!checkIn || !checkOut) {
      // Если даты не выбраны, показываем все доступные апартаменты
      setAvailabilityResults(availableApartments.map(apt => ({ 
        apartmentId: apt.id, 
        isAvailable: true,
        price: apt.price 
      })))
      setShowResults(true)
      return
    }
    
    setIsSearching(true)
    setShowResults(true)
    
    // При выборе нескольких номеров делим гостей на количество номеров для поиска
    // Это позволяет показать все доступные номера, а не только те, что вмещают всех гостей
    // Используем roomCount напрямую, так как isMultiMode еще не успел обновиться
    const guestsPerRoom = roomCount > 1 ? Math.ceil(totalGuests / roomCount) : totalGuests
    
    // Проверяем доступность каждого апартамента через API параллельно
    const dateFrom = formatDateForUrl(checkIn)
    const dateTo = formatDateForUrl(checkOut)
    
    console.log('[v0] BookingSearch: checking availability for dates', dateFrom, 'to', dateTo, 'guests per room:', guestsPerRoom, 'total:', totalGuests, 'rooms:', roomCount)
    console.log('[v0] BookingSearch: checking apartments:', availableApartments.map(a => a.id))
    
    const results = await Promise.all(
      availableApartments.map(async (apt) => {
        try {
          const response = await fetch('/api/availability', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              apartmentId: apt.id,
              checkIn: dateFrom,
              checkOut: dateTo,
              adults: guestsPerRoom // Используем гостей на номер, а не общее количество
            })
          })
          const data = await response.json()
          
          console.log(`[v0] BookingSearch: ${apt.id} response:`, data.available, data.error || '')
          
          return {
            apartmentId: apt.id,
            isAvailable: data.available === true,
            price: data.totalPrice || apt.price
          }
        } catch (error) {
          console.log(`[v0] BookingSearch: ${apt.id} error:`, error)
          // При ошибке считаем недоступным
          return {
            apartmentId: apt.id,
            isAvailable: false
          }
        }
      })
    )
    
    setAvailabilityResults(results)
    setIsSearching(false)
  }
  
  const nights = checkIn && checkOut 
    ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    : 0
  
  // Фильтруем апартаменты по результатам проверки
  const filteredApartments = availableApartments.filter(apt => {
    const result = availabilityResults.find(r => r.apartmentId === apt.id)
    return result?.isAvailable !== false
  })
  
  // Получаем цену из результатов
  const getApartmentPrice = (aptId: string, defaultPrice: number) => {
    const result = availabilityResults.find(r => r.apartmentId === aptId)
    return result?.price || defaultPrice
  }
  
  // URL для перехода на страницу апартамента с датами
  const getBookingUrl = (aptId: string) => {
    const params = new URLSearchParams()
    if (checkIn) params.set('checkIn', formatDateForUrl(checkIn))
    if (checkOut) params.set('checkOut', formatDateForUrl(checkOut))
    if (totalGuests > 1) params.set('guests', String(totalGuests))
    return `/apartments/${aptId}${params.toString() ? `?${params.toString()}` : ''}`
  }
  
  // Получаем все фото апартамента
  const getImages = (apt: typeof availableApartments[0]): string[] => {
    if (Array.isArray(apt.image)) {
      return apt.image
    }
    return [apt.image]
  }
  
  // Состояние для текущего фото каждого апартамента
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({})
  
  const nextImage = (aptId: string, totalImages: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex(prev => ({
      ...prev,
      [aptId]: ((prev[aptId] || 0) + 1) % totalImages
    }))
  }
  
  const prevImage = (aptId: string, totalImages: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex(prev => ({
      ...prev,
      [aptId]: ((prev[aptId] || 0) - 1 + totalImages) % totalImages
    }))
  }
  
  return (
    <>
      <div ref={searchRef} className="w-full max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-1.5 md:p-2 flex flex-col md:flex-row items-stretch md:items-center gap-1.5 md:gap-0 border border-[#DFCC8C]/30">
          {/* Check-in */}
          <div className="relative flex-1 px-3 py-2 md:border-r border-gray-200">
            <button
              onClick={() => {
                setShowCheckInCalendar(!showCheckInCalendar)
                setShowCheckOutCalendar(false)
                setShowGuestsDropdown(false)
              }}
              className="w-full text-left flex items-center gap-3"
            >
              <Calendar className="w-5 h-5 text-[#2d80a1]" />
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Заезд</div>
                <div className="text-[#174051] font-medium">
                  {checkIn ? formatDate(checkIn) : 'Выберите дату'}
                </div>
              </div>
            </button>
            {showCheckInCalendar && (
              <CalendarPicker
                selectedDate={checkIn}
                onSelect={(date) => {
                  setCheckIn(date)
                  if (checkOut && date >= checkOut) {
                    setCheckOut(null)
                  }
                }}
                onClose={() => setShowCheckInCalendar(false)}
              />
            )}
          </div>
          
          {/* Check-out */}
          <div className="relative flex-1 px-3 py-2 md:border-r border-gray-200">
            <button
              onClick={() => {
                setShowCheckOutCalendar(!showCheckOutCalendar)
                setShowCheckInCalendar(false)
                setShowGuestsDropdown(false)
              }}
              className="w-full text-left flex items-center gap-3"
            >
              <Calendar className="w-5 h-5 text-[#2d80a1]" />
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Выезд</div>
                <div className="text-[#174051] font-medium">
                  {checkOut ? formatDate(checkOut) : 'Выберите дату'}
                </div>
              </div>
            </button>
            {showCheckOutCalendar && (
              <CalendarPicker
                selectedDate={checkOut}
                onSelect={setCheckOut}
                onClose={() => setShowCheckOutCalendar(false)}
                minDate={checkIn ? new Date(checkIn.getTime() + 86400000) : undefined}
              />
            )}
          </div>
          
          {/* Rooms */}
          <div className="relative flex-1 px-3 py-2 md:border-r border-gray-200">
            <button
              onClick={() => {
                setShowRoomsDropdown(!showRoomsDropdown)
                setShowGuestsDropdown(false)
                setShowCheckInCalendar(false)
                setShowCheckOutCalendar(false)
              }}
              className="w-full text-left flex items-center gap-3"
            >
              <Home className="w-5 h-5 text-[#2d80a1]" />
              <div className="flex-1">
                <div className="text-xs text-gray-500 uppercase tracking-wide">Номера</div>
                <div className="text-[#174051] font-medium">
                  {roomCount} {roomCount === 1 ? 'номер' : roomCount < 5 ? 'номера' : 'номеров'}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {showRoomsDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-5 z-50 min-w-[280px]">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[#174051] font-medium">Количество номеров</span>
                    <p className="text-xs text-gray-400">до 3 номеров</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setRoomCount(Math.max(1, roomCount - 1))}
                      disabled={roomCount <= 1}
                      className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-lg font-medium transition-all
                        ${roomCount <= 1 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-[#2d80a1] text-[#2d80a1] hover:bg-[#2d80a1] hover:text-white'}
                      `}
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-semibold text-[#174051]">{roomCount}</span>
                    <button
                      onClick={() => setRoomCount(Math.min(3, roomCount + 1))}
                      disabled={roomCount >= 3}
                      className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-lg font-medium transition-all
                        ${roomCount >= 3 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-[#2d80a1] text-[#2d80a1] hover:bg-[#2d80a1] hover:text-white'}
                      `}
                    >
                      +
                    </button>
                  </div>
                </div>
                {roomCount > 1 && (
                  <p className="text-xs text-[#2d80a1] mt-3 bg-[#2d80a1]/5 p-2 rounded-lg">
                    Вы сможете выбрать {roomCount} апартамента для совместного бронирования
                  </p>
                )}
              </div>
            )}
          </div>
          
          {/* Guests */}
          <div className="relative flex-1 px-3 py-2 md:border-r border-gray-200">
            <button
              onClick={() => {
                setShowGuestsDropdown(!showGuestsDropdown)
                setShowRoomsDropdown(false)
                setShowCheckInCalendar(false)
                setShowCheckOutCalendar(false)
              }}
              className="w-full text-left flex items-center gap-3"
            >
              <Users className="w-5 h-5 text-[#2d80a1]" />
              <div className="flex-1">
                <div className="text-xs text-gray-500 uppercase tracking-wide">Гости</div>
                <div className="text-[#174051] font-medium">
                  {totalGuests} {totalGuests === 1 ? 'гость' : totalGuests < 5 ? 'гостя' : 'гостей'}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {showGuestsDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-5 z-50 min-w-[280px]">
                {/* Adults */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[#174051] font-medium">Взрослые</span>
                    <p className="text-xs text-gray-400">от 18 лет</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      disabled={adults <= 1}
                      className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-lg font-medium transition-all
                        ${adults <= 1 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-[#2d80a1] text-[#2d80a1] hover:bg-[#2d80a1] hover:text-white'}
                      `}
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-semibold text-[#174051]">{adults}</span>
                    <button
                      onClick={() => setAdults(Math.min(10, adults + 1))}
                      disabled={adults >= 10}
                      className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-lg font-medium transition-all
                        ${adults >= 10 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-[#2d80a1] text-[#2d80a1] hover:bg-[#2d80a1] hover:text-white'}
                      `}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                {/* Children */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[#174051] font-medium">Дети</span>
                    <p className="text-xs text-gray-400">до 17 лет</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      disabled={children <= 0}
                      className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-lg font-medium transition-all
                        ${children <= 0 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-[#2d80a1] text-[#2d80a1] hover:bg-[#2d80a1] hover:text-white'}
                      `}
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-semibold text-[#174051]">{children}</span>
                    <button
                      onClick={() => setChildren(Math.min(10, children + 1))}
                      disabled={children >= 10}
                      className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-lg font-medium transition-all
                        ${children >= 10 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-[#2d80a1] text-[#2d80a1] hover:bg-[#2d80a1] hover:text-white'}
                      `}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Search Button */}
          <div className="px-1.5">
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="w-full md:w-auto bg-[#2d80a1] hover:bg-[#226079] text-white font-semibold px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>Найти</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Results Modal - увеличенный размер */}
      {showResults && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-10 px-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-8">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
              <div>
                <h3 className="text-2xl font-semibold text-[#174051]">
                  {isMultiMode ? `Выберите ${roomCount} апартамента` : 'Доступные апартаменты'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {checkIn && checkOut ? (
                    <>{formatDate(checkIn)} — {formatDate(checkOut)} · {nights} {nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'} · {adults} взр.{children > 0 ? `, ${children} дет.` : ''}</>
                  ) : (
                    <>{adults} взр.{children > 0 ? `, ${children} дет.` : ''}</>
                  )}
                  {isMultiMode && selectedApartments.length > 0 && (
                    <span className="ml-2 text-[#2d80a1] font-medium">
                      · Выбрано: {selectedApartments.length}/{roomCount}
                    </span>
                  )}
                </p>
              </div>
              <button 
                onClick={() => {
                  setShowResults(false)
                  if (isMultiMode) {
                    clearAll()
                  }
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            {/* Selected apartments panel for multi-mode */}
            {isMultiMode && selectedApartments.length > 0 && (
              <div className="px-6 py-4 bg-[#2d80a1]/5 border-b border-[#2d80a1]/20">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-sm font-medium text-[#174051]">Выбранные номера:</span>
                  {selectedApartments.map(apt => (
                    <div key={apt.id} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-[#2d80a1]/30">
                      <img src={apt.image || '/placeholder.svg'} alt="" className="w-6 h-6 rounded-full object-cover" />
                      <span className="text-sm text-[#174051]">{apt.name}</span>
                      <button 
                        onClick={() => removeApartment(apt.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {selectedApartments.length > 0 && (
                    <button
                      onClick={() => {
                        setShowResults(false)
                        router.push('/booking/group')
                      }}
                      className="ml-auto bg-[#2d80a1] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#236580] transition-colors flex items-center gap-2"
                    >
                      Продолжить бронирование
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
            
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {isSearching ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="w-10 h-10 text-[#2d80a1] animate-spin mb-4" />
                  <p className="text-gray-500">Проверяем доступность апартаментов...</p>
                </div>
              ) : filteredApartments.length > 0 ? (
                filteredApartments.map(apt => {
                  const totalPrice = getApartmentPrice(apt.id, apt.price)
                  const pricePerNight = nights > 0 ? Math.round(totalPrice / nights) : apt.price
                  const images = Array.isArray(apt.image) ? apt.image : [apt.image]
                  const isSelected = selectedApartments.some(a => a.id === apt.id)
                  const canAdd = selectedApartments.length < roomCount && !isSelected
                  
                  return (
                    <div key={apt.id} className={`relative ${isSelected ? 'ring-2 ring-[#2d80a1] rounded-xl' : ''}`}>
                      {isMultiMode && (
                        <div className="absolute top-4 right-4 z-10">
                          {isSelected ? (
                            <button
                              onClick={() => removeApartment(apt.id)}
                              className="bg-[#2d80a1] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-red-500 transition-colors"
                            >
                              <Check className="w-4 h-4" />
                              Выбрано
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (canAdd) {
                                  addApartment({
                                    id: apt.id,
                                    name: apt.name,
                                    image: images[0],
                                    price: apt.price,
                                    totalPrice,
                                    size: apt.size,
                                    guests: apt.guests,
                                    rooms: apt.rooms,
                                    guestCount: Math.ceil(totalGuests / roomCount)
                                  })
                                }
                              }}
                              disabled={!canAdd}
                              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                                canAdd 
                                  ? 'bg-white border-2 border-[#2d80a1] text-[#2d80a1] hover:bg-[#2d80a1] hover:text-white' 
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              <Plus className="w-4 h-4" />
                              Добавить
                            </button>
                          )}
                        </div>
                      )}
                      <ApartmentCard
                        apt={apt}
                        images={images}
                        totalPrice={totalPrice}
                        pricePerNight={pricePerNight}
                        nights={nights}
                        bookingUrl={isMultiMode ? undefined : getBookingUrl(apt.id)}
                        hideButton={isMultiMode}
                        isMultiMode={isMultiMode}
                        onShowDetails={() => setDetailApartment(apt)}
                      />
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-[#174051] mb-2">Нет свободных апартаментов</h4>
                  <p className="text-gray-500">К сожалению, на выбранные даты все апартаменты заняты.<br/>Попробуйте изменить даты поездки.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Модальное окно с деталями апартамента */}
      {detailApartment && (
        <div 
          className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDetailApartment(null)
          }}
        >
          <div className="bg-[#f8f6f3] rounded-2xl shadow-2xl w-full max-w-4xl my-8 mx-4 relative">
            {/* Кнопка закрытия - фиксированная в углу */}
            <button 
              onClick={() => setDetailApartment(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-[#174051]" />
            </button>
            
            {/* Заголовок */}
            <div className="px-6 pt-6 pb-4">
              <h3 className="font-serif text-2xl text-[#174051] pr-12">{detailApartment.name}</h3>
            </div>
            
            <div className="px-6 pb-6 space-y-4">
              {/* Галерея - компактная сетка */}
              <div className="grid grid-cols-4 gap-2">
                {(Array.isArray(detailApartment.image) ? detailApartment.image.slice(0, 5) : [detailApartment.image]).map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setZoomedImage(img)}
                    className={`relative rounded-lg overflow-hidden cursor-zoom-in group ${idx === 0 ? 'col-span-2 row-span-2' : ''}`}
                  >
                    <div className={`${idx === 0 ? 'aspect-[4/3]' : 'aspect-square'}`}>
                      <img src={img || '/placeholder.svg'} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </button>
                ))}
              </div>
              
              {/* Quick Stats - стиль как на странице апартамента */}
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                  <Maximize2 className="w-4 h-4 text-[#2d80a1] mx-auto mb-1" />
                  <p className="text-sm font-medium text-[#174051]">{detailApartment.size}</p>
                  <p className="text-[10px] text-[#4A7A8C] uppercase">Площадь</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                  <BedDouble className="w-4 h-4 text-[#2d80a1] mx-auto mb-1" />
                  <p className="text-sm font-medium text-[#174051]">{detailApartment.rooms.split('+')[0].trim()}</p>
                  <p className="text-[10px] text-[#4A7A8C] uppercase">Спальни</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                  <Bath className="w-4 h-4 text-[#2d80a1] mx-auto mb-1" />
                  <p className="text-sm font-medium text-[#174051]">{detailApartment.rooms.includes('ванн') ? detailApartment.rooms.split('+').pop()?.trim().split(' ')[0] : '1'}</p>
                  <p className="text-[10px] text-[#4A7A8C] uppercase">Ванные</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                  <Users className="w-4 h-4 text-[#2d80a1] mx-auto mb-1" />
                  <p className="text-sm font-medium text-[#174051]">{detailApartment.guests.replace('до ', '')}</p>
                  <p className="text-[10px] text-[#4A7A8C] uppercase">Гостей</p>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h2 className="font-serif text-base text-[#174051] mb-3">Об апартаментах</h2>
                <div className="text-[#4A7A8C] leading-relaxed text-sm space-y-3">
                  {detailApartment.description.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h2 className="font-serif text-base text-[#174051] mb-3">Удобства</h2>
                <div className="grid grid-cols-2 gap-2">
                  {detailApartment.fullAmenities.map((amenity: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#2d80a1] flex-shrink-0" />
                      <span className="text-[#4A7A8C] text-sm font-semibold">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* House Rules */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h2 className="font-serif text-base text-[#174051] mb-3">Правила</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <p className="text-[10px] text-[#4A7A8C] uppercase mb-0.5">Заезд</p>
                    <p className="text-[#174051]">с 14:00</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#4A7A8C] uppercase mb-0.5">Выезд</p>
                    <p className="text-[#174051]">до 12:00</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#4A7A8C] uppercase mb-0.5">Курение</p>
                    <p className="text-[#174051] font-medium">Запрещено в номере</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#4A7A8C] uppercase mb-0.5">Животные</p>
                    <p className="text-[#174051]">По согласованию</p>
                  </div>
                </div>
              </div>

              {/* Pool Bonus Block */}
              <div className="bg-gradient-to-br from-[#f8f6f1] to-white rounded-lg p-4 shadow-sm border border-[#DFCC8C]/20 relative overflow-hidden">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2d80a1]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#2d80a1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0120.25 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V10.5a2.25 2.25 0 01-2.25 2.25H13.5V6z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-[#C4A76C] uppercase tracking-wider">Бонус</span>
                      <span className="text-[10px] px-2 py-0.5 bg-[#2d80a1]/10 text-[#2d80a1] rounded-full font-medium">Включено</span>
                    </div>
                    <h3 className="font-serif text-[#174051] text-sm mb-1">Подогреваемый бассейн</h3>
                    <p className="text-xs text-[#4A7A8C] leading-relaxed">Посещение подогреваемого бассейна входит в стоимость проживания</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Футер с ценой и кнопкой */}
            <div className="bg-white border-t border-[#DFCC8C]/30 p-4 flex items-center justify-between rounded-b-2xl">
              <div>
                <div className="text-2xl font-bold text-[#174051]">
                  {(getApartmentPrice(detailApartment.id, detailApartment.price)).toLocaleString('ru-RU')} ₽
                </div>
                <div className="text-sm text-[#4A7A8C]">
                  {nights > 0 ? `${Math.round(getApartmentPrice(detailApartment.id, detailApartment.price) / nights).toLocaleString('ru-RU')} ₽/ночь · ${nights} ${nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'}` : 'за проживание'}
                </div>
              </div>
              {isMultiMode ? (
                <button
                  onClick={() => {
                    const images = Array.isArray(detailApartment.image) ? detailApartment.image : [detailApartment.image]
                    const totalPrice = getApartmentPrice(detailApartment.id, detailApartment.price)
                    const isSelected = selectedApartments.some(a => a.id === detailApartment.id)
                    const canAdd = selectedApartments.length < roomCount && !isSelected
                    
                    if (isSelected) {
                      removeApartment(detailApartment.id)
                    } else if (canAdd) {
                      addApartment({
                        id: detailApartment.id,
                        name: detailApartment.name,
                        image: images[0],
                        price: detailApartment.price,
                        totalPrice,
                        size: detailApartment.size,
                        guests: detailApartment.guests,
                        rooms: detailApartment.rooms,
                        guestCount: Math.ceil(totalGuests / roomCount)
                      })
                    }
                    setDetailApartment(null)
                  }}
                  className={`px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 ${
                    selectedApartments.some(a => a.id === detailApartment.id)
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : selectedApartments.length < roomCount
                        ? 'bg-[#2d80a1] hover:bg-[#236580] text-white'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {selectedApartments.some(a => a.id === detailApartment.id) ? (
                    <>
                      <X className="w-5 h-5" />
                      Убрать из выбора
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Добавить
                    </>
                  )}
                </button>
              ) : (
                <a
                  href={getBookingUrl(detailApartment.id)}
                  className="bg-[#2d80a1] hover:bg-[#236580] text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  Забронировать
                </a>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Модальное окно для увеличенного фото */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-[70] flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoomedImage(null)}
        >
          <button 
            onClick={() => setZoomedImage(null)}
            className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <img 
            src={zoomedImage || "/placeholder.svg"} 
            alt="" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
