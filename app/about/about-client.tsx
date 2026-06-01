'use client'

import { useState } from 'react'
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
    instagram: '#'
  },
  {
    name: 'Budi Santoso',
    image: '/images/team-2.webp',
    instagram: '#'
  },
  {
    name: 'Rina Wijaya',
    image: '/images/team-3.webp',
    instagram: '#'
  },
  {
    name: 'Dika Pratama',
    image: '/images/team-4.webp',
    instagram: '#'
  },
  {
    name: 'Sarah Amelia',
    image: '/images/team-5.webp',
    instagram: '#'
  },
  {
    name: 'Ahmad Fauzi',
    image: '/images/team-6.webp',
    instagram: '#'
  },
  {
    name: 'Indah Permata',
    image: '/images/team-7.webp',
    instagram: '#'
  },
  {
    name: 'Hendra Wijaya',
    image: '/images/team-8.webp',
    instagram: '#'
  },
  {
    name: 'Yulia Citra',
    image: '/images/team-9.webp',
    instagram: '#'
  },
  {
    name: 'Rizky Ramadhan',
    image: '/images/team-10.webp',
    instagram: '#'
  },
  {
    name: 'Dewi Lestari',
    image: '/images/team-11.webp',
    instagram: '#'
  },
  {
    name: 'Bagus Saputra',
    image: '/images/team-12.webp',
    instagram: '#'
  },
  {
    name: 'Fitriani Ningsih',
    image: '/images/team-13.webp',
    instagram: '#'
  },
  {
    name: 'Aditya Pratama',
    image: '/images/team-14.webp',
    instagram: '#'
  }
]

// 2. Data Logo Klien (Foto Representatif Korporasi/Instansi)
const clientLogosRow1 = [
  { name: 'Nusantara Tech', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=200&h=80&q=80' },
  { name: 'Alpha Minerals', image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=200&h=80&q=80' },
  { name: 'Borneo Agro', image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=200&h=80&q=80' },
  { name: 'Astra Group', image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=200&h=80&q=80' },
  { name: 'Pacific Logis', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=200&h=80&q=80' },
  { name: 'Summit Capital', image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=200&h=80&q=80' },
]

const clientLogosRow2 = [
  { name: 'Khatulistiwa', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=200&h=80&q=80' },
  { name: 'Equator Air', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=200&h=80&q=80' },
  { name: 'Pertiwi Outing', image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=200&h=80&q=80' },
  { name: 'Global Energy', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=200&h=80&q=80' },
  { name: 'Nusa Ventures', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=200&h=80&q=80' },
  { name: 'BCA Syariah', image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=200&h=80&q=80' },
]

const clientLogosRow3 = [
  { name: 'Java Hospitality', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&h=80&q=80' },
  { name: 'Telkom Persada', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=200&h=80&q=80' },
  { name: 'Nusantara Green', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=200&h=80&q=80' },
  { name: 'Pertamina Corp', image: 'https://images.unsplash.com/photo-1610490824276-ac07e240c28a?auto=format&fit=crop&w=200&h=80&q=80' },
  { name: 'BUMN Lestari', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=200&h=80&q=80' },
  { name: 'Oceanic Cruise', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&h=80&q=80' },
]

// 3. Data Galeri Foto Fotografer
const photographerPhotos = [
  {
    id: 'photo-1',
    title: 'Keemasan Bromo',
    location: 'Taman Nasional Bromo Tengger Semeru, Jatim',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'photo-2',
    title: 'Surga Karst Raja Ampat',
    location: 'Piaynemo, Raja Ampat, Papua Barat',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'photo-3',
    title: 'Tari Kecak Uluwatu',
    location: 'Pura Luhur Uluwatu, Bali',
    image: 'https://images.unsplash.com/photo-1542044896530-05d85be9b11a?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'photo-4',
    title: 'Gradasi Air Komodo',
    location: 'Pulau Padar, Labuan Bajo, NTT',
    image: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'photo-5',
    title: 'Kabut Lembah Dieng',
    location: 'Dataran Tinggi Dieng, Jawa Tengah',
    image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'photo-6',
    title: 'Ayunan Ubud Tradisional',
    location: 'Tegalalang Rice Terraces, Bali',
    image: 'https://images.unsplash.com/photo-1552608494-18ba4c799d6a?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'photo-7',
    title: 'Terumbu Karang Bunaken',
    location: 'Taman Nasional Bunaken, Sulawesi Utara',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'photo-8',
    title: 'Kelokan Sungai Kapuas Aerial',
    location: 'Sungai Kapuas, Kalimantan Barat',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80'
  }
]

export function AboutClient() {
  const [activePhoto, setActivePhoto] = useState<typeof photographerPhotos[0] | null>(null)

  // Helper untuk merender logo foto klien secara identik
  const renderLogoItem = (logo: { name: string; image: string }, idx: number) => (
    <div
      key={`${logo.name}-${idx}`}
      className="flex items-center gap-3 bg-card border border-border/40 px-4 py-2 rounded-2xl group hover:border-primary/30 transition-all duration-300 shadow-sm flex-shrink-0 cursor-pointer overflow-hidden"
    >
      <div className="relative w-16 h-8 rounded-lg overflow-hidden bg-muted flex-shrink-0">
        <Image
          src={logo.image}
          alt={logo.name}
          fill
          sizes="80px"
          className="object-cover opacity-65 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500"
        />
      </div>
      <span className="text-xs font-semibold tracking-wide text-muted-foreground/60 group-hover:text-foreground transition-colors duration-300">
        {logo.name}
      </span>
    </div>
  )

  return (
    <div className="flex flex-col bg-background text-foreground overflow-hidden">

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-32 pb-16 bg-secondary/30 overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none -z-10">
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
              Menghubungkan Anda dengan Keindahan Nusantara
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Airlangga Travel lahir dari kecintaan yang mendalam pada petualangan. Kami berkomitmen untuk menghadirkan pengalaman perjalanan premium yang berkesan bagi setiap penjelajah dunia.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= MEET OUR TEAM ================= */}
      <section className="py-24 bg-card/40 border-y border-border/50 relative">
        <div className="container mx-auto px-4">

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              Meet Our Team
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground">
              Para Punggawa Petualangan
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

      {/* ================= OUR SERVICES (REUSED SECTION) ================= */}
      <OurServicesSection />

      {/* ================= OUR CLIENTS (CONTINUOUS SCROLL) ================= */}
      <section className="py-20 bg-card/30 border-y border-border/40 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 mb-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-3.5xl font-serif font-bold text-foreground">
              Dipercaya oleh Korporasi & Instansi
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
              animate={{ x: ['-25%', '0%'] }}
              transition={{
                ease: 'linear',
                duration: 25,
                repeat: Infinity
              }}
            >
              {[...clientLogosRow1, ...clientLogosRow1, ...clientLogosRow1, ...clientLogosRow1].map((logo, idx) => renderLogoItem(logo, idx))}
            </motion.div>
          </div>

          {/* Row 2: Kanan ke Kiri */}
          <div className="overflow-hidden flex w-full">
            <motion.div
              className="flex gap-6 w-max"
              animate={{ x: ['0%', '-25%'] }}
              transition={{
                ease: 'linear',
                duration: 25,
                repeat: Infinity
              }}
            >
              {[...clientLogosRow2, ...clientLogosRow2, ...clientLogosRow2, ...clientLogosRow2].map((logo, idx) => renderLogoItem(logo, idx))}
            </motion.div>
          </div>

          {/* Row 3: Kiri ke Kanan */}
          <div className="overflow-hidden flex w-full">
            <motion.div
              className="flex gap-6 w-max"
              animate={{ x: ['-25%', '0%'] }}
              transition={{
                ease: 'linear',
                duration: 25,
                repeat: Infinity
              }}
            >
              {[...clientLogosRow3, ...clientLogosRow3, ...clientLogosRow3, ...clientLogosRow3].map((logo, idx) => renderLogoItem(logo, idx))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= PHOTOGRAPHER GALLERY ================= */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              Fotografi Profesional
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground">
              Karya Lensa Fotografer
            </h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Setiap jepretan adalah cerita petualangan otentik. Lihat bagaimana fotografer kami mendokumentasikan lanskap dan momen istimewa.
            </p>
          </div>

          {/* Grid Photo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {photographerPhotos.map((photo) => (
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
                    src={photo.image}
                    alt={photo.title}
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

      {/* ================= LIGHTBOX MODAL ================= */}
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
                alt={activePhoto.title}
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
