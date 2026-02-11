import React from "react"
import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import Script from 'next/script'
import { MultiBookingProvider } from '@/contexts/multi-booking-context'

const playfair = Playfair_Display({ 
  subsets: ["cyrillic", "latin"],
  variable: '--font-serif',
  weight: ['400', '500', '600', '700']
});

const inter = Inter({ 
  subsets: ["cyrillic", "latin"],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: 'Atlas Apart Hotel & Spa — Люксовые апартаменты в Судаке, Крым',
  description: 'Премиальные апартаменты на берегу Чёрного моря в Судаке. Современный SPA-комплекс, панорамные виды, индивидуальный сервис. 50 метров до пляжа.',
  generator: 'v0.app',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <Script type="module" src="https://homereserve.ru/widget.js" />
      </head>
      <body className={`font-sans antialiased`}>
        <MultiBookingProvider>
          {children}
        </MultiBookingProvider>
        <Analytics />
      </body>
    </html>
  )
}
