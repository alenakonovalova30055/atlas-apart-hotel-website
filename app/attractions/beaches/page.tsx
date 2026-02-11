import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { ApartmentCTA } from '@/components/apartment-cta'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Waves, Sun } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Пляжи Судака — Лучшие места для купания в Крыму | Atlas Apart',
  description: 'Лучшие пляжи Судака: городской пляж, Царский пляж, пляжи Нового Света и мыса Меганом. Чистейшая вода, мелкая галька, развитая инфраструктура.',
  keywords: 'пляжи Судака, пляжи Крыма, Царский пляж, пляж Меганом, купание в Судаке, море в Крыму',
  openGraph: {
    title: 'Пляжи Судака — Лучшие места для отдыха у моря',
    description: 'Чистейшие пляжи Судака с прозрачной водой и живописными видами на горы.',
    images: ['/attractions/beaches.jpg'],
  },
}

export default function BeachesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero */}
      <section className="relative h-[60vh] flex items-end">
        <Image
          src="/attractions/beaches.jpg"
          alt="Пляжи Судака"
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
            Пляжи Судака
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Чистейшее море, мелкая галька и живописные виды на горы — идеальные условия для пляжного отдыха
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
                <div className="text-sm text-muted-foreground">От отеля</div>
                <div className="font-medium">50 метров</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <Waves className="w-6 h-6 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Температура воды</div>
                <div className="font-medium">+22...+26°C летом</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <Sun className="w-6 h-6 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Пляжный сезон</div>
                <div className="font-medium">Май — Октябрь</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <h2 className="font-serif text-3xl font-bold mb-6">Пляжный отдых в Судаке</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Судак славится своими чистыми пляжами с прозрачной водой и живописными видами. 
              Побережье покрыто мелкой галькой из кварцевого песка, которая считается целебной 
              и не обжигает ноги даже в самую жаркую погоду.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Наш отель расположен всего в 50 метрах от благоустроенного пляжа с шезлонгами, 
              зонтиками и всей необходимой инфраструктурой.
            </p>
            
            <h2 className="font-serif text-3xl font-bold mb-6 mt-12">Лучшие пляжи</h2>
            
            <h3 className="font-serif text-xl font-semibold mb-3">Центральный пляж</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Главный пляж Судака с развитой инфраструктурой: кафе, водные развлечения, прокат 
              инвентаря. Плавный вход в воду идеален для отдыха с детьми. Вид на Генуэзскую 
              крепость создаёт неповторимую атмосферу.
            </p>

            <h3 className="font-serif text-xl font-semibold mb-3">Царский пляж</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Уединённый пляж в Новом Свете, окружённый скалами и можжевеловыми рощами. 
              Добраться можно по тропе Голицына или на катере. Кристально чистая вода 
              изумрудного оттенка.
            </p>

            <h3 className="font-serif text-xl font-semibold mb-3">Пляжи мыса Меганом</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Дикие пляжи для любителей уединения. Прозрачная вода, отличный снорклинг и 
              дайвинг. Считается одним из самых экологически чистых мест Крыма.
            </p>

            <h2 className="font-serif text-3xl font-bold mb-6 mt-12">Особенности</h2>
            <ul className="text-muted-foreground space-y-3 mb-6">
              <li>Кварцевый песок и мелкая галька — полезны для здоровья</li>
              <li>Прозрачная вода — видимость до 8-10 метров</li>
              <li>Плавный вход в воду — безопасно для детей</li>
              <li>Температура воды летом +22...+26°C</li>
              <li>300 солнечных дней в году</li>
            </ul>
          </div>
        </div>
      </section>

      <ApartmentCTA />
      <Footer />
    </div>
  )
}
