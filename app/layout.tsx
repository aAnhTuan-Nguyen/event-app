import type { Metadata } from 'next'
import { Schibsted_Grotesk, Martian_Mono } from 'next/font/google'
import './globals.css'
import LightRays from '@/components/LightRays'

const schibstedGrotesk = Schibsted_Grotesk({
  variable: '--font-schibsted-grotesk',
  subsets: ['latin']
})

const martianMono = Martian_Mono({
  variable: '--font-martian-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Learn NextJs 16 with DevEvent',
  description: 'A simple DevEvent app to learn NextJs 16 features'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${schibstedGrotesk.variable} ${martianMono.variable} antialiased min-h-screen`}>
        <div className='fixed inset-0 -z-10 pointer-events-none w-full h-full' aria-hidden role='presentation'>
          <LightRays
            raysOrigin='top-center'
            raysColor='#00ffff'
            raysSpeed={1.5}
            lightSpread={0.8}
            rayLength={1.2}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0.1}
            distortion={0.05}
            className='custom-rays'
          />
        </div>
        <main> {children}</main>
      </body>
    </html>
  )
}
