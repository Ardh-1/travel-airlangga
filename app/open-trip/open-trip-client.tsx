'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Calendar, MapPin, Clock, Compass } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { TripCard, TripCardSkeleton } from '@/components/trip-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Trip } from '@/lib/types'

const categories = [
  { value: 'All', label: 'Kategori' },
  { value: 'domestic', label: 'Domestik' },
  { value: 'international', label: 'Internasional' },
]
const durations = ['Durasi', '3 Hari', '4 Hari', '5 Hari', '6+ Hari']
const priceRanges = [
  { label: 'Harga', min: 0, max: Infinity },
  { label: 'Under 3 Juta', min: 0, max: 3000000 },
  { label: '3 - 5 Juta', min: 3000000, max: 5000000 },
  { label: '5 - 10 Juta', min: 5000000, max: 10000000 },
  { label: '10+ Juta', min: 10000000, max: Infinity },
]

interface OpenTripClientProps {
  trips: Trip[]
}

export default function OpenTripClient({ trips }: OpenTripClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDuration, setSelectedDuration] = useState('Durasi')
  const [selectedPriceRange, setSelectedPriceRange] = useState('Harga')
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const [isLoading] = useState(false)

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      // Search filter
      if (searchQuery && !trip.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Category filter
      if (selectedCategory !== 'All' && trip.category !== selectedCategory) {
        return false
      }

      // Duration filter
      if (selectedDuration !== 'Durasi') {
        const days = parseInt(trip.duration.split(' ')[0])
        if (selectedDuration === '3 Hari' && days !== 3) return false
        if (selectedDuration === '4 Hari' && days !== 4) return false
        if (selectedDuration === '5 Hari' && days !== 5) return false
        if (selectedDuration === '6+ Hari' && days < 6) return false
      }

      // Price filter
      if (selectedPriceRange !== 'Harga') {
        const range = priceRanges.find((r) => r.label === selectedPriceRange)
        if (range && (trip.price < range.min || trip.price > range.max)) {
          return false
        }
      }

      return true
    })
  }, [trips, searchQuery, selectedCategory, selectedDuration, selectedPriceRange])

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

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
            className="text-center max-w-2xl mx-auto space-y-3"
          >
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider">
              Paket Open Trip
            </span>
            <h1 className="font-serif font-bold text-4xl md:text-5xl text-foreground text-balance">
              Explore Our Open Trip Schedule
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Cara hemat untuk menjelajahi destinasi impian Anda! Solusi liburan pintar untuk menjelajahi destinasi populer, bertemu teman baru, dan menghemat biaya. Berbagai destinasi menarik menunggu Anda di sini, cek jadwal selengkapnya di bawah ini!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-3 bg-background/80 backdrop-blur-lg sticky top-20 z-30 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-0">
            {/* Search Input and Toggle Button */}
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari destinasi atau trip..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-28 h-12 bg-background/90 rounded-full border-border w-full shadow-sm text-sm"
              />
              <Button
                type="button"
                variant={isFilterMenuOpen ? "default" : "outline"}
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                className={`absolute right-1.5 top-1/2 -translate-y-1/2 h-9 rounded-full px-4 gap-2 text-xs md:text-sm font-medium transition-all duration-300 shadow-sm ${isFilterMenuOpen
                  ? "bg-primary text-primary-foreground hover:bg-primary/95"
                  : "hover:bg-accent hover:text-accent-foreground"
                  }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filter</span>
              </Button>
            </div>

            {/* Collapsible Filter Menu */}
            <AnimatePresence>
              {isFilterMenuOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0, marginTop: 0 }}
                  animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                  exit={{ height: 0, opacity: 0, marginTop: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden w-full"
                >
                  <div className="bg-card/95 border border-border rounded-2xl p-4 md:p-6 shadow-md backdrop-blur-md">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
                      {/* Category */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Kategori</label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="w-full bg-background/50 h-11 rounded-xl">
                            <Compass className="w-4 h-4 mr-2 text-primary" />
                            <SelectValue placeholder="Kategori" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Duration */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Durasi</label>
                        <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                          <SelectTrigger className="w-full bg-background/50 h-11 rounded-xl">
                            <Clock className="w-4 h-4 mr-2 text-primary" />
                            <SelectValue placeholder="Durasi" />
                          </SelectTrigger>
                          <SelectContent>
                            {durations.map((dur) => (
                              <SelectItem key={dur} value={dur}>
                                {dur}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Price Range */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Harga</label>
                        <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                          <SelectTrigger className="w-full bg-background/50 h-11 rounded-xl">
                            <Calendar className="w-4 h-4 mr-2 text-primary" />
                            <SelectValue placeholder="Harga" />
                          </SelectTrigger>
                          <SelectContent>
                            {priceRanges.map((range) => (
                              <SelectItem key={range.label} value={range.label}>
                                {range.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Reset Button */}
                      <div className="w-full">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSearchQuery("")
                            setSelectedCategory("All")
                            setSelectedDuration("Durasi")
                            setSelectedPriceRange("Harga")
                          }}
                          className="w-full h-11 rounded-xl border-dashed hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all duration-300 gap-2"
                        >
                          <Filter className="w-4 h-4" />
                          Reset Filter
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Trip Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Results count */}
          <p className="text-muted-foreground mb-6">
            Menampilkan <span className="text-foreground font-semibold">{filteredTrips.length}</span> trip
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <TripCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrips.map((trip, index) => (
                <TripCard key={trip.id} trip={trip} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-serif font-semibold text-xl text-foreground mb-2">
                Tidak Ada Trip Ditemukan
              </h3>
              <p className="text-muted-foreground">
                Coba ubah filter pencarian Anda
              </p>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  )
}
