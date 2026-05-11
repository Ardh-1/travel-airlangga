import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { HeroSection } from '@/components/sections/hero'
import { StatsSection } from '@/components/sections/stats'
import { FeaturedTripsSection } from '@/components/sections/featured-trips'
import { FeaturesSection } from '@/components/sections/features'
import { TestimonialsSection } from '@/components/sections/testimonials'
import { CTABannerSection } from '@/components/sections/cta-banner'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturedTripsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTABannerSection />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
