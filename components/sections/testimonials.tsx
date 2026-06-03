'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { testimonials as staticTestimonials } from '@/lib/data'
import type { Testimonial } from '@/lib/types'
import { getYouTubeEmbedUrl, cn } from '@/lib/utils'

export function TestimonialsSection({ initialTestimonials }: { initialTestimonials?: Testimonial[] }) {
  const allTestimonials = initialTestimonials || staticTestimonials
  const videoTestimonials = allTestimonials.filter((t) => t.videoUrl)
  
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Batasi maksimal 3 ulasan video di halaman depan agar rapi
  const displayItems = videoTestimonials.slice(0, 3)

  return (
    <section className="py-24 bg-secondary/30 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3"
          >
            Dokumentasi Perjalanan
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif font-bold text-3xl md:text-5xl text-foreground mb-4 text-balance"
          >
            Watch the Excitement
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-sm md:text-base leading-relaxed"
          >
            Cuplikan dokumentasi video perjalanan asli dari berbagai destinasi eksotis bersama Airlangga Travel.
          </motion.p>
        </div>

        {/* Video Grid */}
        <div className={cn(
          "grid gap-8 max-w-6xl mx-auto justify-items-center",
          displayItems.length === 1 && "grid-cols-1",
          displayItems.length === 2 && "grid-cols-1 md:grid-cols-2",
          displayItems.length >= 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        )}>
          {displayItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-card border border-border/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col w-full max-w-[310px]"
            >
              {/* Embedded video player directly - Portrait YouTube Short format */}
              <div className="relative aspect-[9/16] w-full overflow-hidden bg-black">
                {item.videoUrl ? (
                  <iframe
                    src={getYouTubeEmbedUrl(item.videoUrl)}
                    title="Dokumentasi Perjalanan"
                    className="w-full h-full border-0"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                    Video tidak tersedia
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

