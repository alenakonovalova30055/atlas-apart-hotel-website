import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { ApartmentCTA } from '@/components/apartment-cta'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Clock, Ticket } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Генуэзская крепость в Судаке — История, Фото, Как добраться | Atlas Apart',
  description: 'Генуэзская крепость — главная достопримечательность Судака. Средневековая цитадель XIV века на скале с панорамным видом на море. История, время работы, стоимость билетов.',
  keywords: 'Генуэзская крепость, Судак, Крым, достопримечательности Судака, средневековая крепость, экскурсии в Судаке',
  openGraph: {
    title: 'Генуэзская крепость в Судаке — История и Экскурсии',
    description: 'Средневековая Генуэзская крепость XIV века — символ Судака и одна из самых впечатляющих достопримечательностей Крыма.',
    images: ['/attractions/genoese-fortress.jpg'],
  },
}

export default function GenoeseeFortressPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero */}
      <section className="relative h-[60vh] flex items-end">
        <Image
          src="/attractions/genoese-fortress.jpg"
          alt="Генуэзская крепость в Судаке"
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
            Генуэзская крепость
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Средневековая цитадель XIV века — символ Судака и одна из самых впечатляющих достопримечательностей Крыма
          </p>
        </div>
      </section>

      {/* Info Cards */}
      <section className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <MapPin className="w-6 h-6 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Расположение</div>
                <div className="font-medium">1.5 км от отеля</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <Clock className="w-6 h-6 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Время работы</div>
                <div className="font-medium">9:00 — 19:00 ежедневно</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <Ticket className="w-6 h-6 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Стоимость</div>
                <div className="font-medium">от 300 ₽</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <h2 className="font-serif text-3xl font-bold mb-6">История крепости</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Генуэзская крепость в Судаке — уникальный памятник средневековой фортификационной архитектуры, 
              возведённый генуэзскими колонистами в XIV-XV веках. Крепость расположена на древнем коралловом 
              рифе, который возвышается над морем на 157 метров.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Крепостные стены протянулись почти на 2 километра, включая 15 боевых башен, каждая из которых 
              носила имя консула, при котором была построена. Главные ворота крепости охраняются мощными 
              башнями и барбаканом — дополнительным укреплением перед входом.
            </p>
            
            <h2 className="font-serif text-3xl font-bold mb-6 mt-12">Что посмотреть</h2>
            <ul className="text-muted-foreground space-y-3 mb-6">
              <li>Консульский замок — резиденция генуэзского консула на вершине горы</li>
              <li>Девичья башня (Кыз-Куле) с захватывающим видом на море</li>
              <li>Храм с аркадой XII века — старейшее сохранившееся здание крепости</li>
              <li>Башни Коррадо Чикало, Джудиче и Паскуале Джудиче</li>
              <li>Музей истории крепости с археологическими находками</li>
            </ul>

            <h2 className="font-serif text-3xl font-bold mb-6 mt-12">Практическая информация</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Лучшее время для посещения — раннее утро или вечер, когда нет туристических групп и солнце 
              не так сильно печёт. Рекомендуем взять удобную обувь для прогулки по каменистым тропам и 
              воду. Полный осмотр крепости занимает 2-3 часа.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Летом на территории крепости проводится рыцарский фестиваль «Генуэзский шлем» с 
              театрализованными представлениями, турнирами и средневековой ярмаркой.
            </p>
          </div>
        </div>
      </section>

      <ApartmentCTA />
      <Footer />
    </div>
  )
}
