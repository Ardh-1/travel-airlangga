import type { Metadata, Viewport } from 'next'
import { Inter, Poppins, Space_Grotesk } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Airlangga Travel',
    template: '%s - Airlangga Travel',
  },
  description: 'Airlangga Travel menyediakan layanan Open Trip, Private Trip, dan rental mobil premium. Destinasi terbaik dengan harga terjangkau.',
  keywords: ['travel', 'open trip', 'private trip', 'wisata', 'liburan', 'Bromo', 'Yogyakarta', 'East Europe'],
  authors: [{ name: 'Airlangga Travel' }],
  icons: {
    icon: '/images/tabs-logo.webp',
    shortcut: '/images/tabs-logo.webp',
    apple: '/images/tabs-logo.webp',
  },
  openGraph: {
    title: 'Airlangga Travel',
    description: 'Airlangga Travel menyediakan layanan Open Trip, Private Trip, dan rental mobil premium.',
    type: 'website',
    locale: 'id_ID',
  },
}

export const viewport: Viewport = {
  themeColor: '#F4B400',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${poppins.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        <Toaster 
          position="top-right" 
          richColors 
          closeButton
          toastOptions={{
            style: {
              borderRadius: '16px',
            },
          }}
        />
      </body>
    </html>
  )
}
