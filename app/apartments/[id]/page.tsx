'use client'

import { useSearchParams } from "next/navigation"

import React from "react"

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, Users, Maximize2, ArrowLeft, Check, Bed, Bath, Calendar, Phone, Mail, ChevronDown, Tag, Heart, Gift, Clock, Percent, Search, CalendarDays } from 'lucide-react'
import Link from 'next/link'
import useSWR from 'swr'
import { BookingCalendarModal } from '@/components/booking-calendar-modal'

const apiFetcher = (url: string) => fetch(url).then(r => r.ok ? r.json() : null)

// Apartment data (fallback when Strapi is unavailable)
const apartments: Record<string, any> = {
  azure: {
    id: "azure",
    name: "Azure",
    description: "Стильные апартаменты в современном дизайне с тёплой, уютной атмосферой. Большая двуспальная кровать с мягким матрасом, сатиновым бельём, тремя подушками разной плотности и двумя большими одеялами. Спальня изолирована и закрывается дверями, в гостиной — просторный двуспальный диван.\n\nТёплый пол по всей зоне, эффектная лазурная ванная с полотенцесушителем. Кухня оснащена всем необходимым. Уютный балкон с комфортными стульями идеально подходит для утреннего кофе.\n\nДля гостей — взрослые и детские халаты, мягкие тапочки, профессиональная косметика и все необходимые косметические принадлежности.\n\nГости часто говорят, что здесь они чувствуют себя как в сказке.",
    rooms: "2 спальных места + 1 гостиная + 1 ванная",
    bedrooms: 2,
    bathrooms: 1,
    image: [
      "/apartments/azure-main.jpg",
      "/apartments/azure-1.jpg",
      "/apartments/azure-2.jpg",
      "/apartments/azure-3.jpg",
      "/apartments/azure-4.jpg",
      "/apartments/azure-5.jpg",
      "/apartments/azure-6.jpg",
      "/apartments/azure-7.jpg",
      "/apartments/azure-8.jpg",
      "/apartments/azure-9.jpg"
    ],
    price: 12000,
    size: "45 м²",
    guests: "до 4 гостей",
    fullAmenities: [
      "Кондиционер",
      "Wi-Fi",
      "Smart TV",
      "Голосовой помощник Алиса",
      "Кухня, полностью оборудованная",
      "Холодильник",
      "Стиральная машина",
      "Посудомоечная машина",
      "Кофемашина",
      "Фен",
      "Выпрямитель для волос",
      "Взрослые и детские халаты",
      "Тапочки",
      "Премиум косметика",
      "Полотенца для апартаментов",
      "Пляжные полотенца",
      "Утюг",
      "Настольные игры",
      "Детская кроватка (по запросу)"
    ]
  },
  "sea-deluxe": {
    id: "sea-deluxe",
    name: "Морской Делюкс",
    description: "Шикарные апартаменты в спокойном современном стиле с мягкой светло-серой и пастельной палитрой, идеально подходящей для размеренного и комфортного отдыха. Интерьер создаёт ощущение тишины, уюта и лёгкости — здесь легко расслабиться и переключиться от повседневной суеты.\n\nВ апартаментах предусмотрены 2 уютные спальни и просторная гостиная с большим раскладывающимся диваном, удобным как для отдыха, так и для сна. Пространство продумано так, чтобы каждому гостю было комфортно и свободно.\n\nОсобое удовольствие — просторный балкон с невероятным видом на море, где приятно встречать рассветы, проводить тёплые вечера и просто наслаждаться моментом.\n\nВ апартаментах есть всё для по-настоящему приятного отдыха: комфорт, эстетика, продуманные детали и ощущение заботы. Гости часто отмечают, что здесь легко замедлиться, выдохнуть и почувствовать себя в идеальном месте у моря.",
    rooms: "2 кровати + 1 гостиная + 1 ванная",
    bedrooms: 2,
    bathrooms: 1,
    image: [
      "/apartments/sea-deluxe/main.jpg",
      "/apartments/sea-deluxe/4.jpg",
      "/apartments/sea-deluxe/7.jpg",
      "/apartments/sea-deluxe/9.jpg",
      "/apartments/sea-deluxe/10.jpg",
      "/apartments/sea-deluxe/11.jpg",
      "/apartments/sea-deluxe/13.jpg",
      "/apartments/sea-deluxe/14.jpg",
      "/apartments/sea-deluxe/15.jpg",
      "/apartments/sea-deluxe/16.jpg"
    ],
    price: 12500,
    size: "55 м²",
    guests: "до 4 гостей",
    fullAmenities: [
      "Кондиционер",
      "Wi-Fi",
      "Балкон",
      "Кухня",
      "Микроволновая печь",
      "Телевизор",
      "Вид на море",
      "Кофемашина",
      "Индукционная плита",
      "Стиральная машина",
      "Фен",
      "Холодильник",
      "Взрослые и детские халаты",
      "Тапочки",
      "Премиум косметика",
      "Полотенца для апартаментов",
      "Пляжные полотенца",
      "Утюг",
      "Настольные игры",
      "Детская кроватка (по запросу)"
    ]
  },
  "ocean-suite": {
    id: "ocean-suite",
    name: "Ocean Suite",
    description: "Люкс апартаменты с панорамным видом на море, современный дизайн и премиум-уровень комфорта. Двухуровневые апартаменты с собственной террасой, джакузи и полностью оборудованной кухней для самых взыскательных гостей.",
    rooms: "2 спальни + 1 гостиная + 2 ванные",
    bedrooms: 2,
    bathrooms: 2,
    image: [
      "/apartments/luxury-bedroom.jpg",
      "/apartments/luxury-terrace.jpg",
      "/apartments/luxury-bedroom-suite.jpg",
      "/apartments/luxury-bathroom.jpg"
    ],
    price: 28000,
    size: "75 м²",
    guests: "до 4 гостей",
    fullAmenities: ["Кондиционер", "Wi-Fi", "Джакузи", "Терраса", "Кухня", "Посудомойка", "Стиральная машина", "Халаты и тапочки", "Панорамный вид", "Система умного дома"]
  },
  "mountain-retreat": {
    id: "mountain-retreat",
    name: "Горный Ретрит",
    description: "Уютный номер с видом на живописные крымские горы и виноградники. Идеальный выбор для любителей природы и спокойного отдыха вдали от суеты.",
    rooms: "1 спальня + 1 гостиная + 1 ванная",
    bedrooms: 1,
    bathrooms: 1,
    image: ["/apartments/mountain-retreat.jpg"],
    price: 9500,
    size: "45 м²",
    guests: "до 2 гостей",
    fullAmenities: ["Кондиционер", "Wi-Fi", "Мини-бар", "Балкон", "Телевизор", "Холодильник", "Чайник", "Фен"]
  },
  "spa-suite": {
    id: "spa-suite",
    name: "SPA Люкс",
    description: "Люкс с собственной SPA-зоной: сауна, хамам и массажная комната. Премиальный отдых для тех, кто ценит максимальный комфорт и заботу о себе.",
    rooms: "2 спальни + 1 гостиная + 2 ванные",
    bedrooms: 2,
    bathrooms: 2,
    image: ["/apartments/spa-suite.jpg"],
    price: 28000,
    size: "95 м²",
    guests: "до 2 гостей",
    fullAmenities: ["Климат-контроль", "Wi-Fi", "Сауна", "Хамам", "Массаж", "Кухня", "Телевизор", "Мини-кинотеатр"]
  },
  "sunrise-terrace": {
    id: "sunrise-terrace",
    name: "Белый Бархат",
    description: "Роскошные апартаменты, идеально подходящие для большой семьи или компании друзей. Просторное пространство включает две отдельные спальни, большую гостиную с кухней и огромный раскладной диван, создавая комфорт для совместного отдыха и личного уединения.\n\nВ апартаментах две полноценные ванные комнаты, одна из которых особенно впечатляет — с эстетичной отдельно стоящей ванной, превращающей ежедневные ритуалы в настоящее удовольствие.\n\nОсобая гордость апартаментов — большая приватная терраса с выходом на улицу и прямым расположением на берегу моря. Здесь море становится частью вашего отдыха: шаг — и вы уже у воды.\n\nЭти апартаменты созданы для того, чтобы провести время вместе красиво, спокойно и с ощущением настоящего люкса и роскоши, когда каждая деталь работает на комфорт и удовольствие гостей.",
    rooms: "2 спальни + 1 гостиная + 2 ванные",
    bedrooms: 2,
    bathrooms: 2,
    image: [
      "/apartments/luxury-bedroom.jpg",
      "/apartments/white-velvet/11.jpg",
      "/apartments/white-velvet/12.jpg",
      "/apartments/white-velvet/13.jpg",
      "/apartments/white-velvet/14.jpg",
      "/apartments/white-velvet/15.jpg",
      "/apartments/white-velvet/16.jpg",
      "/apartments/white-velvet/17.jpg"
    ],
    price: 25000,
    size: "85 м²",
    guests: "до 3 гостей",
    fullAmenities: [
      "Кондиционер",
      "Wi-Fi",
      "Smart TV",
      "Голосовой помощник Алиса",
      "Кухня, полностью оборудованная",
      "Холодильник",
      "Стиральная машина",
      "Посудомоечная машина",
      "Кофемашина",
      "Посуда для приготовления пищи",
      "Фен",
      "Фен-выпрямитель для волос",
      "Сейф",
      "Взрослые и детские халаты",
      "Тапочки",
      "Премиум косметика",
      "Полотенца для апартаментов",
      "Пляжные полотенца (с регулярной заменой)",
      "Утюг",
      "Настольные игры",
      "Детская кроватка (по запросу)"
    ]
  },
  "family": {
    id: "family",
    name: "Семейный Комфорт",
    description: "Просторные апартаменты для семейного отдыха с отдельной гостиной зоной. Всё необходимое для комфортного отдыха с детьми.",
    rooms: "2 спальни + 1 гостиная + 1 ванная",
    bedrooms: 2,
    bathrooms: 1,
    image: ["/apartments/family.jpg"],
    price: 15000,
    size: "70 м²",
    guests: "до 4 гостей",
    fullAmenities: ["Кондиционер", "Wi-Fi", "Кухня", "Стиральная машина", "Посудомойка", "Детская кроватка", "Детский стул", "Игрушки"]
  },
  "penthouse": {
    id: "penthouse",
    name: "Пентхаус Люкс",
    description: "Двухуровневые апартаменты с панорамным видом на море и собственной террасой. Вершина роскоши для особых случаев и незабываемых моментов.",
    rooms: "3 спальни + 2 гостиные + 3 ванные",
    bedrooms: 3,
    bathrooms: 3,
    image: ["/apartments/penthouse.jpg", "/apartments/luxury-terrace.jpg"],
    price: 45000,
    size: "120 м²",
    guests: "до 6 гостей",
    fullAmenities: ["Климат-контроль", "Wi-Fi", "Терраса", "Панорамный вид", "Кухня", "Винотека", "Посудомойка", "Система умного дома", "Джакузи", "Домашний кинотеатр"]
  },
  "studio-cozy": {
    id: "studio-cozy",
    name: "Студия Комфорт",
    description: "Компактная, но уютная студия для одного гостя или пары. Идеальный выбор для путешественников, ценящих минимализм и функциональность.",
    rooms: "1 студия + 1 ванная",
    bedrooms: 1,
    bathrooms: 1,
    image: ["/apartments/placeholder-blur.jpg"],
    price: 7000,
    size: "30 м²",
    guests: "до 2 гостей",
    fullAmenities: ["Кондиционер", "Wi-Fi", "Кровать", "Ванна", "Холодильник", "Телевизор", "Фен", "Туалетные принадлежности"]
  },
  "romantic-suite": {
    id: "romantic-suite",
    name: "Романтический Люкс",
    description: "Идеальный номер для романтического отдыха с джакузи и ванной. Уютная атмосфера и внимательный сервис для пар.",
    rooms: "1 спальня + 1 гостиная + 1 ванная",
    bedrooms: 1,
    bathrooms: 1,
    image: ["/apartments/placeholder-blur.jpg"],
    price: 18000,
    size: "50 м²",
    guests: "до 2 гостей",
    fullAmenities: ["Кондиционер", "Wi-Fi", "Джакузи", "Кровать King Size", "Роза в подарок", "Шампанское", "Свечи", "Премиум косметика", "Телевизор", "Мини-кинотеатр"]
  },
  "business-class": {
    id: "business-class",
    name: "Business Класс",
    description: "Апартаменты для деловых путешественников с просторной рабочей зоной. Все необходимое для продуктивной работы и комфортного отдыха.",
    rooms: "1 спальня + 1 офис + 1 ванная",
    bedrooms: 1,
    bathrooms: 1,
    image: ["/apartments/placeholder-blur.jpg"],
    price: 14000,
    size: "48 м²",
    guests: "до 2 гостей",
    fullAmenities: ["Кондиционер", "Wi-Fi", "Рабочий стол", "Монитор", "Принтер", "Телефон", "Мини-холодильник", "Кофемашина", "Телевизор", "Видеоконференция"]
  },
  "sun-paradise": {
    id: "sun-paradise",
    name: "Солнечный Рай",
    description: "Яркие апартаменты с максимальным количеством света и просторным видом на море. Идеально для тех, кто любит солнце и позитив.",
    rooms: "1 спальня + 1 гостиная + 1 ванная",
    bedrooms: 1,
    bathrooms: 1,
    image: ["/apartments/placeholder-blur.jpg"],
    price: 13000,
    size: "50 м²",
    guests: "до 3 гостей",
    fullAmenities: ["Кондиционер", "Wi-Fi", "Балкон с видом", "Кухня", "Микроволновка", "Телевизор", "Холодильник", "Фен", "Халаты", "Басейн"]
  },
  "mountain-view": {
    id: "mountain-view",
    name: "Горная Вершина",
    description: "Апартаменты с панорамным видом на горы и долину. Идеальное место для любителей природы и активного отдыха.",
    rooms: "1 спальня + 1 гостиная + 1 ванная",
    bedrooms: 1,
    bathrooms: 1,
    image: ["/apartments/placeholder-blur.jpg"],
    price: 11500,
    size: "52 м²",
    guests: "до 3 гостей",
    fullAmenities: ["Кондиционер", "Wi-Fi", "Панорамный вид", "Балкон", "Кухня", "Телевизор", "Холодильник", "Фен", "Чайник", "Туризм"]
  },
  "garden-view": {
    id: "garden-view",
    name: "Сад и Зелень",
    description: "Уютный номер с видом на благоустроенный сад отеля. Спокойная атмосфера среди зелени и цветов.",
    rooms: "1 спальня + 1 гостиная + 1 ванная",
    bedrooms: 1,
    bathrooms: 1,
    image: ["/apartments/placeholder-blur.jpg"],
    price: 9800,
    size: "42 м²",
    guests: "до 2 гостей",
    fullAmenities: ["Кондиционер", "Wi-Fi", "Вид на сад", "Балкон", "Телевизор", "Холодильник", "Мини-бар", "Фен", "Халаты", "Полотенца"]
  },
  "beach-club": {
    id: "beach-club",
    name: "Beach Club Сюит",
    description: "Апартаменты с прямым доступом к пляжу и эксклюзивной зоне барбекю. Идеально для пляжного отдыха.",
    rooms: "1 спальня + 1 гостиная + 1 ванная",
    bedrooms: 1,
    bathrooms: 1,
    image: ["/apartments/placeholder-blur.jpg"],
    price: 16000,
    size: "55 м²",
    guests: "до 4 гостей",
    fullAmenities: ["Кондиционер", "Wi-Fi", "Доступ к пляжу", "Барбекю", "Кухня", "Холодильник", "Телевизор", "Фен", "Полотенца", "Солнцезащита"]
  },
  "artist-space": {
    id: "artist-space",
    name: "Творческое Пространство",
    description: "Вдохновляющие апартаменты для творческих людей с собственной галереей и мастерской. Место для творчества и саморазвития.",
    rooms: "1 спальня + 1 студия + 1 ванная",
    bedrooms: 1,
    bathrooms: 1,
    image: ["/apartments/placeholder-blur.jpg"],
    price: 13500,
    size: "58 м²",
    guests: "до 2 гостей",
    fullAmenities: ["Кондиционер", "Wi-Fi", "Студия", "Мастерская", "Большие окна", "Полки для работ", "Рабочие столы", "Хорошее освещение", "Холодильник", "Телефон"]
  }
}

const allApartmentsForSuggestions = [
  { id: "azure", name: "Azure", price: 12000, image: "/apartments/azure-main.jpg", rooms: "1 спальня" },
  { id: "sea-deluxe", name: "Морской Делюкс", price: 12500, image: "/apartments/penthouse-master-bed.jpg", rooms: "1 спальня" },
  { id: "ocean-suite", name: "Ocean Suite", price: 28000, image: "/apartments/luxury-bedroom.jpg", rooms: "2 спальни" },
  { id: "mountain-retreat", name: "Горный Ретрит", price: 9500, image: "/apartments/mountain-retreat.jpg", rooms: "1 спальня" },
  { id: "spa-suite", name: "SPA Люкс", price: 28000, image: "/apartments/spa-suite.jpg", rooms: "2 спальни" },
  { id: "family", name: "Семейный Комфорт", price: 15000, image: "/apartments/family.jpg", rooms: "2 спальни" },
]

function formatDate(date: Date | null): string {
  if (!date) return ''
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// Format date for API (YYYY-MM-DD) without timezone conversion
// toISOString() converts to UTC which shifts date by -1 day for UTC+3
function formatDateForAPI(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Check if date is in promo period (January-May, October-December)
function isPromoSeason(date: Date): boolean {
  const month = date.getMonth()
  // January = 0, May = 4, October = 9, December = 11
  return (month >= 0 && month <= 4) || (month >= 9 && month <= 11)
}

  // Check if Last Minute discount applies
  // Applies from 22:00 the day before check-in until check-in date
  // Example: booking at 22:10 on April 23 for April 24 = Last Minute applies
  function isLastMinute(checkIn: Date | null): boolean {
    if (!checkIn) return false
    const now = new Date()
    
    // Get check-in date at midnight (start of day)
    const checkInMidnight = new Date(checkIn)
    checkInMidnight.setHours(0, 0, 0, 0)
    
    // Get 22:00 the day before check-in
    const lastMinuteStart = new Date(checkInMidnight)
    lastMinuteStart.setDate(lastMinuteStart.getDate() - 1)
    lastMinuteStart.setHours(22, 0, 0, 0)
    
    // Check-in must be in the future AND current time is after 22:00 the day before
    return checkIn.getTime() > now.getTime() && now.getTime() >= lastMinuteStart.getTime()
  }

// Check if date is in spring (March-May)
function isSpringDate(date: Date): boolean {
  const month = date.getMonth()
  // March = 2, May = 4
  return month >= 2 && month <= 4
}

export default function ApartmentDetail() {
  const params = useParams()
  const searchParams = useSearchParams()
  const apartmentId = params.id as string

  // Fetch from Strapi via API, fallback to hardcoded data
  const { data: strapiApt } = useSWR(
    apartmentId ? `/api/apartments/${apartmentId}` : null,
    apiFetcher,
    { revalidateOnFocus: false }
  )

  // Default rules (fallback)
  const defaultRules = { checkIn: '14:00', checkOut: '12:00', smoking: false, pets: false, description: 'По согласованию' }
  const defaultBonuses = [{ title: 'Подогреваемый бассейн', description: 'Посещение подогреваемого бассейна входит в стоимость проживания', included: true }]

  // Use Strapi data if available, otherwise use hardcoded fallback
  const localApt = apartments[apartmentId] || apartments.azure
  const apt = strapiApt && strapiApt.id ? {
    ...localApt,
    id: strapiApt.id || localApt.id,
    name: strapiApt.name || localApt.name,
    description: strapiApt.description || localApt.description,
    price: strapiApt.price || localApt.price,
    size: strapiApt.size || localApt.size,
    guests: strapiApt.guests || localApt.guests,
    bedrooms: strapiApt.bedroom || strapiApt.bedrooms || localApt.bedrooms,
    bathrooms: strapiApt.bathroom || strapiApt.bathrooms || localApt.bathrooms,
    rooms: strapiApt.rooms || localApt.rooms,
    fullAmenities: (strapiApt.fullAmenities && strapiApt.fullAmenities.length > 0)
      ? strapiApt.fullAmenities.map((a: any) => typeof a === 'string' ? a : a.title || '')
      : localApt.fullAmenities,
    rules: strapiApt.rules || localApt.rules || defaultRules,
    bonuses: strapiApt.bonuses || localApt.bonuses || defaultBonuses,
    image: (strapiApt.image && Array.isArray(strapiApt.image) && strapiApt.image.length > 0 && !strapiApt.image[0].includes('placeholder'))
      ? strapiApt.image : localApt.image,
  } : { ...localApt, rules: localApt.rules || defaultRules, bonuses: localApt.bonuses || defaultBonuses }
  const [currentImageIndex, setCurrentImageIndex] = useState(1)
  
  // Парсим даты из URL если они переданы
  const urlCheckIn = searchParams.get('checkIn')
  const urlCheckOut = searchParams.get('checkOut')
  const urlGuests = searchParams.get('guests')
  
  const [checkIn, setCheckIn] = useState<Date | null>(() => {
    if (urlCheckIn) {
      const date = new Date(urlCheckIn)
      return isNaN(date.getTime()) ? null : date
    }
    return null
  })
  const [checkOut, setCheckOut] = useState<Date | null>(() => {
    if (urlCheckOut) {
      const date = new Date(urlCheckOut)
      return isNaN(date.getTime()) ? null : date
    }
    return null
  })
  const [adults, setAdults] = useState(() => {
    if (urlGuests) {
      const guests = parseInt(urlGuests)
      return isNaN(guests) ? 2 : Math.max(1, Math.min(10, guests))
    }
    return 2
  })
  const [children, setChildren] = useState(0)
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false)
  const [isNewlyweds, setIsNewlyweds] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [promoCodeStatus, setPromoCodeStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle')
  const [promoCodeDiscount, setPromoCodeDiscount] = useState(0)
  const [promoCodeMessage, setPromoCodeMessage] = useState('')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  
  // Booking modal state
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingStep, setBookingStep] = useState<'guest' | 'prepay' | 'success'>('guest')
  
  // Предоплата (процент из тарифа Shelter)
  const [prepaymentPercent, setPrepaymentPercent] = useState(30) // По умолчанию 30%
  const [prepaymentType, setPrepaymentType] = useState(0) // 0 = процент, 1 = фиксированная сумма
  const [guestName, setGuestName] = useState('')
  const [guestLastName, setGuestLastName] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestCountry, setGuestCountry] = useState('Россия')
  const [arrivalTime, setArrivalTime] = useState('')
  const [bookingComment, setBookingComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [orderConfirmation, setOrderConfirmation] = useState<{orderId?: string; confirmationNumber?: string} | null>(null)
  
  // Occupied dates state
  const [occupiedDates, setOccupiedDates] = useState<string[]>([])
  const [isLoadingOccupiedDates, setIsLoadingOccupiedDates] = useState(false)
  
  // Availability state
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [availabilityChecked, setAvailabilityChecked] = useState(false)
  const [isAvailable, setIsAvailable] = useState(false)
  // Данные из Online API getVariants
  const [shelterVariant, setShelterVariant] = useState<{
    signature: string;
    roomCategoryID: number;
    tariffID: number;
    tariffName?: string;
    price: number;
    pricePerNight: number;
  } | null>(null)
  
  // Все доступные варианты с разными тарифами
  const [allShelterVariants, setAllShelterVariants] = useState<Array<{
    signature: string;
    roomCategoryID: number;
    tariffID: number;
    tariffName: string;
    price: number;
  }>>([])
  
  // Словарь тарифов: id -> name
  const [shelterTariffs, setShelterTariffs] = useState<Record<number, string>>({})
  
  // Модальный календарь на 2 месяца
  const [showCalendarModal, setShowCalendarModal] = useState(false)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

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
      nextImage()
    } else if (isRightSwipe) {
      prevImage()
    }
  }

  
  const bookingRef = useRef<HTMLDivElement>(null)
  const totalGuests = adults + children
  
  // Calculate nights
  const nights = checkIn && checkOut 
    ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    : 0
    
  // Calculate discounts
  const isLongStay = nights >= 14
  const isPromo = checkIn ? isPromoSeason(checkIn) : false
  const isLastMinuteBooking = isLastMinute(checkIn)
  // Каждая 3-я ночь бесплатно (при 3 ночах - 1 бесплатная, при 6 - 2, и т.д.)
  const freeNights = isPromo ? Math.floor(nights / 3) : 0
  
  // Calculate price - используем цену из Shelter если доступна
  // Для акции "3-я ночь в подарок" цена из Shelter уже учитывает скидку
  const pricePerNight = shelterVariant?.pricePerNight || apt.price
  let basePrice = shelterVariant?.price || (pricePerNight * nights)
  let discount = 0
  let discountLabel = ''
  let showThirdNightFreeBreakdown = false
  
  if (isLastMinuteBooking && nights === 1) {
    discount = basePrice * 0.35
    discountLabel = 'Last Minute -35%'
  } else if (isLongStay) {
    discount = basePrice * 0.15
    discountLabel = 'Долгосрочная аренда -15%'
  } else if (freeNights > 0 && isPromo) {
    // Shelter уже присылает цену со скидкой для тарифа "3-я ночь в подарок"
    // Показываем пользователю разбивку: оплачиваемые ночи и бесплатные
    showThirdNightFreeBreakdown = true
    const paidNights = nights - freeNights
    discountLabel = `3-я ночь в подарок: ${freeNights} ${freeNights === 1 ? 'ночь' : freeNights < 5 ? 'ночи' : 'ночей'} бесплатно`
    // Скидка уже учтена в цене от Shelter, но для отображения считаем разницу
    if (!shelterVariant) {
      discount = apt.price * freeNights
    }
  }
  
  const finalPrice = basePrice - discount
  
  // Prepayment amount (30% of total)
  const prepaymentAmount = Math.round(finalPrice * 0.3)
  
  // Check availability in Shelter PMS
  const checkRoomAvailability = async () => {
    if (!checkIn || !checkOut) {
      setBookingError('Пожалуйста, выберите даты заезда и выезда')
      return false
    }
    
    setIsCheckingAvailability(true)
    setBookingError('')
    
    try {
      const response = await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apartmentId: apt.id,
          checkIn: formatDateForAPI(checkIn),
          checkOut: formatDateForAPI(checkOut),
          adults,
          children,
        }),
      })
      
      const data = await response.json()
      
      setAvailabilityChecked(true)
      
      if (data.available) {
        setIsAvailable(true)
        // Сохраняем данные варианта из Online API если есть
        if (data.variant) {
          setShelterVariant({
            signature: data.variant.signature,
            roomCategoryID: data.variant.roomCategoryID,
            tariffID: data.variant.tariffID,
            tariffName: data.variant.tariffName,
            price: data.totalPrice || data.variant.price,
            pricePerNight: data.pricePerNight || Math.round(data.variant.price / (data.nights || 1)),
          })
          
          // Сохраняем все варианты с разными тарифами
          if (data.allVariants) {
            setAllShelterVariants(data.allVariants)
            console.log('[v0] All tariff variants:', data.allVariants.map((v: { tariffID: number; tariffName: string; price: number }) => 
              `${v.tariffName}(${v.tariffID}): ${v.price}₽`
            ))
          }
          
          // Сохраняем словарь тарифов
          if (data.tariffs) {
            setShelterTariffs(data.tariffs)
            console.log('[v0] Available tariffs:', data.tariffs)
          }
        } else {
          // Нет данных из Online API - используем локальные цены
          setShelterVariant(null)
          setAllShelterVariants([])
          setShelterTariffs({})
        }
        return true
      } else {
        setIsAvailable(false)
        setBookingError(data.error || 'К сожалению, номер недоступен на выбранные даты')
        return false
      }
    } catch (error) {
      console.error('[v0] Availability check error:', error)
      setBookingError('Ошибка проверки доступности. Попробуйте позже.')
      return false
    } finally {
      setIsCheckingAvailability(false)
    }
  }
  
  // Reset availability when dates change
  useEffect(() => {
  setAvailabilityChecked(false)
  setIsAvailable(false)
  setShelterVariant(null)
  setAllShelterVariants([])
  setShelterTariffs({})
  setBookingError('')
  }, [checkIn, checkOut])
  
  // Auto-check availability if dates came from URL
  useEffect(() => {
    if (urlCheckIn && urlCheckOut && checkIn && checkOut && !availabilityChecked) {
      // Автоматически проверяем доступность если даты пришли из URL
      const autoCheckAvailability = async () => {
        setIsCheckingAvailability(true)
        try {
          const dateFrom = checkIn.toISOString().split('T')[0]
          const dateTo = checkOut.toISOString().split('T')[0]
          
          const response = await fetch(
            `/api/check-availability?apartmentId=${apt.id}&checkIn=${dateFrom}&checkOut=${dateTo}&adults=${totalGuests}`
          )
          const data = await response.json()
          
          setAvailabilityChecked(true)
          if (data.available) {
            setIsAvailable(true)
            if (data.variant) {
              setShelterVariant(data.variant)
            }
            if (data.allVariants) {
              setAllShelterVariants(data.allVariants)
            }
            if (data.tariffs) {
              setShelterTariffs(data.tariffs)
            }
          } else {
            setIsAvailable(false)
            setBookingError(data.message || 'Номер недоступен на выбранные даты')
          }
        } catch (error) {
          setBookingError('Ошибка при проверке доступности')
        } finally {
          setIsCheckingAvailability(false)
        }
      }
      
      autoCheckAvailability()
    }
  }, [urlCheckIn, urlCheckOut, checkIn, checkOut, apt.id, totalGuests, availabilityChecked])
  
  // Handle booking submission
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!checkIn || !checkOut) {
      setBookingError('Пожалуйста, выберите даты заезда и выезда')
      return
    }
    
    // Step 1: Guest info validation
    if (bookingStep === 'guest') {
      if (!guestEmail.trim()) {
        setBookingError('Пожалуйста, введите email')
        return
      }
      if (!guestLastName.trim()) {
        setBookingError('Пожалуйста, введите фамилию')
        return
      }
      if (!guestName.trim()) {
        setBookingError('Пожалуйста, введите имя')
        return
      }
      if (!guestPhone.trim()) {
        setBookingError('Пожалуйста, введите номер телефона')
        return
      }
      
  // Move to prepay step
  setBookingError('')
  setBookingStep('prepay')
  return
    }
    
    // Step 2: Prepay - process payment, then immediately create booking in Shelter
    if (bookingStep === 'prepay') {
      setIsSubmitting(true)
      setBookingError('')
      
      try {
        // Симуляция оплаты (в реальности - редирект на платежную систему)
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // После успешной оплаты сразу создаем бронирование в Shelter
        let selectedVariant = shelterVariant
        const commentParts: string[] = []
        
        if (isNewlyweds) {
          commentParts.push('Молодожены/Девичник/День рождения - шампанское и фрукты в подарок')
        }
        
        if (allShelterVariants.length > 0) {
          const isLastMinuteActive = isLastMinute(checkIn) && nights === 1
          const isSeasonalActive = isPromoSeason(checkIn || new Date()) && freeNights > 0 && !isLongStay
          
          if (isLastMinuteActive) {
            const lastMinuteVariant = allShelterVariants.find(v => 
              v.tariffID === 83921 || v.tariffName.toLowerCase().includes('last')
            )
            if (lastMinuteVariant) {
              selectedVariant = { ...lastMinuteVariant, pricePerNight: Math.round(lastMinuteVariant.price / nights) }
              commentParts.push('Last Minute')
            }
          } else if (isLongStay) {
            const normalVariant = allShelterVariants.find(v => 
              v.tariffID === 83995 || v.tariffName.toLowerCase() === 'normal'
            )
            if (normalVariant) {
              selectedVariant = { ...normalVariant, pricePerNight: Math.round(normalVariant.price / nights) }
            }
            commentParts.push('Долгосрочная аренда -15%')
          } else if (isSeasonalActive) {
            const thirdNightFreeVariant = allShelterVariants.find(v => 
              v.tariffID === 81079 || v.tariffName.includes('3-я ночь') || v.tariffName.toLowerCase().includes('подарок')
            )
            if (thirdNightFreeVariant) {
              selectedVariant = { ...thirdNightFreeVariant, pricePerNight: Math.round(thirdNightFreeVariant.price / nights) }
              commentParts.push(`3-я ночь в подарок (${freeNights} бесплатно)`)
            }
          }
        }
        
        const specialOfferName = commentParts.join('. ')
        
        const response = await fetch('/api/booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            apartmentId: apt.id,
            guestName: `${guestLastName.trim()} ${guestName.trim()}`,
            guestPhone: guestPhone.trim(),
            guestEmail: guestEmail.trim(),
            checkIn: formatDateForAPI(checkIn),
            checkOut: formatDateForAPI(checkOut),
            adults,
            children,
            comment: bookingComment.trim(),
            signature: selectedVariant?.signature,
            roomCategoryID: selectedVariant?.roomCategoryID,
            tariffID: selectedVariant?.tariffID,
            price: selectedVariant?.price || basePrice,
            specialOffer: specialOfferName || undefined,
          }),
        })
        
        const data = await response.json()
        
        if (data.success) {
          setOrderConfirmation(data.data)
          setBookingStep('success')
          setBookingSuccess(true)
        } else {
          setBookingError(data.error || 'Произошла ошибка при бронировании')
        }
      } catch (error) {
        console.error('[v0] Booking error:', error)
        setBookingError('Произошла ошибка при отправке. Попробуйте позже.')
      } finally {
        setIsSubmitting(false)
      }
      return
    }
  }
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bookingRef.current && !bookingRef.current.contains(event.target as Node)) {
        setShowGuestsDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Scroll to top when apartment changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [params.id])

  // Auto-rotate carousel every 5 seconds (skip first image which is shown statically)
  useEffect(() => {
    if (apt.image.length <= 2) return
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const next = prev + 1
        // Skip index 0 (static image), loop from 1 to end
        return next >= apt.image.length ? 1 : next
      })
    }, 5000)
    
    return () => clearInterval(interval)
  }, [apt.image.length])

  const nextImage = () => {
    setCurrentImageIndex((prev) => {
      const next = prev + 1
      return next >= apt.image.length ? 1 : next
    })
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => {
      const next = prev - 1
      return next < 1 ? apt.image.length - 1 : next
    })
  }

  const otherApartments = allApartmentsForSuggestions.filter(a => a.id !== params.id).slice(0, 3)

  return (
    <main className="min-h-screen bg-[#f8f6f3]">
      {/* Compact Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <Link 
            href="/apartments" 
            className="inline-flex items-center gap-2 text-[#4A7A8C] hover:text-[#174051] transition-colors text-sm"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Все апартаменты</span>
          </Link>
        </div>
      </div>

      {/* Main Content - Compact Layout */}
      <div className="container mx-auto px-4 py-6">
        {/* Title Section */}
        <div className="mb-5">
          <p className="text-xs text-[#2d80a1] uppercase tracking-[0.15em] mb-1">Atlas Apart Hotel</p>
          <h1 className="font-serif text-2xl text-[#174051] mb-1">{apt.name}</h1>
          <p className="text-[#4A7A8C] text-sm">{apt.rooms}</p>
        </div>

        {/* Mobile: Single Full-Width Carousel with Swipe */}
        <div className="md:hidden mb-8">
          <div 
            className="relative aspect-[4/5] rounded-2xl overflow-hidden group touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div 
              className="w-full h-full cursor-pointer"
              onClick={() => { setLightboxIndex(currentImageIndex); setLightboxOpen(true); }}
            >
              <img
                src={apt.image[currentImageIndex] || "/placeholder.svg"}
                alt={`${apt.name} - фото ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-300 select-none pointer-events-none"
                draggable={false}
              />
              {/* Tap to view full */}
              <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <Maximize2 className="w-3 h-3" />
                <span>Увеличить</span>
              </div>
            </div>
            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
              {currentImageIndex + 1} / {apt.image.length}
            </div>
            {/* Swipe hint on first image */}
            {currentImageIndex === 0 && apt.image.length > 1 && (
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/70 text-xs flex items-center gap-1 animate-pulse">
                <ChevronLeft className="w-3 h-3" />
                <span>Свайпните для просмотра</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            )}
          </div>
        </div>

        {/* Desktop: Two-Photo Gallery Section */}
        <div className="hidden md:grid md:grid-cols-2 gap-4 mb-8">
          {/* Left Photo - Static (Main/Featured) */}
          <div 
            className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group"
            onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}
          >
            <img
              src={apt.image[0] || "/placeholder.svg"}
              alt={apt.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
                <Maximize2 className="w-5 h-5 text-[#174051]" />
              </div>
            </div>
          </div>
          
          {/* Right Photo - Auto-rotating Carousel */}
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group">
            <div 
              className="w-full h-full cursor-pointer"
              onClick={() => { setLightboxIndex(currentImageIndex); setLightboxOpen(true); }}
            >
              <img
                src={apt.image[currentImageIndex] || "/placeholder.svg"}
                alt={`${apt.name} - фото ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
                  <Maximize2 className="w-5 h-5 text-[#174051]" />
                </div>
              </div>
            </div>
            {/* Navigation Arrows */}
            {apt.image.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#174051] p-2 rounded-full shadow-md transition-all z-10"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#174051] p-2 rounded-full shadow-md transition-all z-10"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
            {/* Dot Indicators (skip first image) */}
            {apt.image.length > 2 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {apt.image.slice(1).map((_: string, idx: number) => (
                  <button
                    key={idx + 1}
                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx + 1); }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentImageIndex === idx + 1 
                        ? 'bg-white w-3' 
                        : 'bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-8 space-y-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                <Maximize2 className="w-4 h-4 text-[#2d80a1] mx-auto mb-1" />
                <p className="text-sm font-medium text-[#174051]">{apt.size}</p>
                <p className="text-[10px] text-[#4A7A8C] uppercase">Площадь</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                <Bed className="w-4 h-4 text-[#2d80a1] mx-auto mb-1" />
                <p className="text-sm font-medium text-[#174051]">{apt.bedrooms}</p>
                <p className="text-[10px] text-[#4A7A8C] uppercase">Спальни</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                <Bath className="w-4 h-4 text-[#2d80a1] mx-auto mb-1" />
                <p className="text-sm font-medium text-[#174051]">{apt.bathrooms}</p>
                <p className="text-[10px] text-[#4A7A8C] uppercase">Ванные</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                <Users className="w-4 h-4 text-[#2d80a1] mx-auto mb-1" />
                <p className="text-sm font-medium text-[#174051]">{apt.guests.replace('до ', '')}</p>
                <p className="text-[10px] text-[#4A7A8C] uppercase">Гостей</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h2 className="font-serif text-base text-[#174051] mb-3">Об апартаментах</h2>
              <div className="text-[#4A7A8C] leading-relaxed text-sm space-y-3">
                {apt.description.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h2 className="font-serif text-base text-[#174051] mb-3">Удобства</h2>
              <div className="grid grid-cols-2 gap-2">
                {(apt.fullAmenities || []).map((amenity: any, idx: number) => {
                  const label = typeof amenity === 'string' ? amenity : amenity.title || ''
                  return (
                    <div key={label || idx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#2d80a1] flex-shrink-0" />
                      <span className="text-[#4A7A8C] text-sm font-semibold">{label}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* House Rules - Dynamic from Strapi */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h2 className="font-serif text-base text-[#174051] mb-3">Правила</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[10px] text-[#4A7A8C] uppercase mb-0.5">Заезд</p>
                  <p className="text-[#174051]">{'с '}{apt.rules?.checkIn || '14:00'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#4A7A8C] uppercase mb-0.5">Выезд</p>
                  <p className="text-[#174051]">{'до '}{apt.rules?.checkOut || '12:00'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#4A7A8C] uppercase mb-0.5">Курение</p>
                  <p className="text-[#174051] font-medium">{apt.rules?.smoking ? 'Разрешено' : 'Запрещено в номере'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#4A7A8C] uppercase mb-0.5">Животные</p>
                  <p className="text-[#174051]">{apt.rules?.pets ? 'Разрешено' : apt.rules?.description || 'По согласованию'}</p>
                </div>
              </div>
            </div>

            {/* Bonuses Block - Dynamic from Strapi */}
            {(apt.bonuses || []).map((bonus: any, idx: number) => (
              <div key={bonus.title || idx} className="bg-gradient-to-br from-[#f8f6f1] to-white rounded-lg p-4 shadow-sm border border-[#DFCC8C]/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
                  <svg viewBox="0 0 100 100" fill="currentColor" className="text-[#2d80a1] w-full h-full">
                    <path d="M50 5C25 5 5 25 5 50s20 45 45 45 45-20 45-45S75 5 50 5zm0 80c-19.3 0-35-15.7-35-35s15.7-35 35-35 35 15.7 35 35-15.7 35-35 35z"/>
                    <path d="M30 45c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5zm40 0c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5zm-20 25c11 0 20-6.7 20-15H30c0 8.3 9 15 20 15z"/>
                  </svg>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2d80a1]/10 flex items-center justify-center flex-shrink-0">
                    <Gift className="w-5 h-5 text-[#2d80a1]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-[#C4A76C] uppercase tracking-wider">{'Бонус'}</span>
                      {bonus.included && (
                        <span className="text-[10px] px-2 py-0.5 bg-[#2d80a1]/10 text-[#2d80a1] rounded-full font-medium">{'Включено'}</span>
                      )}
                    </div>
                    <h3 className="font-serif text-[#174051] text-sm mb-1">{bonus.title}</h3>
                    {bonus.description && (
                      <p className="text-xs text-[#4A7A8C] leading-relaxed">{bonus.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-4" ref={bookingRef}>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-4 border border-[#DFCC8C]/30">


              <div className="p-5 space-y-4">
                {/* Date Selection - Two fields like original design */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Check-in */}
                  <button
                    onClick={() => setShowCalendarModal(true)}
                    className="w-full text-left border border-gray-200 rounded-lg p-3 hover:border-[#2d80a1] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#2d80a1]" />
                      <div>
                        <div className="text-[10px] text-[#4A7A8C] uppercase tracking-wide">Дата заезда</div>
                        <div className="text-[#174051] font-medium text-sm">
                          {checkIn ? formatDate(checkIn) : 'Выберите дату'}
                        </div>
                      </div>
                    </div>
                  </button>
                  
                  {/* Check-out */}
                  <button
                    onClick={() => setShowCalendarModal(true)}
                    className="w-full text-left border border-gray-200 rounded-lg p-3 hover:border-[#2d80a1] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#2d80a1]" />
                      <div>
                        <div className="text-[10px] text-[#4A7A8C] uppercase tracking-wide">Дата выезда</div>
                        <div className="text-[#174051] font-medium text-sm">
                          {checkOut ? formatDate(checkOut) : 'Выберите дату'}
                        </div>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Guests Dropdown - Styled like main page */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowGuestsDropdown(!showGuestsDropdown)
                    }}
                    className="w-full text-left border border-gray-200 rounded-lg p-3 hover:border-[#2d80a1] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#2d80a1]" />
                        <div>
                          <div className="text-[10px] text-[#4A7A8C] uppercase tracking-wide">Гости</div>
                          <div className="text-[#174051] font-medium text-sm">
                            {totalGuests} {totalGuests === 1 ? 'гость' : totalGuests < 5 ? 'гостя' : 'гостей'}
                          </div>
                        </div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                  {showGuestsDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 z-50">
                      {/* Adults */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-[#174051] font-medium text-sm">Взрослые</span>
                          <p className="text-[10px] text-gray-400">от 18 лет</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setAdults(Math.max(1, adults - 1))}
                            disabled={adults <= 1}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all
                              ${adults <= 1 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-[#2d80a1] text-[#2d80a1] hover:bg-[#2d80a1] hover:text-white'}`}
                          >-</button>
                          <span className="w-5 text-center font-semibold text-[#174051]">{adults}</span>
                          <button
                            onClick={() => setAdults(Math.min(6, adults + 1))}
                            disabled={adults >= 6}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all
                              ${adults >= 6 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-[#2d80a1] text-[#2d80a1] hover:bg-[#2d80a1] hover:text-white'}`}
                          >+</button>
                        </div>
                      </div>
                      {/* Children */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[#174051] font-medium text-sm">Дети</span>
                          <p className="text-[10px] text-gray-400">до 17 лет</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setChildren(Math.max(0, children - 1))}
                            disabled={children <= 0}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all
                              ${children <= 0 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-[#2d80a1] text-[#2d80a1] hover:bg-[#2d80a1] hover:text-white'}`}
                          >-</button>
                          <span className="w-5 text-center font-semibold text-[#174051]">{children}</span>
                          <button
                            onClick={() => setChildren(Math.min(6, children + 1))}
                            disabled={children >= 6}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all
                              ${children >= 6 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-[#2d80a1] text-[#2d80a1] hover:bg-[#2d80a1] hover:text-white'}`}
                          >+</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Special Offers - All visible, active ones highlighted */}
                <div className="space-y-2">
                  <p className="text-[10px] text-[#4A7A8C] uppercase tracking-wide">Спецпредложения</p>
                  
                  {/* Newlyweds - Always available */}
                  <label className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                    isNewlyweds 
                      ? 'bg-pink-50 border-pink-300' 
                      : 'border-gray-200 hover:border-pink-300'
                  }`}>
                    <input
                      type="checkbox"
                      checked={isNewlyweds}
                      onChange={(e) => setIsNewlyweds(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                    />
                    <div className="flex-1">
                  <div className="flex items-center gap-2">
                      <Heart className={`w-3.5 h-3.5 ${isNewlyweds ? 'text-pink-500' : 'text-pink-400'}`} />
                      <span className={`text-sm font-medium ${isNewlyweds ? 'text-pink-700' : 'text-[#174051]'}`}>Молодожены / Девичник / День рождения</span>
                    </div>
                    <p className={`text-[10px] mt-0.5 ${isNewlyweds ? 'text-pink-600' : 'text-[#4A7A8C]'}`}>Шампанское и фрукты в подарок!</p>
                    </div>
                  </label>

                  {/* Долгосрочная аренда - иконка календаря */}
                  <div className={`flex items-start gap-3 p-3 border rounded-lg transition-all ${
                    isLongStay
                      ? 'bg-green-50 border-green-300'
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isLongStay ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'
                    }`}>
                      <CalendarDays className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <span className={`text-sm font-medium ${isLongStay ? 'text-green-700' : 'text-gray-400'}`}>Долгосрочная аренда</span>
                      <p className={`text-[10px] mt-0.5 ${isLongStay ? 'text-green-600' : 'text-gray-400'}`}>
                        {isLongStay
                          ? `Активна! Особые условия применены`
                          : `особые условия от 30 дней`}
                      </p>
                    </div>
                    {isLongStay && <Check className="w-5 h-5 text-green-500" />}
                  </div>

                  {/* Весеннее ПРОМО - иконка подарка */}
                  <div className={`flex items-start gap-3 p-3 border rounded-lg transition-all ${
                    isPromo && freeNights > 0 && !isLongStay
                      ? 'bg-amber-50 border-amber-300' 
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isPromo && freeNights > 0 && !isLongStay ? 'bg-amber-500 text-white' : 'bg-gray-300 text-gray-500'
                    }`}>
                      <Gift className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <span className={`text-sm font-medium ${isPromo && freeNights > 0 && !isLongStay ? 'text-amber-700' : 'text-gray-400'}`}>Весеннее ПРОМО!</span>
                      <p className={`text-[10px] mt-0.5 ${isPromo && freeNights > 0 && !isLongStay ? 'text-amber-600' : 'text-gray-400'}`}>
                        {isPromo && freeNights > 0 && !isLongStay
                          ? `-30% на проживание (${freeNights} ${freeNights === 1 ? 'ночь' : freeNights < 5 ? 'ночи' : 'ночей'} бесплатно!)`
                          : `-30% на проживание от 3 ночей`}
                      </p>
                    </div>
                    {isPromo && freeNights > 0 && !isLongStay && <Gift className="w-5 h-5 text-amber-500" />}
                  </div>

                  {/* Last Minute -35% */}
                  <div className={`flex items-start gap-3 p-3 border rounded-lg transition-all ${
                    isLastMinuteBooking && nights === 1
                      ? 'bg-red-50 border-red-300' 
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      isLastMinuteBooking && nights === 1 ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-500'
                    }`}>
                      -35%
                    </div>
                    <div className="flex-1">
                      <span className={`text-sm font-medium ${isLastMinuteBooking && nights === 1 ? 'text-red-700' : 'text-gray-400'}`}>Last Minute</span>
                      <p className={`text-[10px] mt-0.5 ${isLastMinuteBooking && nights === 1 ? 'text-red-600' : 'text-gray-400'}`}>
                        {isLastMinuteBooking && nights === 1
                          ? 'Активна! Максимальная скидка применена'
                          : 'Бронирование за 12 часов до заезда на 1 сутки'}
                      </p>
                    </div>
                    {isLastMinuteBooking && nights === 1 && <Clock className="w-5 h-5 text-red-500" />}
                  </div>
                </div>

                {/* Promo Code */}
                <div>
                  <label className="block text-[10px] text-[#4A7A8C] uppercase tracking-wide mb-1">Промокод</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                        promoCodeStatus === 'valid' ? 'text-green-500' : promoCodeStatus === 'invalid' ? 'text-red-400' : 'text-[#4A7A8C]'
                      }`} />
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value.toUpperCase())
                          if (promoCodeStatus !== 'idle') {
                            setPromoCodeStatus('idle')
                            setPromoCodeDiscount(0)
                            setPromoCodeMessage('')
                          }
                        }}
                        placeholder="Введите промокод"
                        className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 uppercase ${
                          promoCodeStatus === 'valid' 
                            ? 'border-green-300 bg-green-50 focus:ring-green-200 focus:border-green-400' 
                            : promoCodeStatus === 'invalid'
                            ? 'border-red-300 bg-red-50 focus:ring-red-200 focus:border-red-400'
                            : 'border-gray-200 focus:ring-[#2d80a1]/20 focus:border-[#2d80a1]'
                        }`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!promoCode.trim()) return
                        setPromoCodeStatus('checking')
                        try {
                          const response = await fetch('/api/promo-code', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                              code: promoCode.trim(),
                              apartmentId: apt.id,
                              checkIn: checkIn ? formatDateForAPI(checkIn) : null,
                              checkOut: checkOut ? formatDateForAPI(checkOut) : null,
                              totalPrice: finalPrice
                            })
                          })
                          const data = await response.json()
                          if (data.valid) {
                            setPromoCodeStatus('valid')
                            setPromoCodeDiscount(data.discount || 0)
                            setPromoCodeMessage(data.message || 'Промокод применен!')
                          } else {
                            setPromoCodeStatus('invalid')
                            setPromoCodeMessage(data.message || 'Промокод недействителен')
                          }
                        } catch (error) {
                          setPromoCodeStatus('invalid')
                          setPromoCodeMessage('Ошибка проверки промокода')
                        }
                      }}
                      disabled={!promoCode.trim() || promoCodeStatus === 'checking'}
                      className="px-4 py-2.5 bg-[#2d80a1] text-white text-sm font-medium rounded-lg hover:bg-[#236580] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {promoCodeStatus === 'checking' ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        'Применить'
                      )}
                    </button>
                  </div>
                  {promoCodeMessage && (
                    <p className={`text-xs mt-1.5 ${promoCodeStatus === 'valid' ? 'text-green-600' : 'text-red-500'}`}>
                      {promoCodeStatus === 'valid' && <Check className="inline w-3 h-3 mr-1" />}
                      {promoCodeMessage}
                    </p>
                  )}
                </div>

                {/* Price Summary - показываем только после подтверждения доступности от Shelter */}
                {nights > 0 && availabilityChecked && isAvailable && (
                  <div className="bg-[#f8f6f3] rounded-lg p-3 space-y-2">
                    {/* Для "3-я ночь в подарок" показываем разбивку */}
                    {showThirdNightFreeBreakdown && freeNights > 0 ? (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#4A7A8C]">
                            {pricePerNight.toLocaleString('ru-RU')} ₽ x {nights - freeNights} {(nights - freeNights) === 1 ? 'ночь' : (nights - freeNights) < 5 ? 'ночи' : 'ночей'}
                          </span>
                          <span className="text-[#174051]">{basePrice.toLocaleString('ru-RU')} ₽</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-green-600">
                            {freeNights} {freeNights === 1 ? 'ночь' : freeNights < 5 ? 'ночи' : 'ночей'} в подарок
                          </span>
                          <span className="text-green-600">0 ₽</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between text-sm">
                        <span className="text-[#4A7A8C]">{pricePerNight.toLocaleString('ru-RU')} ₽ x {nights} {nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'}</span>
                        <span className="text-[#174051]">{basePrice.toLocaleString('ru-RU')} ₽</span>
                      </div>
                    )}
                    {discount > 0 && !showThirdNightFreeBreakdown && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">{discountLabel}</span>
                        <span className="text-green-600">-{discount.toLocaleString('ru-RU')} ₽</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold pt-2 border-t border-gray-200">
                      <span className="text-[#174051]">Итого</span>
                      <span className="text-[#174051]">{(showThirdNightFreeBreakdown ? basePrice : basePrice - discount).toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <button 
                  onClick={async () => {
                    if (!checkIn || !checkOut) {
                      setBookingError('Пожалуйста, выберите даты заезда и выезда')
                      return
                    }
                    
                    // Check availability first
                    const available = await checkRoomAvailability()
                    
                    if (available) {
                      setShowBookingModal(true)
                      setBookingStep('guest')
                      setBookingError('')
                      setBookingSuccess(false)
                    }
                  }}
                  disabled={isCheckingAvailability}
                  className="w-full bg-[#2d80a1] hover:bg-[#226079] disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                >
                  {isCheckingAvailability ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Проверка доступности...
                    </>
                  ) : (
                    'Забронировать'
                  )}
                </button>
                
                {bookingError && !showBookingModal && (
                  <p className="text-center text-xs text-red-500 mt-2">{bookingError}</p>
                )}
                
                {availabilityChecked && !isAvailable && !showBookingModal && (
                  <p className="text-center text-xs text-amber-600 mt-2">Номер недоступен на выбранные даты. Попробуйте другие даты.</p>
                )}

                <p className="text-center text-xs text-[#4A7A8C]">Бесплатная отмена за 30 дней до заезда</p>

                {/* Contact */}
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs text-[#4A7A8C] mb-2">Нужна помощь?</p>
                  <div className="space-y-2">
                    <a href="tel:+79789651180" className="flex items-center gap-2 text-[#174051] hover:text-[#2d80a1] transition-colors">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">+7 978 965-11-80</span>
                    </a>
                    <a href="mailto:booking@atlas-krym.ru" className="flex items-center gap-2 text-[#174051] hover:text-[#2d80a1] transition-colors">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">booking@atlas-krym.ru</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Apartments - Compact */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-[#174051]">Другие апартаменты</h2>
            <Link 
              href="/#apartments" 
              className="text-[#2d80a1] hover:text-[#226079] text-sm transition-colors"
            >
              Смотреть все
            </Link>
          </div>
          
          {/* Search by dates hint */}
          <div className="bg-gradient-to-r from-[#2d80a1]/5 to-[#D4B896]/10 border border-[#2d80a1]/20 rounded-xl p-4 mb-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-[#2d80a1]/10 rounded-full flex items-center justify-center">
                  <Search className="w-5 h-5 text-[#2d80a1]" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#174051] font-medium">
                  Не нашли свободные даты?
                </p>
                <p className="text-xs text-[#4A7A8C] mt-0.5">
                  Найдите доступные апартаменты на ваши даты
                </p>
              </div>
              <Link
                href="/#hero"
                className="inline-flex items-center gap-2 bg-[#2d80a1] hover:bg-[#226079] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              >
                <Calendar className="w-4 h-4" />
                Поиск по датам
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {otherApartments.map((other) => (
              <Link
                key={other.id}
                href={`/apartments/${other.id}`}
                className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={other.image || "/placeholder.svg"}
                    alt={other.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 text-[#174051] px-2 py-0.5 rounded-full text-[10px] font-medium">
                    {other.price.toLocaleString('ru-RU')} ₽
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-serif text-sm text-[#174051] group-hover:text-[#2d80a1] transition-colors">{other.name}</h3>
                  <p className="text-[10px] text-[#4A7A8C]">{other.rooms}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA - Compact */}
      <div className="bg-[#174051] py-8">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-xl text-white mb-2">Готовы забронировать?</h2>
          <p className="text-white/70 mb-4 text-xs max-w-md mx-auto">
            Свяжитесь с нами для персонального предложения
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <a 
              href="tel:+79789651180" 
              className="inline-flex items-center justify-center gap-2 bg-[#D4B896] hover:bg-[#c4a886] text-[#174051] font-medium px-5 py-2 rounded text-sm transition-colors"
            >
              <Phone className="w-4 h-4" />
              Позвонить
            </a>
            <a 
              href="https://t.me/LubovAtlas" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-5 py-2 rounded text-sm transition-colors"
            >
              Telegram
            </a>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close Button */}
          <button 
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 transition-colors z-10"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 text-white/70 text-sm">
            {lightboxIndex + 1} / {apt.image.length}
          </div>

          {/* Main Image with Swipe */}
          <div 
            className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center touch-pan-y"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={() => {
              if (!touchStart || !touchEnd) return
              const distance = touchStart - touchEnd
              const isLeftSwipe = distance > minSwipeDistance
              const isRightSwipe = distance < -minSwipeDistance
              if (isLeftSwipe) {
                setLightboxIndex((prev) => prev === apt.image.length - 1 ? 0 : prev + 1)
              } else if (isRightSwipe) {
                setLightboxIndex((prev) => prev === 0 ? apt.image.length - 1 : prev - 1)
              }
            }}
          >
            <img
              src={apt.image[lightboxIndex] || "/placeholder.svg"}
              alt={`${apt.name} - фото ${lightboxIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg select-none pointer-events-none"
              draggable={false}
            />
          </div>

          {/* Navigation Arrows */}
          {apt.image.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => prev === 0 ? apt.image.length - 1 : prev - 1);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => prev === apt.image.length - 1 ? 0 : prev + 1);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Thumbnail Strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto px-4 py-2">
            {apt.image.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(idx);
                }}
                className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden transition-all ${
                  lightboxIndex === idx 
                    ? 'ring-2 ring-white opacity-100' 
                    : 'opacity-50 hover:opacity-80'
                }`}
              >
                <img
                  src={img || "/placeholder.svg"}
                  alt={`Миниатюра ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
<div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-8 pb-8 px-4 overflow-y-auto">
  <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl relative">
            {/* Close button */}
            <button 
              onClick={() => {
                setShowBookingModal(false)
                setBookingError('')
                setBookingStep('guest')
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {bookingStep === 'success' ? (
              /* Success State */
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-[#174051] mb-2">Бронирование подтверждено!</h3>
                <p className="text-[#4A7A8C] mb-6">
                  Ваше бронирование апартаментов "{apt.name}" успешно создано.
                  {orderConfirmation?.confirmationNumber && (
                    <> Номер подтверждения: <strong>{orderConfirmation.confirmationNumber}</strong></>
                  )}
                </p>
                <div className="bg-[#f8f6f3] rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
                  <p className="text-sm text-[#4A7A8C] mb-1">Детали бронирования:</p>
                  <p className="text-sm text-[#174051]">{formatDate(checkIn)} — {formatDate(checkOut)}</p>
                  <p className="text-sm text-[#174051]">{nights} {nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'}, {totalGuests} {totalGuests === 1 ? 'гость' : totalGuests < 5 ? 'гостя' : 'гостей'}</p>
                  <p className="text-sm font-semibold text-[#174051] mt-2">Итого: {finalPrice.toLocaleString('ru-RU')} ₽</p>
                </div>
                <button
                  onClick={() => {
                    setShowBookingModal(false)
                    setBookingSuccess(false)
                    setBookingStep('guest')
                    setGuestName('')
                    setGuestLastName('')
                    setGuestPhone('')
                    setGuestEmail('')
                    setBookingComment('')
                    setOrderConfirmation(null)
                  }}
                  className="bg-[#2d80a1] hover:bg-[#226079] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Закрыть
                </button>
              </div>
            ) : (
              /* Multi-step Form */
              <div className="flex flex-col lg:flex-row">
                {/* Left side - Form */}
                <div className="flex-1 p-6 lg:border-r border-gray-100">
                  <form onSubmit={handleBookingSubmit}>
                    {/* Step indicator - 2 steps */}
                    <div className="flex items-center gap-2 mb-6">
                      <div className={`flex items-center gap-1.5 ${bookingStep === 'guest' ? 'text-[#2d80a1]' : 'text-green-600'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${bookingStep === 'guest' ? 'bg-[#2d80a1] text-white' : 'bg-green-100 text-green-600'}`}>
                          {bookingStep !== 'guest' ? '✓' : '1'}
                        </div>
                        <span className="text-xs font-medium hidden sm:inline">Данные</span>
                      </div>
                      <div className="w-6 h-px bg-gray-200" />
                      <div className={`flex items-center gap-1.5 ${bookingStep === 'prepay' ? 'text-[#2d80a1]' : 'text-gray-400'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${bookingStep === 'prepay' ? 'bg-[#2d80a1] text-white' : 'bg-gray-200 text-gray-500'}`}>
                          2
                        </div>
                        <span className="text-xs font-medium hidden sm:inline">Оплата</span>
                      </div>
                    </div>

                    {bookingStep === 'guest' && (
                      <>
                        <div className="flex items-center gap-2 mb-4">
                          <svg className="w-5 h-5 text-[#4A7A8C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <h3 className="text-lg font-semibold text-[#174051]">Контактные данные гостя</h3>
                        </div>
                        <p className="text-sm text-[#4A7A8C] mb-6">Пожалуйста, заполните все поля</p>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-[#174051] mb-1">
                              Фамилия <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={guestLastName}
                              onChange={(e) => setGuestLastName(e.target.value)}
                              placeholder="Иванов"
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d80a1]/20 focus:border-[#2d80a1]"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#174051] mb-1">
                              Имя <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={guestName}
                              onChange={(e) => setGuestName(e.target.value)}
                              placeholder="Иван"
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d80a1]/20 focus:border-[#2d80a1]"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#174051] mb-1">
                              Телефон для связи <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="tel"
                              value={guestPhone}
                              onChange={(e) => setGuestPhone(e.target.value)}
                              placeholder="+7 978 000 00 00"
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d80a1]/20 focus:border-[#2d80a1]"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#174051] mb-1">
                              Электронная почта <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              value={guestEmail}
                              onChange={(e) => setGuestEmail(e.target.value)}
                              placeholder="email@example.com"
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d80a1]/20 focus:border-[#2d80a1]"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#174051] mb-1">
                              Страна
                            </label>
                            <select
                              value={guestCountry}
                              onChange={(e) => setGuestCountry(e.target.value)}
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d80a1]/20 focus:border-[#2d80a1] bg-white"
                            >
                              <option value="Россия">Россия</option>
                              <option value="Беларусь">Беларусь</option>
                              <option value="Казахстан">Казахстан</option>
                              <option value="Украина">Украина</option>
                              <option value="Другая">Другая</option>
                            </select>
                          </div>

                          <div className="pt-4 border-t border-gray-100">
                            <h4 className="text-sm font-semibold text-[#174051] mb-3">Информация о заезде</h4>
                            <div>
                              <label className="block text-sm font-medium text-[#174051] mb-1">
                                Время заезда
                              </label>
                              <select
                                value={arrivalTime}
                                onChange={(e) => setArrivalTime(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d80a1]/20 focus:border-[#2d80a1] bg-white"
                              >
                                <option value="">Неизвестно</option>
                                <option value="12:00">12:00</option>
                                <option value="13:00">13:00</option>
                                <option value="14:00">14:00 (стандартное)</option>
                                <option value="15:00">15:00</option>
                                <option value="16:00">16:00</option>
                                <option value="17:00">17:00</option>
                                <option value="18:00">18:00</option>
                                <option value="19:00">19:00</option>
                                <option value="20:00">20:00</option>
                                <option value="21:00">21:00+</option>
                              </select>
                              <p className="text-xs text-[#4A7A8C] mt-1">Ваш номер будет готов к 14:00</p>
                            </div>
                          </div>

                          <div>
                            <button 
                              type="button"
                              onClick={() => setBookingComment(bookingComment ? '' : ' ')}
                              className="flex items-center gap-2 text-sm text-[#2d80a1] hover:text-[#226079]"
                            >
                              <svg className={`w-4 h-4 transition-transform ${bookingComment ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                              Ваши пожелания
                            </button>
                            {bookingComment !== '' && (
                              <textarea
                                value={bookingComment}
                                onChange={(e) => setBookingComment(e.target.value)}
                                placeholder="Особые пожелания к бронированию..."
                                rows={3}
                                className="w-full mt-2 px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d80a1]/20 focus:border-[#2d80a1] resize-none"
                              />
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Step 2: Prepayment - Redesigned like Booking.com/Airbnb */}
                    {bookingStep === 'prepay' && (
                      <>
                        {/* Header */}
                        <div className="mb-6">
                          <h3 className="text-xl font-semibold text-[#174051] mb-1">Подтвердите и оплатите</h3>
                          <p className="text-sm text-[#4A7A8C]">
                            Осталось всего несколько шагов до вашего идеального отдыха
                          </p>
                        </div>

                        {/* Booking Summary Card */}
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-5">
                          {/* Property mini-card */}
                          <div className="flex gap-4 p-4 border-b border-gray-100">
                            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                              <img 
                                src={Array.isArray(apt.image) ? apt.image[0] : apt.image} 
                                alt={apt.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-[#174051] text-sm truncate">{apt.name}</h4>
                              <p className="text-xs text-[#4A7A8C] mt-0.5">{apt.size} · {apt.rooms}</p>
                              <div className="flex items-center gap-1 mt-2">
                                <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-xs font-medium text-[#174051]">Судак, Крым</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Dates */}
                          <div className="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100">
                            <div className="p-3 text-center">
                              <p className="text-[10px] uppercase tracking-wide text-[#4A7A8C] mb-0.5">Заезд</p>
                              <p className="text-sm font-semibold text-[#174051]">{formatDate(checkIn)}</p>
                              <p className="text-[10px] text-[#4A7A8C]">с 14:00</p>
                            </div>
                            <div className="p-3 text-center">
                              <p className="text-[10px] uppercase tracking-wide text-[#4A7A8C] mb-0.5">Выезд</p>
                              <p className="text-sm font-semibold text-[#174051]">{formatDate(checkOut)}</p>
                              <p className="text-[10px] text-[#4A7A8C]">до 12:00</p>
                            </div>
                          </div>

                          {/* Guest info row */}
                          <div className="flex items-center justify-between p-3 bg-gray-50">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-[#2d80a1]/10 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-[#2d80a1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-[#174051]">{guestLastName} {guestName}</p>
                                <p className="text-xs text-[#4A7A8C]">{guestEmail}</p>
                              </div>
                            </div>
                            <button 
                              type="button"
                              onClick={() => setBookingStep('guest')}
                              className="text-[#2d80a1] text-xs font-medium hover:underline"
                            >
                              Изменить
                            </button>
                          </div>
                        </div>

                        {/* Price Details */}
                        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5">
                          <h4 className="font-semibold text-[#174051] mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            Детали оплаты
                          </h4>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-[#4A7A8C]">Проживание ({nights} {nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'})</span>
                              <span className="text-[#174051]">{finalPrice.toLocaleString('ru-RU')} ₽</span>
                            </div>
                          </div>

                          <div className="border-t border-gray-100 mt-3 pt-3">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-[#174051]">Итого</span>
                              <span className="font-bold text-lg text-[#174051]">{finalPrice.toLocaleString('ru-RU')} ₽</span>
                            </div>
                          </div>

                          {/* Prepayment highlight */}
                          {prepaymentPercent > 0 && (
                            <div className="bg-[#2d80a1]/5 border border-[#2d80a1]/20 rounded-lg p-3 mt-3">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-sm font-semibold text-[#2d80a1]">К оплате сейчас</p>
                                  <p className="text-xs text-[#4A7A8C]">Предоплата {prepaymentPercent}%</p>
                                </div>
                                <span className="text-xl font-bold text-[#2d80a1]">
                                  {Math.ceil(finalPrice * prepaymentPercent / 100).toLocaleString('ru-RU')} ₽
                                </span>
                              </div>
                              <p className="text-xs text-[#4A7A8C] mt-2">
                                Остаток {(finalPrice - Math.ceil(finalPrice * prepaymentPercent / 100)).toLocaleString('ru-RU')} ₽ оплачивается при заселении
                              </p>
                            </div>
                          )}
                          
                          {/* If no prepayment required */}
                          {prepaymentPercent === 0 && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                              <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                  <p className="text-sm font-semibold text-green-700">Предоплата не требуется</p>
                                  <p className="text-xs text-green-600">Оплата полностью при заселении</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Payment Methods */}
                        <div className="mb-5">
                          <h4 className="text-sm font-medium text-[#174051] mb-3">Способы оплаты</h4>
                          <div className="flex items-center gap-2">
                            <div className="h-8 px-2 bg-white border border-gray-200 rounded flex items-center justify-center">
                              <svg className="h-5" viewBox="0 0 48 32" fill="none">
                                <rect width="48" height="32" rx="4" fill="#1A1F71"/>
                                <path d="M18.5 21.5L20.5 10.5H23.5L21.5 21.5H18.5Z" fill="white"/>
                                <path d="M31.5 10.7C30.9 10.5 29.9 10.2 28.7 10.2C25.7 10.2 23.6 11.7 23.6 13.9C23.6 15.5 25.1 16.4 26.2 16.9C27.4 17.5 27.8 17.9 27.8 18.4C27.8 19.2 26.8 19.5 25.9 19.5C24.6 19.5 23.9 19.3 22.8 18.9L22.4 18.7L22 21.2C22.8 21.5 24.2 21.8 25.7 21.8C28.9 21.8 30.9 20.3 30.9 18C30.9 16.7 30.1 15.7 28.4 14.9C27.4 14.4 26.8 14.1 26.8 13.5C26.8 13 27.4 12.4 28.6 12.4C29.6 12.4 30.4 12.6 30.9 12.8L31.2 12.9L31.5 10.7Z" fill="white"/>
                                <path d="M35.2 10.5H37.6L40 21.5H37.2L36.8 19.7H33.1L32.4 21.5H29.2L33.6 11.2C33.9 10.7 34.4 10.5 35.2 10.5ZM34 17.5H36.3L35.3 13.1L34 17.5Z" fill="white"/>
                                <path d="M16.5 10.5L13.6 18L13.3 16.6C12.7 14.8 11 12.8 9 11.8L11.7 21.5H15L19.8 10.5H16.5Z" fill="white"/>
                                <path d="M11.5 10.5H6.5L6.4 10.8C10.1 11.7 12.6 14 13.3 16.6L12.5 11.2C12.4 10.7 11.9 10.5 11.5 10.5Z" fill="#F9A533"/>
                              </svg>
                            </div>
                            <div className="h-8 px-2 bg-white border border-gray-200 rounded flex items-center justify-center">
                              <svg className="h-5" viewBox="0 0 48 32" fill="none">
                                <rect width="48" height="32" rx="4" fill="#F7F7F7"/>
                                <circle cx="18" cy="16" r="8" fill="#EB001B"/>
                                <circle cx="30" cy="16" r="8" fill="#F79E1B"/>
                                <path d="M24 10.3C25.9 11.7 27 14.1 27 16.7C27 19.3 25.9 21.7 24 23.1C22.1 21.7 21 19.3 21 16.7C21 14.1 22.1 11.7 24 10.3Z" fill="#FF5F00"/>
                              </svg>
                            </div>
                            <div className="h-8 px-3 bg-white border border-gray-200 rounded flex items-center justify-center">
                              <span className="text-xs font-medium text-[#174051]">МИР</span>
                            </div>
                            <div className="h-8 px-3 bg-white border border-gray-200 rounded flex items-center justify-center">
                              <span className="text-xs font-medium text-[#174051]">СБП</span>
                            </div>
                          </div>
                        </div>

                        {/* Security badges */}
                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg mb-4">
                          <div className="flex items-center gap-1.5 text-xs text-[#4A7A8C]">
                            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            SSL защита
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-[#4A7A8C]">
                            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Безопасная оплата
                          </div>
                        </div>
                      </>
                    )}



                    {bookingError && (
                      <p className="text-red-500 text-sm mt-4">{bookingError}</p>
                    )}

                    <div className="mt-6 pt-4 border-t border-gray-100">
                      {/* Back button for step 2 */}
                      {bookingStep === 'prepay' && (
                        <button
                          type="button"
                          onClick={() => setBookingStep('guest')}
                          className="text-[#4A7A8C] hover:text-[#174051] text-sm mb-4 flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          Назад
                        </button>
                      )}
                      
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full font-semibold px-8 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                          bookingStep === 'prepay' 
                            ? 'bg-[#2d80a1] hover:bg-[#226079] text-white' 
                            : 'bg-[#e6a843] hover:bg-[#d49a3a] text-white'
                        } disabled:bg-gray-400`}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Оформление...
                          </>
                        ) : bookingStep === 'guest' ? (
                          'Продолжить к оплате'
                        ) : (
                          prepaymentPercent > 0 ? (
                            <>
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                              </svg>
                              Оплатить {Math.ceil(finalPrice * prepaymentPercent / 100).toLocaleString('ru-RU')} ₽
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Подтвердить бронирование
                            </>
                          )
                        )}
                      </button>
                      
                      {bookingStep === 'guest' && (
                        <p className="text-xs text-[#4A7A8C] mt-2 text-center">Следующий шаг: Оплата предоплаты</p>
                      )}
                      {bookingStep === 'prepay' && prepaymentPercent > 0 && (
                        <p className="text-xs text-[#4A7A8C] mt-3 text-center flex items-center justify-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Защищенное соединение · Данные карты не сохраняются
                        </p>
                      )}
                      {bookingStep === 'prepay' && prepaymentPercent === 0 && (
                        <p className="text-xs text-[#4A7A8C] mt-3 text-center">
                          Подтверждение будет отправлено на вашу почту
                        </p>
                      )}
                    </div>
                  </form>
                </div>

                {/* Right side - Summary */}
                <div className="lg:w-80 p-6 bg-[#f8f6f3] rounded-b-2xl lg:rounded-r-2xl lg:rounded-bl-none">
                  <h4 className="font-semibold text-[#174051] mb-4">{apt.name}</h4>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#4A7A8C]">Заезд с 14:00</span>
                      <span className="text-[#174051] font-medium">{formatDate(checkIn)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#4A7A8C]">Выезд до 12:00</span>
                      <span className="text-[#174051] font-medium">{formatDate(checkOut)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#4A7A8C]">Гости</span>
                      <span className="text-[#174051]">{adults} взр.{children > 0 ? `, ${children} дет.` : ''}</span>
                    </div>
                  </div>

                  {(
                    <div className="border-t border-gray-200 mt-4 pt-4">
                      <h5 className="font-semibold text-[#174051] mb-3">Стоимость</h5>
                      <div className="space-y-2 text-sm">
                        {/* Для "3-я ночь в подарок" показываем разбивку */}
                        {showThirdNightFreeBreakdown && freeNights > 0 ? (
                          <>
                            <div className="flex justify-between">
                              <span className="text-[#4A7A8C]">
                                {pricePerNight.toLocaleString('ru-RU')} ₽ x {nights - freeNights} {(nights - freeNights) === 1 ? 'ночь' : (nights - freeNights) < 5 ? 'ночи' : 'ночей'}
                              </span>
                              <span className="text-[#174051]">{basePrice.toLocaleString('ru-RU')} ₽</span>
                            </div>
                            <div className="flex justify-between text-green-600">
                              <span>{freeNights} {freeNights === 1 ? 'ночь' : freeNights < 5 ? 'ночи' : 'ночей'} в подарок</span>
                              <span>0 ₽</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex justify-between">
                            <span className="text-[#4A7A8C]">{pricePerNight.toLocaleString('ru-RU')} ₽ x {nights} {nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'}</span>
                            <span className="text-[#174051]">{basePrice.toLocaleString('ru-RU')} ₽</span>
                          </div>
                        )}
                        {discount > 0 && !showThirdNightFreeBreakdown && (
                          <div className="flex justify-between text-green-600">
                            <span>{discountLabel}</span>
                            <span>-{discount.toLocaleString('ru-RU')} ₽</span>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between font-semibold text-lg mt-3 pt-3 border-t border-gray-200">
                        <span className="text-[#174051]">К оплате</span>
                        <span className="text-[#174051]">{(showThirdNightFreeBreakdown ? basePrice : basePrice - discount).toLocaleString('ru-RU')} ₽</span>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-[#4A7A8C] mt-4">
                    Оплата производится в отеле при заезде. Возможна оплата картой или наличными.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Calendar Modal for date selection */}
      <BookingCalendarModal
        isOpen={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        apartmentId={apt.id}
        onSelectDates={(checkInDate, checkOutDate) => {
          setCheckIn(checkInDate)
          setCheckOut(checkOutDate)
        }}
      />
    </main>
  )
}
