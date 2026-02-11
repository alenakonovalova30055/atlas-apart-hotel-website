import React from "react"
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Wifi, Plane, Compass, Users, Droplet, Baby, Coffee, UtensilsCrossed, Heart, Car, Dumbbell, Book as Broom, PartyPopper } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-4">О нас</p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 text-balance">
            Стильные люкс апартаменты
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Atlas Apart Hotel — это прекрасное место для отдыха на берегу Чёрного моря. Мы предоставляем стильные люкс апартаменты с безупречным сочетанием комфорта, роскоши и уникальной локации на берегу моря.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ServiceCard
              icon={<Wifi className="w-10 h-10" />}
              title="Бесплатный Wi-Fi"
              description="Высокоскоростной интернет во всех апартаментах и общих зонах"
            />
            <ServiceCard
              icon={<Plane className="w-10 h-10" />}
              title="Трансфер"
              description="Организация трансфера из аэропорта Симферополя и ж/д вокзала"
            />
            <ServiceCard
              icon={<Compass className="w-10 h-10" />}
              title="Экскурсии"
              description="Индивидуальные и групповые экскурсии по Крыму с гидом"
            />
            <ServiceCard
              icon={<Droplet className="w-10 h-10" />}
              title="SPA-процедуры"
              description="Полный спектр SPA-услуг: обёртывания, пилинги, уход за лицом"
            />
            <ServiceCard
              icon={<Droplet className="w-10 h-10" />}
              title="Бассейн"
              description="Открытый бассейн с подогревом и зоной отдыха с шезлонгами"
            />
            <ServiceCard
              icon={<UtensilsCrossed className="w-10 h-10" />}
              title="Ресторан"
              description="Изысканные блюда в уютной атмосфере ресторана с видом на море"
            />
            <ServiceCard
              icon={<Baby className="w-10 h-10" />}
              title="Для детей"
              description="Детская площадка, кроватки и детский мини-клуб «Остров Сокровищ»"
            />
            <ServiceCard
              icon={<Heart className="w-10 h-10" />}
              title="Консьерж-сервис"
              description="Наша команда делает все для вашего идеального отдыха"
            />
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
            Нужно что-то особенное? Наша команда делает все для вашего идеального отдыха.
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="tel:+79789651180" 
              className="inline-flex items-center gap-2 text-xl font-medium hover:text-secondary transition-colors"
            >
              <span>+7 (978) 965-11-80</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function ServiceCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-card border border-border p-6 text-center hover:shadow-lg transition-shadow">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
        {icon}
      </div>
      <h3 className="font-serif text-xl font-semibold mb-3">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
