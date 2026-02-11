'use client'

import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { ExpandableApartments } from '@/components/expandable-apartments'

export default function ApartmentsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      {/* Header Section */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4 mb-8">
            <div>
              <p className="text-xs text-[#2d80a1] uppercase tracking-[0.25em] mb-3">Размещение</p>
              <h1 className="font-serif text-3xl font-light text-[#174051] mb-1 tracking-wide">
                Наши апартаменты
              </h1>
              <div className="w-16 h-0.5 bg-[#2d80a1]"></div>
            </div>
            <p className="text-sm text-[#4A7A8C] max-w-3xl leading-relaxed">
              Откройте для себя коллекцию роскошных апартаментов на берегу Чёрного моря. От уютных студий до трехкомнатных апартаментов— каждый номер разработан по индивидуальному дизайну для вашего идеального путешествия.
            </p>
          </div>
        </div>
      </section>

      {/* Apartments Grid Section */}
      <section className="py-20 bg-[#f9f7f4]">
        <div className="container mx-auto px-4">
          <ExpandableApartments />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
