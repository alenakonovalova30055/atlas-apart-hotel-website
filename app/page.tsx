'use client';

import React from "react"
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { ExpandableApartments } from '@/components/expandable-apartments'
import { FeatureImageCard } from '@/components/feature-image-card'
import { AttractionCard } from '@/components/attraction-card'
import { BookingSearch } from '@/components/booking-search'
import { HeroSlideshow } from '@/components/hero-slideshow'
import { GalleryCarousel } from '@/components/gallery-carousel'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { scrollToTop } from '@/lib/scroll-to-top'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center">
        <HeroSlideshow />
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <p className="text-[#D4B896] text-sm md:text-base tracking-[0.3em] mb-6 font-medium drop-shadow-lg">
            СУДАК · КРЫМ · ЧЁРНОЕ МОРЕ
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-4 drop-shadow-xl" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
            Atlas
          </h1>
          <h2 className="font-serif text-3xl md:text-5xl text-[#D4B896] mb-8 drop-shadow-lg" style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.4)' }}>
            Apart Hotel & Spa
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed text-balance drop-shadow-md text-white/95" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}>
            Откройте для себя идеальное место для отдыха на берегу Чёрного моря. 
            Панорамные виды, роскошные апартаменты и безупречный сервис в сердце солнечного Крыма.
          </p>
          {/* Booking Search Bar */}
          <div className="relative z-20 w-full px-4">
            <BookingSearch />
          </div>
        </div>
      </section>

      {/* Hotel Description Section - Compact */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-start pt-12">
            {/* Text Description - More Compact */}
            <div className="lg:w-1/4">
              <h2 className="font-serif text-3xl font-light text-[#174051] mb-2 tracking-wide">
                Atlas Apart
              </h2>
              <h2 className="font-serif text-3xl font-light text-[#174051] mb-1 tracking-wide">
                Hotel & Spa
              </h2>
              <div className="w-16 h-0.5 bg-[#2d80a1] mb-4"></div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Уникальный комплекс в Крыму на первой линии у моря с открытым подогреваемым бассейном, закрытой аквазоной с гидромассажем, персональным менеджером 24/7, детскими площадками, собственным пляжем в 50 метрах и рестораном "Белое солнце" с живой музыкой каждый вечер.
              </p>
            </div>
            
            {/* Mobile: Single full-width carousel */}
            <div className="lg:hidden w-full">
              <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-md">
                <GalleryCarousel includeMainPhoto={true} />
              </div>
            </div>

            {/* Desktop: Two vertical photos side by side */}
            <div className="hidden lg:flex lg:w-3/4 gap-4 h-[468px]">
              {/* Main photo - boy lounging (vertical) */}
              <div className="w-1/2 rounded-xl overflow-hidden shadow-md">
                <img 
                  src="/gallery/lounging-pool.jpg" 
                  alt="Отдых у бассейна" 
                  className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300" 
                />
              </div>
              
              {/* Carousel with other photos (vertical) */}
              <div className="w-1/2 rounded-xl overflow-hidden shadow-md">
                <GalleryCarousel />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Apartments */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-xs text-muted-foreground uppercase tracking-[0.25em] mb-4">Размещение</p>
            <h2 className="font-sans text-lg md:text-xl font-medium mb-3 text-balance">
              Забронировать проживание онлайн
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              Наши идеальные апартаменты — от уютных студий до роскошных пентхаусов с видом на море
            </p>
          </div>

          {/* Apartment Cards */}
          <ExpandableApartments />
        </div>
      </section>

      {/* Features Section - Bento Grid Design */}
      <section className="py-24 bg-[#f8f6f3]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16">
            <div>
              <p className="text-xs text-[#2d80a1] uppercase tracking-[0.3em] mb-4 font-medium">Инфраструктура</p>
              <h2 className="font-serif text-3xl md:text-4xl text-[#174051] font-light max-w-xl leading-tight">
                Все для идеального отдыха в одном месте
              </h2>
            </div>
            <p className="text-[#4A7A8C] max-w-md mt-6 lg:mt-0 text-sm leading-relaxed">
              Современный комплекс с продуманной инфраструктурой для отдыха всей семьи на берегу Черного моря
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-12 gap-4 auto-rows-[200px]">
            {/* Large Pool Card - spans 8 columns, 2 rows */}
            <Link href="/amenities/pool" className="col-span-12 lg:col-span-8 row-span-2 group relative overflow-hidden rounded-2xl cursor-pointer">
              <img 
                src="/amenities/outdoor-pool.jpg" 
                alt="Открытый бассейн"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                    </svg>
                  </div>
                  <span className="text-white/70 text-sm tracking-wide">Открытый бассейн</span>
                </div>
                <h3 className="font-serif text-3xl text-white mb-2">Подогреваемый бассейн</h3>
                <p className="text-white/80 text-sm max-w-md leading-relaxed">
                  Просторный бассейн с подогревом воды, шезлонгами и панорамным видом на горы. Работает круглый год.
                </p>
              </div>
            </Link>

            {/* Aqua Zone - spans 4 columns, 1 row */}
            <Link href="/amenities/aqua-zone" className="col-span-12 sm:col-span-6 lg:col-span-4 row-span-1 group relative overflow-hidden rounded-2xl cursor-pointer">
              <img 
                src="/amenities/aqua-zone.jpg" 
                alt="Аквазона"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="text-[#D4B896] text-xs tracking-wider uppercase mb-1 block">Круглый год</span>
                <h3 className="font-serif text-xl text-white">Крытая аквазона</h3>
              </div>
            </Link>

            {/* Restaurant - spans 4 columns, 1 row */}
            <Link href="/amenities/restaurant" className="col-span-12 sm:col-span-6 lg:col-span-4 row-span-1 group relative overflow-hidden rounded-2xl cursor-pointer">
              <img 
                src="/amenities/restaurant.jpg" 
                alt="Ресторан Белое Солнце"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="text-[#D4B896] text-xs tracking-wider uppercase mb-1 block">Высокая кухня</span>
                <h3 className="font-serif text-xl text-white">Ресторан Белое Солнце</h3>
              </div>
            </Link>

            {/* Kids Club - spans 4 columns, 1 row */}
            <Link href="/amenities/kids-club" className="col-span-12 sm:col-span-6 lg:col-span-4 row-span-1 group relative overflow-hidden rounded-2xl cursor-pointer">
              <img 
                src="/amenities/kids-club.jpg" 
                alt="Детский клуб"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="text-[#D4B896] text-xs tracking-wider uppercase mb-1 block">Для детей 3-12 лет</span>
                <h3 className="font-serif text-xl text-white">Детский клуб Остров Сокровищ</h3>
              </div>
            </Link>

            {/* SPA Center - spans 4 columns, 1 row */}
            <Link href="/amenities/spa" className="col-span-12 sm:col-span-6 lg:col-span-4 row-span-1 group relative overflow-hidden rounded-2xl cursor-pointer">
              <img 
                src="/features/spa.jpg" 
                alt="SPA-центр"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="text-[#D4B896] text-xs tracking-wider uppercase mb-1 block">Сауна и хамам</span>
                <h3 className="font-serif text-xl text-white">SPA-центр</h3>
              </div>
            </Link>

            {/* Beach 50m - spans 4 columns, 1 row */}
            <Link href="/amenities/beach" className="col-span-12 sm:col-span-6 lg:col-span-4 row-span-1 group relative overflow-hidden rounded-2xl cursor-pointer">
              <img 
                src="/amenities/beach.jpg" 
                alt="50 метров до моря"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="text-[#D4B896] text-xs tracking-wider uppercase mb-1 block">Собственный пляж</span>
                <h3 className="font-serif text-xl text-white">50 метров до моря</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
            <div>
              <p className="text-xs text-[#2d80a1] uppercase tracking-[0.3em] mb-4 font-medium">Выгодные предложения</p>
              <h2 className="font-serif text-3xl md:text-4xl text-[#174051] font-light max-w-xl leading-tight">
                Специальные акции
              </h2>
            </div>
            <p className="text-[#4A7A8C] max-w-md mt-6 md:mt-0 text-sm leading-relaxed">
              Воспользуйтесь нашими специальными предложениями и сделайте отдых еще выгоднее
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Early Booking */}
            <div className="group bg-[#f8f6f3] rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-transparent hover:border-[#D4B896]/30">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-[#D4B896] text-white text-xl font-bold px-3 py-1.5 rounded-lg">
                  -20%
                </div>
                <span className="text-xs text-[#2d80a1] bg-white px-3 py-1 rounded-full font-medium">До 1 марта 2026</span>
              </div>
              <h3 className="font-serif text-xl text-[#174051] mb-2">Раннее бронирование</h3>
              <p className="text-[#4A7A8C] text-sm leading-relaxed mb-6">
                До 1 марта 2026 года бронируйте по ценам прошлого года
              </p>
              <div className="flex gap-3">
                <a href="/apartments" className="flex-1 text-center bg-[#D4B896] hover:bg-[#c4a886] text-[#174051] text-sm font-medium py-2.5 px-4 rounded-lg transition-colors">
                  Выбрать апартаменты
                </a>
              </div>
            </div>

            {/* Long-term Rental */}
            <div className="group bg-[#f8f6f3] rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-transparent hover:border-[#D4B896]/30">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-[#D4B896] text-white text-xl font-bold px-3 py-1.5 rounded-lg">
                  -15%
                </div>
                <span className="text-xs text-[#2d80a1] bg-white px-3 py-1 rounded-full font-medium">Постоянно</span>
              </div>
              <h3 className="font-serif text-xl text-[#174051] mb-2">Долгосрочная аренда</h3>
              <p className="text-[#4A7A8C] text-sm leading-relaxed mb-6">
                При бронировании от 14 ночей — специальная скидка 15%
              </p>
              <div className="flex gap-3">
                <a href="/apartments" className="flex-1 text-center bg-[#2d80a1] hover:bg-[#1f5a78] text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors">
                  Выбрать апартаменты
                </a>
              </div>
            </div>

            {/* Newlyweds */}
            <div className="group bg-[#f8f6f3] rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-transparent hover:border-[#D4B896]/30">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-[#D4B896] text-white text-sm font-bold px-4 py-2 rounded-lg shadow-sm">
                  Подарок
                </div>
                <span className="text-xs text-[#2d80a1] bg-white px-3 py-1 rounded-full font-medium">Бесрочно</span>
              </div>
              <h3 className="font-serif text-xl text-[#174051] mb-2">Молодожёны</h3>
              <p className="text-[#4A7A8C] text-sm leading-relaxed mb-6">
                Романтический ужин и бутылка шампанского в подарок парам молодожёнов
              </p>
              <div className="flex gap-3">
                <a href="/apartments" className="flex-1 text-center bg-[#2d80a1] hover:bg-[#1f5a78] text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors">
                  Выбрать апартаменты
                </a>
              </div>
            </div>

            {/* Refer a Friend */}
            <div className="group bg-[#f8f6f3] rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-transparent hover:border-[#D4B896]/30">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-[#2d80a1] text-white text-2xl font-bold px-4 py-2 rounded-lg">
                  -15%
                </div>
                <span className="text-xs text-[#2d80a1] bg-white px-3 py-1 rounded-full font-medium">Постоянно</span>
              </div>
              <h3 className="font-serif text-xl text-[#174051] mb-2">Приведи друга</h3>
              <p className="text-[#4A7A8C] text-sm leading-relaxed mb-6">
                Порекомендуйте нас другу и получите скидку 15% на следующее бронирование
              </p>
              <div className="flex gap-3">
                <a href="/apartments" className="flex-1 text-center bg-[#2d80a1] hover:bg-[#1f5a78] text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors">
                  Выбрать апартаменты
                </a>
              </div>
            </div>

            {/* Spring Sale */}
            <div className="group bg-[#f8f6f3] rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-transparent hover:border-[#D4B896]/30">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-[#D4B896] text-white text-sm font-bold px-4 py-2 rounded-lg shadow-sm">
                  4+1
                </div>
                <span className="text-xs text-[#2d80a1] bg-white px-3 py-1 rounded-full font-medium">Март-май</span>
              </div>
              <h3 className="font-serif text-xl text-[#174051] mb-2">Весенняя распродажа</h3>
              <p className="text-[#4A7A8C] text-sm leading-relaxed mb-6">
                Специальные цены на весенние месяцы — каждая 5 ночь в подарок
              </p>
              <div className="flex gap-3">
                <a href="/apartments" className="flex-1 text-center bg-[#2d80a1] hover:bg-[#1f5a78] text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors">
                  Выбрать апартаменты
                </a>
              </div>
            </div>

            {/* Last Minute */}
            <div className="group bg-gradient-to-br from-[#2d80a1] to-[#1f5a78] rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-[#D4B896] text-[#174051] text-2xl font-bold px-4 py-2 rounded-lg shadow-md">
                  -35%
                </div>
                <span className="text-xs text-white/90 bg-white/20 px-3 py-1 rounded-full font-medium">Постоянно</span>
              </div>
              <h3 className="font-serif text-xl text-white mb-2">Last Minute</h3>
              <p className="text-white/85 text-sm leading-relaxed mb-6">
                Бронирование за 12 часов до заезда — максимальная скидка на 1 сутки!
              </p>
              <div className="flex gap-3">
                <a href="/apartments" className="flex-1 text-center bg-[#2d80a1] hover:bg-[#1f5a78] text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors">
                  Выбрать апартаменты
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sudak & Surroundings Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/crimea-bg.jpg')`
          }}
        />
        {/* Overlay for readability - reduced opacity to show more of the image */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/75 to-white/60" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col gap-6 max-w-2xl">
            {/* Title above description */}
            <div>
              <p className="text-xs text-[#2d80a1] uppercase tracking-[0.3em] mb-4 font-medium">Откройте Крым</p>
              <h2 className="font-serif text-4xl md:text-5xl text-[#174051] font-light leading-tight">
                Судак и окрестности
              </h2>
            </div>

            {/* Description below title */}
            <div>
              <p className="text-[#4A7A8C] text-base leading-relaxed mb-4">
                Судак — жемчужина юго-восточного побережья Крыма, где величественные горы встречаются с лазурным морем. 
                Этот древний город с богатой историей, уходящими корнями в III век, подарит вам незабываемые впечатления.
              </p>
              <p className="text-[#4A7A8C] text-base leading-relaxed mb-6">
                Здесь вас ждут средневековые крепости, живописные бухты, горные тропы и знаменитые крымские виноградники. 
                Мягкий субтропический климат с 300 солнечными днями в году создаёт идеальные условия для отдыха.
              </p>
              <Link 
                href="/sudak" 
                onClick={scrollToTop}
                className="inline-flex items-center gap-3 text-[#2d80a1] hover:text-[#1f5a78] font-semibold transition-colors group"
              >
                Читать подробнее
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Attractions Grid */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <AttractionCard
              href="/sudak"
              image="/attractions/alchak.jpg"
              title="Гора Алчак"
              description="Слева от ЖК Атлас возвышается гора Алчак, у её подножья берёт начало оборудованная экотропа вдоль побережья. С тропы открывается шикарный, завораживающий вид на весь город. На тропе есть интересное место — «Чёртов мостик», а также грот Эолова арфа. У подножья горы — деревянные качели и место для барбекю."
            />
            <AttractionCard
              href="/sudak"
              image="/attractions/genoese-fortress.jpg"
              title="Генуэзская крепость"
              description="Уникальный памятник средневековой архитектуры XIV-XV веков, возвышающийся над морем на 157 метров. Крепостные стены протянулись почти на 2 км с 15 боевыми башнями. Рядом расположена ярмарка и частный музей истории Крыма."
            />
            <AttractionCard
              href="/sudak"
              image="/attractions/novy-svet.jpg"
              title="Посёлок Новый Свет"
              description="Живописный посёлок в 7 км от Судака с тремя бухтами: Зелёной, Синей и Голубой. Знаменитая Голицынская тропа, завод шампанских вин и уникальная можжевеловая роща. За горой Алчак — Таврида Арт с оборудованной набережной и мыс Меганом с джип-турами."
            />
            <AttractionCard
              href="/sudak"
              image="/attractions/church-12-apostles.jpg"
              title="Церковь 12 апостолов"
              description="Атмосферный памятник истории — древняя церковь и башня рядом с Генуэзской крепостью. Малоизвестное, но очень впечатляющее место. На набережной также расположен музей истории Крыма."
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function Loading() {
  return null
}
