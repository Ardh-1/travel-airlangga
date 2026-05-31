import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { HeroSection } from '@/components/sections/hero'
import { StatsSection } from '@/components/sections/stats'
import { FeaturedTripsSection } from '@/components/sections/featured-trips'
import { FeaturesSection } from '@/components/sections/features'
import { OurServicesSection } from '@/components/sections/our-services'
import { TestimonialsSection } from '@/components/sections/testimonials'
import { GallerySection } from '@/components/sections/gallery'
import { CTABannerSection } from '@/components/sections/cta-banner'

import { getTrips, getTestimonials, getGalleryItems } from '@/lib/db-fallback'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [trips, testimonials, galleryItems] = await Promise.all([
    getTrips(),
    getTestimonials(),
    getGalleryItems(),
  ])

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturedTripsSection initialTrips={trips} />
      <FeaturesSection />
      <OurServicesSection />
      <TestimonialsSection initialTestimonials={testimonials} />
      <GallerySection initialItems={galleryItems} />
      <CTABannerSection />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
