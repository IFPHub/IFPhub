// src/app/layout.tsx
import './globals.css'
import { ReactNode } from 'react'
import { Montserrat, Libre_Baskerville } from 'next/font/google'

const montserrat = Montserrat({ subsets: ['latin'], weight: ['100','200','300','400','500','600','700','800','900'], variable: '--font-montserrat' })
const libreBaskerville = Libre_Baskerville({ subsets: ['latin'], weight: ['400','700'], variable: '--font-libre' })

export const metadata = {
  title: 'Portal de Noticias — Campus',
  description: 'Noticias, eventos y avisos del campus universitario.'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${montserrat.variable} ${libreBaskerville.variable}`}>
      <body className="font-sans bg-bg text-primary">
        <div className="max-w-[1200px] mx-auto p-5">
          {children}
        </div>
      </body>
    </html>
  )
}
