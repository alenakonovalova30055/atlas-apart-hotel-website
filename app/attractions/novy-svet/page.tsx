import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { ApartmentCTA } from '@/components/apartment-cta'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Clock, Wine } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Посёлок Новый Свет — Тропа Голицына, Шампанское, Бухты | Atlas Apart',
  description: 'Новый Свет — живописный посёлок в Крыму с реликтовыми рощами, знаменитой тропой Голицына и заводом шампанских вин. Царский пляж, Голубая и Зелёная бухты.',
  keywords: 'Новый Свет, тропа Голицына, шампанское Новый Свет, Крым, бухты, пещера Голицына, экскурсии',
  openGraph: {
    title: 'Посёлок Новый Свет — Жемчужина Крыма',
    description: 'Живописный посёлок с реликтовыми рощами, тропой Голицына и знаменитым заводом шампанских вин.',
    images: ['/attractions/novy-svet.jpg'],
  },
}

export default function NovySvetPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero */}
      <section className="relative h-[60vh] flex items-end">
        <Image
          src="/attractions/novy-svet.jpg"
          alt="Посёлок Новый Свет в Крыму"
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
            Посёлок Новый Свет
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Живописный уголок Крыма с реликтовыми можжевеловыми рощами и легендарным заводом шампанских вин
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
                <div className="text-sm text-muted-foreground">Расстояние</div>
                <div className="font-medium">7 км от Судака</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <Clock className="w-6 h-6 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Рекомендуемое время</div>
                <div className="font-medium">Полный день</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <Wine className="w-6 h-6 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Дегустация</div>
                <div className="font-medium">от 500 ₽</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <h2 className="font-serif text-3xl font-bold mb-6">О посёлке</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Новый Свет — один из самых красивых уголков Крыма, расположенный в 7 километрах от Судака. 
              Посёлок окружён горами и реликтовыми можжевеловыми рощами, которые создают уникальный 
              целебный микроклимат.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Название посёлку дал князь Лев Голицын, основавший здесь в 1878 году знаменитое производство 
              шампанских вин. Именно здесь, в подземных тоннелях, выдерживается настоящее крымское шампанское.
            </p>
            
            <h2 className="font-serif text-3xl font-bold mb-6 mt-12">Тропа Голицына</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Главная достопримечательность Нового Света — легендарная тропа Голицына, вырубленная в скалах 
              по приказу князя к приезду императора Николая II. Тропа протяжённостью около 5 км проходит 
              вдоль побережья через живописные бухты и гроты.
            </p>
            
            <h2 className="font-serif text-3xl font-bold mb-6 mt-12">Что посмотреть</h2>
            <ul className="text-muted-foreground space-y-3 mb-6">
              <li>Грот Шаляпина — естественная пещера с великолепной акустикой</li>
              <li>Голубая бухта — живописная бухта с прозрачной бирюзовой водой</li>
              <li>Царский пляж — уединённый пляж в Зелёной бухте</li>
              <li>Можжевеловая роща — заповедная территория с целебным воздухом</li>
              <li>Завод шампанских вин «Новый Свет» с экскурсией и дегустацией</li>
            </ul>

            <h2 className="font-serif text-3xl font-bold mb-6 mt-12">Дегустация шампанского</h2>
            <p className="text-muted-foreground leading-relaxed">
              Посещение завода шампанских вин — обязательная часть визита в Новый Свет. Во время экскурсии 
              вы спуститесь в подземные тоннели, где хранится более 2 миллионов бутылок, узнаете секреты 
              производства и продегустируете лучшие образцы крымского шампанского.
            </p>
          </div>
        </div>
      </section>

      <ApartmentCTA />
      <Footer />
    </div>
  )
}
