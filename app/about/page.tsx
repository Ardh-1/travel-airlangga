import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { AboutClient } from './about-client'
import { getGalleryItems } from '@/lib/db-fallback'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'About Us - Airlangga Travel',
  description: 'Informasi mengenai Airlangga Travel, penyedia jasa perjalanan terpercaya untuk Open Trip, Private Trip, dan Sewa Mobil.',
}

export default async function AboutPage() {
  const galleryItems = await getGalleryItems()

  return (
    <main className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <Navbar />
        <AboutClient initialItems={galleryItems} />
      </div>
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
