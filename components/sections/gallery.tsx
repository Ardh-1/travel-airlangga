'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, Compass, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useEmblaCarousel from 'embla-carousel-react'
import { getOptimizedUnsplashUrl } from '@/lib/utils'

import type { GalleryItem } from '@/lib/types'

const staticGalleryItems: GalleryItem[] = [
  {
    id: '1',
    location: 'Taman Nasional Komodo, NTT',
    image: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: '2',
    location: 'Gunung Bromo, Jawa Timur',
    image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: '3',
    location: 'Nusa Penida, Bali',
    image: 'https://images.unsplash.com/photo-1502759683299-cdcd6974244f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: '4',
    location: 'Magelang, Jawa Tengah',
    image: 'https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: '5',
    location: 'Raja Ampat, Papua Barat',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: '6',
    location: 'Ubud, Bali',
    image: 'https://images.unsplash.com/photo-1552608494-18ba4c799d6a?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: '7',
    location: 'Samosir, Sumatera Utara',
    image: 'https://images.unsplash.com/photo-1617042371383-a13e36d92a21?auto=format&fit=crop&w=1200&q=80'
  }
]

interface GallerySectionProps {
  initialItems?: GalleryItem[]
}

export function GallerySection({ initialItems }: GallerySectionProps) {
  const items = (initialItems && initialItems.length > 0 ? initialItems : staticGalleryItems)
    .filter(item => item.showOnHome !== false)
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    containScroll: false
  })

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  const handleSlideClick = (index: number) => {
    if (!emblaApi) return
    if (index !== selectedIndex) {
      emblaApi.scrollTo(index)
    } else {
      setActiveItem(items[index])
    }
  }

  return (
    <section className="py-20 bg-background overflow-hidden relative border-t border-border/50">

      {/* Section Header (Centered within grid container) */}
      <div className="container mx-auto px-4 md:px-6 mb-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            Galeri Perjalanan
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight">
            Adventure Moments with Airlangga
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Jelajahi keindahan Indonesia melalui bidikan lensa dokumentasi otentik perjalanan para traveler kami.
          </p>
        </div>
      </div>

      {/* Infinite Looping Coverflow Carousel (Full Width) */}
      <div className="relative w-full">
        <div
          ref={emblaRef}
          className="overflow-hidden w-full cursor-grab active:cursor-grabbing"
        >
          <div className="flex select-none">
            {items.map((item, index) => {
              const isActive = index === selectedIndex
              return (
                <div
                  key={item.id}
                  className="flex-[0_0_80%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-3 sm:px-4 min-w-0 relative"
                  onClick={() => handleSlideClick(index)}
                >
                  {/* Carousel Card */}
                  <div
                    className={`w-full aspect-[3/4] relative rounded-2xl overflow-hidden border border-border transition-all duration-500 ease-out ${isActive
                      ? 'scale-100 opacity-100 shadow-2xl ring-4 ring-primary/10 z-10'
                      : 'scale-90 opacity-40 z-0'
                      }`}
                  >
                    {/* Image */}
                    <Image
                      src={getOptimizedUnsplashUrl(item.image, 600, 75)}
                      alt={item.location}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      draggable={false}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent opacity-85" />

                    {/* Text Details (Only on active slide) */}
                    <div
                      className={`absolute bottom-0 left-0 right-0 p-6 z-10 text-white transition-all duration-500 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                        }`}
                    >
                      <span className="text-xs text-white/95 font-medium tracking-wide uppercase flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        {item.location}
                      </span>
                    </div>

                    {/* Carousel Arrow Controls (Attached to Left/Right edge of the active card) */}
                    {isActive && (
                      <>
                        <Button
                          variant="default"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            emblaApi?.scrollPrev()
                          }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white text-black border border-border/20 shadow-xl z-20 cursor-pointer transition-all active:scale-95"
                          aria-label="Previous Slide"
                        >
                          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                        </Button>
                        <Button
                          variant="default"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            emblaApi?.scrollNext()
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white text-black border border-border/20 shadow-xl z-20 cursor-pointer transition-all active:scale-95"
                          aria-label="Next Slide"
                        >
                          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Lightbox / Fullscreen Modal */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActiveItem(null)}
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-6 right-6 text-white hover:bg-white/10 rounded-full w-12 h-12 z-20 cursor-pointer"
              onClick={() => setActiveItem(null)}
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Modal Image Wrapper */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-5xl aspect-video md:aspect-[16/10] max-h-[80vh] rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={getOptimizedUnsplashUrl(activeItem.image, 1200, 80)}
                alt={activeItem.location}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority
              />

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white">
                <span className="text-xs text-white/90 font-medium tracking-wider uppercase flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  {activeItem.location}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
