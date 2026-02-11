'use client'

import { useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { ArrowRight, MapPin, Clock, Mountain, Church, Waves, TreePine } from 'lucide-react'
import Image from 'next/image'

export function SudakPageClient() {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image 
            src="/attractions/sudak-hero.jpg" 
            alt="Судак" 
            fill 
            className="object-cover" 
            priority
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/40"></div>
        </div>
        
        {/* Content */}
        <div className="relative container mx-auto px-4 text-white">
          <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Вернуться на главную
          </Link>
          <p className="text-xs text-[#C4A76C] uppercase tracking-[0.25em] mb-3">Откройте Крым</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4 tracking-wide">
            Судак и окрестности
          </h1>
          <div className="w-20 h-0.5 bg-[#C4A76C] mb-6"></div>
          <p className="text-base md:text-lg text-white/90 max-w-3xl leading-relaxed">
            Судак — жемчужина юго-восточного побережья Крыма, где величественные горы встречаются с лазурным морем. 
            Откройте для себя богатую историю, живописные маршруты и уникальные достопримечательности.
          </p>
        </div>
      </section>

      {/* Main Attractions Section */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          
          {/* Alchak Mountain */}
          <div className="mb-12 pb-12 border-b border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Mountain className="w-4 h-4 text-[#2d80a1]" />
                  <span className="text-xs text-[#2d80a1] uppercase tracking-wider">Пешеходный маршрут</span>
                </div>
                <h2 className="font-serif text-2xl font-light text-[#174051] mb-3">Гора Алчак</h2>
                <p className="text-sm text-[#4A7A8C] leading-relaxed mb-4">
                  Слева от ЖК Атлас возвышается гора Алчак, у её подножья берёт начало оборудованная экотропа вдоль побережья, 
                  с которой открывается шикарный, завораживающий вид на весь город. На тропе есть интересное место, 
                  которое прозвали «Чёртов мостик». Также на горе есть грот Эолова арфа.
                </p>
                <ul className="space-y-2 text-sm text-[#4A7A8C] mb-4">
                  <li className="flex gap-2"><span className="text-[#2d80a1]">•</span> У подножья Алчака — деревянные качели и место для барбекю</li>
                  <li className="flex gap-2"><span className="text-[#2d80a1]">•</span> Беседки для медитации у кафе-ресторана «Алчак»</li>
                  <li className="flex gap-2"><span className="text-[#2d80a1]">•</span> За горой — Таврида Арт с оборудованной набережной</li>
                  <li className="flex gap-2"><span className="text-[#2d80a1]">•</span> Мыс Меганом — джип-туры и багги</li>
                </ul>
                <div className="text-xs text-[#4A7A8C] bg-[#f8f6f3] p-3 rounded-lg">
                  <strong>Время:</strong> ~1.5 часа | <strong>Сложность:</strong> Лёгкая | <strong>Высота:</strong> 456 м
                </div>
              </div>
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md">
                <Image src="/attractions/alchak.jpg" alt="Гора Алчак" fill className="object-cover" />
              </div>
            </div>
          </div>

          {/* Ai-Georgiy Mountain */}
          <div className="mb-12 pb-12 border-b border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="lg:order-2">
                <div className="flex items-center gap-2 mb-3">
                  <TreePine className="w-4 h-4 text-[#2d80a1]" />
                  <span className="text-xs text-[#2d80a1] uppercase tracking-wider">Горный поход</span>
                </div>
                <h2 className="font-serif text-2xl font-light text-[#174051] mb-3">Гора Ай-Георгий</h2>
                <p className="text-sm text-[#4A7A8C] leading-relaxed mb-4">
                  Здоровский пеший маршрут на гору Ай-Георгий (Св. Георгий). По дороге 2 источника воды, можжевельники, дубки. 
                  На машине 5 минут подъехать от Атласа, затем подниматься около 1.5 часов. С вершины видно Судак, Дачное и Меганом.
                </p>
                <ul className="space-y-2 text-sm text-[#4A7A8C] mb-4">
                  <li className="flex gap-2"><span className="text-[#2d80a1]">•</span> 2 источника с питьевой водой по пути</li>
                  <li className="flex gap-2"><span className="text-[#2d80a1]">•</span> Можжевеловые и дубовые рощи</li>
                  <li className="flex gap-2"><span className="text-[#2d80a1]">•</span> Панорамный вид на Судак, Дачное и Меганом</li>
                </ul>
                <div className="text-xs text-[#4A7A8C] bg-[#f8f6f3] p-3 rounded-lg">
                  <strong>Время:</strong> ~1.5 ч подъём | <strong>Сложность:</strong> Средняя | <strong>Доступ:</strong> 5 мин на авто от Атласа
                </div>
              </div>
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md lg:order-1">
                <Image src="/attractions/ai-georgiy.jpg" alt="Гора Ай-Георгий" fill className="object-cover" />
              </div>
            </div>
          </div>

          {/* Genoese Fortress */}
          <div className="mb-12 pb-12 border-b border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-[#2d80a1]" />
                  <span className="text-xs text-[#2d80a1] uppercase tracking-wider">Историческая достопримечательность</span>
                </div>
                <h2 className="font-serif text-2xl font-light text-[#174051] mb-3">Генуэзская крепость</h2>
                <p className="text-sm text-[#4A7A8C] leading-relaxed mb-4">
                  Уникальный памятник средневековой архитектуры XIV-XV веков. Крепость расположена на древнем коралловом рифе, 
                  возвышаясь над морем на 157 метров. Крепостные стены протянулись почти на 2 км с 15 боевыми башнями.
                </p>
                <ul className="space-y-2 text-sm text-[#4A7A8C] mb-4">
                  <li className="flex gap-2"><span className="text-[#2d80a1]">•</span> Консульский замок на вершине горы</li>
                  <li className="flex gap-2"><span className="text-[#2d80a1]">•</span> Девичья башня с видом на море</li>
                  <li className="flex gap-2"><span className="text-[#2d80a1]">•</span> Ярмарка рядом с крепостью</li>
                  <li className="flex gap-2"><span className="text-[#2d80a1]">•</span> Гора Сахарная головка поблизости</li>
                  <li className="flex gap-2"><span className="text-[#2d80a1]">•</span> Частный музей истории Крыма рядом</li>
                </ul>
                <div className="text-xs text-[#4A7A8C] bg-[#f8f6f3] p-3 rounded-lg">
                  <strong>Время работы:</strong> 9:00–19:00 | <strong>Расстояние:</strong> 1.5 км от центра
                </div>
              </div>
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md">
                <Image src="/attractions/genoese-fortress.jpg" alt="Генуэзская крепость" fill className="object-cover" />
              </div>
            </div>
          </div>

          {/* Church of 12 Apostles */}
          <div className="mb-12 pb-12 border-b border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="lg:order-2">
                <div className="flex items-center gap-2 mb-3">
                  <Church className="w-4 h-4 text-[#2d80a1]" />
                  <span className="text-xs text-[#2d80a1] uppercase tracking-wider">Памятник истории</span>
                </div>
                <h2 className="font-serif text-2xl font-light text-[#174051] mb-3">Церковь 12 апостолов</h2>
                <p className="text-sm text-[#4A7A8C] leading-relaxed mb-4">
                  Очень атмосферное место, памятник истории. Древняя церковь и башня рядом с Генуэзской крепостью — 
                  малоизвестное, но невероятно впечатляющее место. На набережной также расположен музей истории Крыма.
                </p>
                <ul className="space-y-2 text-sm text-[#4A7A8C] mb-4">
                  <li className="flex gap-2"><span className="text-[#2d80a1]">•</span> Древняя архитектура византийского периода</li>
                  <li className="flex gap-2"><span className="text-[#2d80a1]">•</span> Атмосферное место для фотографий</li>
                  <li className="flex gap-2"><span className="text-[#2d80a1]">•</span> Музей истории Крыма на набережной</li>
                </ul>
                <div className="text-xs text-[#4A7A8C] bg-[#f8f6f3] p-3 rounded-lg">
                  <strong>Расположение:</strong> Рядом с Генуэзской крепостью
                </div>
              </div>
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md lg:order-1">
                <Image src="/attractions/church-12-apostles.jpg" alt="Церковь 12 апостолов" fill className="object-cover" />
              </div>
            </div>
          </div>

          {/* Around Alchak Mountain */}
          <div className="mb-12 pb-12 border-b border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Waves className="w-4 h-4 text-[#2d80a1]" />
                  <span className="text-xs text-[#2d80a1] uppercase tracking-wider">За горой Алчак</span>
                </div>
                <h2 className="font-serif text-2xl font-light text-[#174051] mb-3">Таврида Арт и Меганом</h2>
                <p className="text-sm text-[#4A7A8C] leading-relaxed mb-4">
                  За горой Алчак открывается целый мир развлечений и приключений. Таврида Арт — ряд пляжей с оборудованной 
                  новой набережной, мастер-классами и культурными мероприятиями.
                </p>
                <ul className="space-y-2 text-sm text-[#4A7A8C] mb-4">
                  <li className="flex gap-2"><span className="text-[#2d80a1]">•</span> Таврида Арт — оборудованные пляжи и набережная</li>
                  <li className="flex gap-2"><span className="text-[#2d80a1]">•</span> Мыс Меганом — джип-туры и багги</li>
                  <li className="flex gap-2"><span className="text-[#2d80a1]">•</span> Посёлок Новый Свет — завод шампанских вин</li>
                  <li className="flex gap-2"><span className="text-[#2d80a1]">•</span> Голицынская тропа — 12 км через живописные бухты</li>
                </ul>
              </div>
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md">
                <Image src="/attractions/novy-svet.jpg" alt="Таврида Арт" fill className="object-cover" />
              </div>
            </div>
          </div>

          {/* Additional attractions grid */}
          <div className="mb-12">
            <p className="text-xs text-[#2d80a1] uppercase tracking-[0.25em] mb-3">Ещё рядом</p>
            <h2 className="font-serif text-2xl font-light text-[#174051] mb-6">Дополнительные достопримечательности</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-[#f8f6f3] p-5 rounded-lg">
                <h3 className="font-serif text-lg font-medium text-[#174051] mb-2">Гора Сахарная головка</h3>
                <p className="text-sm text-[#4A7A8C] leading-relaxed">Живописная гора рядом с Генуэзской крепостью с уникальной формой.</p>
              </div>
              
              <div className="bg-[#f8f6f3] p-5 rounded-lg">
                <h3 className="font-serif text-lg font-medium text-[#174051] mb-2">Музей истории Крыма</h3>
                <p className="text-sm text-[#4A7A8C] leading-relaxed">Частный музей рядом с крепостью и музей на набережной города.</p>
              </div>
              
              <div className="bg-[#f8f6f3] p-5 rounded-lg">
                <h3 className="font-serif text-lg font-medium text-[#174051] mb-2">Грот Эолова арфа</h3>
                <p className="text-sm text-[#4A7A8C] leading-relaxed">Уникальный природный грот на горе Алчак с удивительной акустикой.</p>
              </div>
              
              <div className="bg-[#f8f6f3] p-5 rounded-lg">
                <h3 className="font-serif text-lg font-medium text-[#174051] mb-2">Чёртов мостик</h3>
                <p className="text-sm text-[#4A7A8C] leading-relaxed">Узкий природный переход на экотропе горы Алчак.</p>
              </div>
              
              <div className="bg-[#f8f6f3] p-5 rounded-lg">
                <h3 className="font-serif text-lg font-medium text-[#174051] mb-2">Завод «Новый Свет»</h3>
                <p className="text-sm text-[#4A7A8C] leading-relaxed">Экскурсии и дегустации крымского шампанского. От 400 руб.</p>
              </div>
              
              <div className="bg-[#f8f6f3] p-5 rounded-lg">
                <h3 className="font-serif text-lg font-medium text-[#174051] mb-2">Ярмарка у крепости</h3>
                <p className="text-sm text-[#4A7A8C] leading-relaxed">Сувениры, местные продукты и крымские вина.</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-[#2d80a1]/10 to-[#2d80a1]/5 p-8 rounded-lg text-center">
            <p className="text-sm text-[#4A7A8C] mb-3">Нужна помощь в планировании маршрута?</p>
            <h3 className="font-serif text-xl font-light text-[#174051] mb-4">Мы поможем организовать экскурсию</h3>
            <Link 
              href="/contacts" 
              className="inline-flex items-center gap-2 text-sm font-medium text-[#2d80a1] hover:text-[#1f5a78] transition-colors"
            >
              Связаться с нами
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
