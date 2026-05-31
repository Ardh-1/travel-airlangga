'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const services = [
  {
    title: 'Open Trip',
    description: 'Gabung bersama traveler lain dan jelajahi destinasi impian dengan jadwal teratur dan harga lebih hemat.',
    image: '/images/services-1.png',
    link: '/open-trip',
    cta: 'Lihat Destinasi',
  },
  {
    title: 'Private Trip',
    description: 'Rancang liburan impian Anda secara eksklusif. Bebas tentukan tanggal, rute, dan fasilitas sesuai keinginan.',
    image: '/images/services-2.png',
    link: '/private-trip',
    cta: 'Konsultasi Privat',
  },
  {
    title: 'Corporate Trip',
    description: 'Solusi perjalanan bisnis, outing, gathering, dan kegiatan corporate dengan fasilitas premium & profesional.',
    image: '/images/services-3.png',
    link: '/contact',
    cta: 'Hubungi Hub',
  },
  {
    title: 'Edutainment Trip',
    description: 'Perjalanan edukasi interaktif dan menyenangkan yang dirancang khusus untuk sekolah, kampus, dan komunitas.',
    image: '/images/services-4.png',
    link: '/contact',
    cta: 'Info Paket Edu',
  },
]

export function OurServicesSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background blurs */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-semibold text-sm uppercase tracking-wider block mb-3"
          >
            Layanan Kami
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif font-bold text-3xl md:text-5xl text-foreground mb-4 text-balance"
          >
            Our Professional Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-base md:text-lg leading-relaxed"
          >
            Kami berkomitmen menyajikan perjalanan terbaik dengan standar layanan profesional untuk setiap petualangan Anda.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="group bg-card border border-border/80 hover:border-primary/30 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full overflow-hidden"
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] flex-shrink-0 w-full overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    {/* Title */}
                    <h3 className="font-serif font-bold text-xl text-foreground mb-3 leading-snug">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>

                  {/* CTA Link */}
                  <Link
                    href={service.link}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary group-hover:text-primary-dark transition-colors pt-2"
                  >
                    <span>{service.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
