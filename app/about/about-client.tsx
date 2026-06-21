'use client'

import { useState } from 'react'
import type { GalleryItem } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Instagram,
  Camera,
  MapPin,
  X,
  Maximize2,
  Sparkles,
  Users
} from 'lucide-react'
import { OurServicesSection } from '@/components/sections/our-services'
import { getOptimizedUnsplashUrl } from '@/lib/utils'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'

// 1. Data Anggota Tim
const teamMembers = [
  {
    name: 'Abdul Ghani Aprizal',
    image: '/images/team-1.webp',
    instagram: 'https://www.instagram.com/airlangga_travel/'
  },
  {
    name: 'Neneng Pratiwi Zahra',
    image: '/images/team-2.webp',
    instagram: 'https://www.instagram.com/tiwi.npz/'
  },
  {
    name: 'Amin Junaedi',
    image: '/images/team-3.webp',
    instagram: 'https://www.instagram.com/amiwuff/'
  },
  {
    name: 'Fauzul Sambo',
    image: '/images/team-4.webp',
    instagram: 'https://www.instagram.com/fauzulramadhan_/'
  },
  {
    name: 'Afifah Nabila',
    image: '/images/team-5.webp',
    instagram: 'https://www.instagram.com/afifahnblz/'
  },
  {
    name: 'Ilyas Izzat',
    image: '/images/team-6.webp',
    instagram: 'https://www.instagram.com/ilyasizzat04/'
  },
  {
    name: 'Firman Fajar Saputra',
    image: '/images/team-7.webp',
    instagram: 'https://www.instagram.com/kang.firmanfajars/'
  },
  {
    name: 'Mistar Sadega',
    image: '/images/team-8.webp',
    instagram: 'https://www.instagram.com/mistarsadega/'
  },
  {
    name: 'Pimen',
    image: '/images/team-9.webp',
    instagram: 'https://www.instagram.com/bearuang/'
  },
  {
    name: 'Novi Yanti',
    image: '/images/team-10.webp',
    instagram: 'https://www.instagram.com/novints_/'
  },
  {
    name: 'Arya',
    image: '/images/team-11.webp',
    instagram: '#'
  },
  {
    name: 'Kevin Kusumawinata',
    image: '/images/team-12.webp',
    instagram: 'https://www.instagram.com/keevinkw_/'
  },
  {
    name: 'Rangga Fadli',
    image: '/images/team-13.webp',
    instagram: 'https://www.instagram.com/rangga_fadli/'
  },
  {
    name: 'Hartono',
    image: '/images/team-14.webp',
    instagram: 'https://www.instagram.com/hartono0899/'
  }
]

// 2. Data Logo Klien (Foto Representatif Korporasi/Instansi)
const clientLogosRow1 = [
  '/images/clients/1.webp',
  '/images/clients/2.webp',
  '/images/clients/3.webp',
  '/images/clients/4.webp',
  '/images/clients/5.webp',
  '/images/clients/6.webp',
  '/images/clients/7.webp',
  '/images/clients/8.webp',
  '/images/clients/9.webp',
  '/images/clients/10.webp',
  '/images/clients/11.webp',
  '/images/clients/12.webp',
  '/images/clients/13.webp',
  '/images/clients/14.webp',
  '/images/clients/15.webp',
  '/images/clients/16.webp'
]

const clientLogosRow2 = [
  '/images/clients/17.webp',
  '/images/clients/18.webp',
  '/images/clients/19.webp',
  '/images/clients/20.webp',
  '/images/clients/21.webp',
  '/images/clients/22.webp',
  '/images/clients/23.webp',
  '/images/clients/24.webp',
  '/images/clients/25.webp',
  '/images/clients/26.webp',
  '/images/clients/27.webp',
  '/images/clients/28.webp',
  '/images/clients/29.webp',
  '/images/clients/30.webp',
  '/images/clients/31.webp',
  '/images/clients/32.webp'
]

const clientLogosRow3 = [
  '/images/clients/33.webp',
  '/images/clients/34.webp',
  '/images/clients/35.webp',
  '/images/clients/36.webp',
  '/images/clients/37.webp',
  '/images/clients/38.webp',
  '/images/clients/39.webp',
  '/images/clients/40.webp',
  '/images/clients/41.webp',
  '/images/clients/42.webp',
  '/images/clients/43.webp',
  '/images/clients/44.webp',
  '/images/clients/45.webp',
  '/images/clients/46.webp',
  '/images/clients/47.webp',
  '/images/clients/48.webp',
  '/images/clients/49.webp'
]

// 3. Data Galeri Foto Fotografer
const photographerPhotos: GalleryItem[] = [
  {
    id: 'photo-1',
    location: 'Taman Nasional Bromo Tengger Semeru, Jatim',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    showOnAbout: true
  },
  {
    id: 'photo-2',
    location: 'Piaynemo, Raja Ampat, Papua Barat',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    showOnAbout: true
  },
  {
    id: 'photo-3',
    location: 'Pura Luhur Uluwatu, Bali',
    image: 'https://images.unsplash.com/photo-1542044896530-05d85be9b11a?auto=format&fit=crop&w=1200&q=80',
    showOnAbout: true
  },
  {
    id: 'photo-4',
    location: 'Pulau Padar, Labuan Bajo, NTT',
    image: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=1200&q=80',
    showOnAbout: true
  },
  {
    id: 'photo-5',
    location: 'Dataran Tinggi Dieng, Jawa Tengah',
    image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80',
    showOnAbout: true
  },
  {
    id: 'photo-6',
    location: 'Tegalalang Rice Terraces, Bali',
    image: 'https://images.unsplash.com/photo-1552608494-18ba4c799d6a?auto=format&fit=crop&w=1200&q=80',
    showOnAbout: true
  },
  {
    id: 'photo-7',
    location: 'Taman Nasional Bunaken, Sulawesi Utara',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    showOnAbout: true
  },
  {
    id: 'photo-8',
    location: 'Sungai Kapuas, Kalimantan Barat',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    showOnAbout: true
  }
]

export interface AboutClientProps {
  initialItems?: GalleryItem[]
}

export function AboutClient({ initialItems }: AboutClientProps) {
  const items = (initialItems && initialItems.length > 0 ? initialItems : photographerPhotos)
    .filter(item => item.showOnAbout === true)
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null)

  // Helper untuk merender logo foto klien secara identik
  const renderLogoItem = (logo: string, idx: number) => (
    <div
      key={`${logo}-${idx}`}
      className="flex items-center justify-center bg-card border border-border/40 p-2.5 rounded-2xl group hover:border-primary/30 transition-all duration-300 shadow-sm flex-shrink-0 cursor-pointer overflow-hidden w-28 h-14"
    >
      <div className="relative w-full h-full">
        <Image
          src={logo}
          alt="Client Logo"
          fill
          sizes="120px"
          className="object-contain transition-all duration-300"
        />
      </div>
    </div>
  )

  return (
    <div className="flex flex-col bg-background text-foreground overflow-hidden">

      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-secondary/30 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto space-y-3"
          >
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider">
              Eksplorasi Tanpa Batas
            </span>
            <h1 className="font-serif font-bold text-4xl md:text-5xl text-foreground text-balance">
              Connecting You with the Beauty of the Archipelago
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Airlangga Travel lahir dari kecintaan yang mendalam pada petualangan. Kami berkomitmen untuk menghadirkan pengalaman perjalanan premium yang berkesan bagi setiap penjelajah dunia.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-24 bg-card/40 border-y border-border/50 relative">
        <div className="container mx-auto px-4">

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              Tim Kami
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground">
              The Masters of Adventure
            </h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Tim profesional kami selalu siap mendesain, mendampingi, dan mendokumentasikan perjalanan impian terbaik Anda.
            </p>
          </div>

          {/* Embla Carousel */}
          <div className="relative">
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4 sm:-ml-6">
                {teamMembers.map((member, index) => (
                  <CarouselItem key={member.name} className="pl-4 sm:pl-6 basis-full md:basis-1/2 lg:basis-1/4 flex justify-center">
                    <div className="group bg-background border border-border/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 aspect-[768/1215] h-[520px] w-auto max-w-full">
                      {/* Photo */}
                      <div className="relative h-full w-full overflow-hidden bg-transparent">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 330px"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          priority={index < 4}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-6">
                          {/* Social Icon on Hover */}
                          <Link
                            href={member.instagram}
                            className="bg-white/20 hover:bg-white/40 p-4 rounded-full text-white backdrop-blur-md transition-all hover:scale-110 shadow-lg border border-white/20"
                          >
                            <Instagram className="w-6 h-6" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex -left-4 w-11 h-11 bg-background shadow-lg hover:bg-muted border border-border" />
              <CarouselNext className="hidden sm:flex -right-4 w-11 h-11 bg-background shadow-lg hover:bg-muted border border-border" />
            </Carousel>
          </div>

        </div>
      </section>

      {/* Our Services */}
      <OurServicesSection />

      {/* Our Clients */}
      <section className="py-20 bg-card/30 border-y border-border/40 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 mb-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              Klien Kami
            </span>
            <h2 className="text-5xl md:text-4.5xl font-serif font-bold text-foreground">
              Trusted by Corporations & Institutions
            </h2>
            <p className="text-muted-foreground text-xs md:text-sm">
              Kami bangga mendampingi perjalanan bisnis, gathering, dan outing instansi-instansi terkemuka di Indonesia.
            </p>
          </div>
        </div>

        {/* Marquee Wrapper */}
        <div className="space-y-6 select-none relative w-full pointer-events-auto">
          {/* Edge overlays */}
          <div className="absolute inset-y-0 left-0 w-16 sm:w-36 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 sm:w-36 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          {/* Row 1: Kiri ke Kanan */}
          <div className="overflow-hidden flex w-full">
            <motion.div
              className="flex gap-6 w-max"
              animate={{ x: ['-50%', '0%'] }}
              transition={{
                ease: 'linear',
                duration: 30,
                repeat: Infinity
              }}
            >
              {[...clientLogosRow1, ...clientLogosRow1].map((logo, idx) => renderLogoItem(logo, idx))}
            </motion.div>
          </div>

          {/* Row 2: Kanan ke Kiri */}
          <div className="overflow-hidden flex w-full">
            <motion.div
              className="flex gap-6 w-max"
              animate={{ x: ['0%', '-50%'] }}
              transition={{
                ease: 'linear',
                duration: 25,
                repeat: Infinity
              }}
            >
              {[...clientLogosRow2, ...clientLogosRow2].map((logo, idx) => renderLogoItem(logo, idx))}
            </motion.div>
          </div>

          {/* Row 3: Kiri ke Kanan */}
          <div className="overflow-hidden flex w-full">
            <motion.div
              className="flex gap-6 w-max"
              animate={{ x: ['-50%', '0%'] }}
              transition={{
                ease: 'linear',
                duration: 25,
                repeat: Infinity
              }}
            >
              {[...clientLogosRow3, ...clientLogosRow3].map((logo, idx) => renderLogoItem(logo, idx))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Photographer Gallery */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              Fotografi Profesional
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground">
              Photographers' Masterpieces
            </h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Setiap jepretan adalah cerita petualangan otentik. Lihat bagaimana fotografer kami mendokumentasikan lanskap dan momen istimewa.
            </p>
          </div>

          {/* Grid Photo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {items.map((photo) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group bg-card border border-border/60 hover:border-primary/30 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer relative aspect-[3/4]"
                  onClick={() => setActivePhoto(photo)}
                >
                  <Image
                    src={getOptimizedUnsplashUrl(photo.image, 600, 75)}
                    alt={photo.location}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                  {/* Maximize Icon */}
                  <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Maximize2 className="w-4 h-4" />
                  </div>

                  {/* Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white flex flex-col justify-end">
                    <span className="text-xs text-white/95 font-medium tracking-wide uppercase flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {photo.location}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActivePhoto(null)}
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-6 right-6 text-white hover:bg-white/10 rounded-full w-12 h-12 z-20 cursor-pointer"
              onClick={() => setActivePhoto(null)}
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Modal Image Wrapper */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-5xl aspect-video md:aspect-[16/10] max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl bg-muted"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={activePhoto.image}
                alt={activePhoto.location}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
