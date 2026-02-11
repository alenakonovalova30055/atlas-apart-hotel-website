import Link from 'next/link'

export function ApartmentCTA() {
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <h3 className="font-serif text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
          Нужна помощь в выборе апартаментов?
        </h3>
        <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
          Наши специалисты подберут идеальный вариант размещения с учётом ваших пожеланий и бюджета
        </p>
        <Link 
          href="/contacts" 
          className="inline-block bg-secondary text-foreground px-8 py-4 text-base font-medium tracking-wide hover:bg-secondary/90 transition-colors"
        >
          ПОДОБРАТЬ АПАРТАМЕНТЫ ИНДИВИДУАЛЬНО
        </Link>
      </div>
    </section>
  )
}
