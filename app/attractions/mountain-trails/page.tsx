import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { ApartmentCTA } from '@/components/apartment-cta'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Clock, Mountain } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Горные тропы Судака — Пешие маршруты, Треккинг в Крыму | Atlas Apart',
  description: 'Лучшие горные маршруты в окрестностях Судака. Восхождение на Ай-Георгий, тропы в долине Капсель, панорамные виды на Чёрное море. Советы и рекомендации.',
  keywords: 'горные тропы Судака, треккинг Крым, Ай-Георгий, пешие маршруты, горы Судака, походы в Крыму',
  openGraph: {
    title: 'Горные тропы Судака — Треккинг в Крыму',
    description: 'Живописные горные маршруты с панорамными видами на Чёрное море и крымские горы.',
    images: ['/attractions/mountain-trails.jpg'],
  },
}

export default function MountainTrailsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero */}
      <section className="relative h-[60vh] flex items-end">
        <Image
          src="/attractions/mountain-trails.jpg"
          alt="Горные тропы в окрестностях Судака"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 container mx-auto px-4 pb-12">
          <Link 
            href="/#attractions" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад к достопримечательностям
          </Link>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mb-4">
            Горные тропы
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Захватывающие маршруты по крымским горам с панорамными видами на море и виноградники
          </p>
        </div>
      </section>

      {/* Info Cards */}
      <section className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <Mountain className="w-6 h-6 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Высота</div>
                <div className="font-medium">до 500 м</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <Clock className="w-6 h-6 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Продолжительность</div>
                <div className="font-medium">2-6 часов</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <MapPin className="w-6 h-6 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Сложность</div>
                <div className="font-medium">От лёгкой до средней</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <h2 className="font-serif text-3xl font-bold mb-6">Треккинг в Судаке</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Окрестности Судака — настоящий рай для любителей пеших прогулок. Живописные горные тропы 
              проходят через можжевеловые леса, виноградники и открывают захватывающие виды на море 
              и Генуэзскую крепость.
            </p>
            
            <h2 className="font-serif text-3xl font-bold mb-6 mt-12">Популярные маршруты</h2>
            
            <h3 className="font-serif text-xl font-semibold mb-3">Гора Ай-Георгий (498 м)</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Одна из самых популярных вершин в окрестностях Судака. Подъём занимает около 2 часов и 
              награждает потрясающим видом на всю Судакскую долину, море и горы. На вершине находятся 
              руины средневекового монастыря.
            </p>

            <h3 className="font-serif text-xl font-semibold mb-3">Долина Капсель</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Живописная долина между мысами Меганом и Алчак. Маршрут проходит через можжевеловые рощи, 
              мимо диких пляжей и уединённых бухт. Отличный вариант для прогулки на полдня.
            </p>

            <h3 className="font-serif text-xl font-semibold mb-3">Мыс Алчак</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Лёгкий маршрут вдоль живописного мыса с видом на Судак и крепость. Подходит для семей 
              с детьми. В конце тропы — смотровая площадка и спуск к уединённому пляжу.
            </p>

            <h2 className="font-serif text-3xl font-bold mb-6 mt-12">Рекомендации</h2>
            <ul className="text-muted-foreground space-y-3 mb-6">
              <li>Лучшее время для походов — весна и осень, когда не так жарко</li>
              <li>Обязательно возьмите достаточно воды и головной убор</li>
              <li>Носите удобную обувь с хорошим сцеплением</li>
              <li>Начинайте маршрут рано утром, чтобы избежать полуденного зноя</li>
              <li>Мы можем организовать поход с профессиональным гидом</li>
            </ul>
          </div>
        </div>
      </section>

      <ApartmentCTA />
      <Footer />
    </div>
  )
}
