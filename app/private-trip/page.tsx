'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  Users,
  Calendar,
  MapPin,
  Check,
  MessageCircle,
  Car,
  Hotel,
  User,
  Utensils,
  Ticket,
  Camera,
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { destinations, privateTripFacilities } from '@/lib/data'

const WHATSAPP_NUMBER = '6208111211143'

const privateTripSchema = z.object({
  destination: z.string().min(1, 'Pilih destinasi'),
  participants: z.number().min(1, 'Minimal 1 peserta').max(50, 'Maksimal 50 peserta'),
  duration: z.number().min(1, 'Minimal 1 hari').max(30, 'Maksimal 30 hari'),
  facilities: z.array(z.string()),
})

type PrivateTripFormData = z.infer<typeof privateTripSchema>

const facilityIcons: Record<string, typeof Car> = {
  transport: Car,
  hotel: Hotel,
  guide: User,
  meals: Utensils,
  tickets: Ticket,
  documentation: Camera,
}

export default function PrivateTripPage() {
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null)

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PrivateTripFormData>({
    resolver: zodResolver(privateTripSchema),
    defaultValues: {
      destination: '',
      participants: 2,
      duration: 3,
      facilities: ['transport', 'hotel', 'guide'],
    },
  })

  const formData = watch()
  const participants = formData.participants || 2
  const duration = formData.duration || 3
  const selectedFacilities = formData.facilities || []

  const estimatedPrice = useMemo(() => {
    const basePrice = 500000 * duration // Base price per day
    const facilitiesPrice = selectedFacilities.reduce((total, facilityId) => {
      const facility = privateTripFacilities.find((f) => f.id === facilityId)
      return total + (facility?.price || 0) * duration
    }, 0)
    return (basePrice + facilitiesPrice) * participants
  }, [participants, duration, selectedFacilities])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleFacilityToggle = (facilityId: string) => {
    const current = selectedFacilities
    if (current.includes(facilityId)) {
      setValue(
        'facilities',
        current.filter((f) => f !== facilityId)
      )
    } else {
      setValue('facilities', [...current, facilityId])
    }
  }

  const handleWhatsAppClick = () => {
    if (!selectedDestination) {
      toast.error('Pilih destinasi terlebih dahulu')
      return
    }

    const facilitiesList = selectedFacilities
      .map((id) => privateTripFacilities.find((f) => f.id === id)?.label)
      .filter(Boolean)
      .join(', ')

    const message = `Halo Airlangga Travel, saya ingin booking Private Trip dengan detail:

Destinasi: ${selectedDestination}
Jumlah Peserta: ${participants} orang
Durasi: ${duration} hari
Fasilitas: ${facilitiesList}
Estimasi Harga: ${formatPrice(estimatedPrice)}

Mohon informasi lebih lanjut. Terima kasih!`

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              Private Trip
            </span>
            <h1 className="font-serif font-bold text-4xl md:text-5xl text-foreground mb-4 text-balance">
              Custom Your Journey
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Rancang perjalanan impian Anda sendiri. Pilih destinasi, tentukan durasi, 
              dan fasilitas sesuai keinginan. Tim kami siap mewujudkan liburan private yang sempurna!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Destination Selector */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-serif font-bold text-2xl md:text-3xl text-foreground mb-2">
              Pilih Destinasi
            </h2>
            <p className="text-muted-foreground">
              Klik destinasi yang ingin Anda kunjungi
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {destinations.map((dest, index) => (
              <motion.button
                key={dest.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                onClick={() => {
                  setSelectedDestination(dest.name)
                  setValue('destination', dest.name)
                }}
                className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                  selectedDestination === dest.name
                    ? 'border-primary ring-4 ring-primary/20'
                    : 'border-transparent hover:border-primary/50'
                }`}
              >
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                  <span className="text-background font-semibold text-sm">{dest.name}</span>
                </div>
                {selectedDestination === dest.name && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
          {errors.destination && (
            <p className="text-sm text-destructive text-center mt-4">
              {errors.destination.message}
            </p>
          )}
        </div>
      </section>

      {/* Configuration Form */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left - Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                {/* Participants & Duration */}
                <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
                  <h3 className="font-serif font-semibold text-lg text-card-foreground">
                    Detail Trip
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="participants">Jumlah Peserta</Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="participants"
                          type="number"
                          min={1}
                          max={50}
                          {...register('participants', { valueAsNumber: true })}
                          className="pl-10 h-12 rounded-xl"
                        />
                      </div>
                      {errors.participants && (
                        <p className="text-sm text-destructive">{errors.participants.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Durasi (Hari)</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="duration"
                          type="number"
                          min={1}
                          max={30}
                          {...register('duration', { valueAsNumber: true })}
                          className="pl-10 h-12 rounded-xl"
                        />
                      </div>
                      {errors.duration && (
                        <p className="text-sm text-destructive">{errors.duration.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Facilities */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="font-serif font-semibold text-lg text-card-foreground mb-4">
                    Fasilitas
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    {privateTripFacilities.map((facility) => {
                      const Icon = facilityIcons[facility.id] || Check
                      const isSelected = selectedFacilities.includes(facility.id)

                      return (
                        <button
                          key={facility.id}
                          type="button"
                          onClick={() => handleFacilityToggle(facility.id)}
                          className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                            isSelected
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              isSelected ? 'bg-primary' : 'bg-muted'
                            }`}
                          >
                            <Icon
                              className={`w-5 h-5 ${
                                isSelected ? 'text-primary-foreground' : 'text-muted-foreground'
                              }`}
                            />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-sm text-card-foreground">
                              {facility.label}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              +{formatPrice(facility.price)}/hari
                            </p>
                          </div>
                          {isSelected && (
                            <Check className="w-5 h-5 text-primary ml-auto" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Right - Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:sticky lg:top-24 h-fit"
              >
                <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
                  <h3 className="font-serif font-semibold text-lg text-card-foreground">
                    Ringkasan Trip
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Destinasi</p>
                        <p className="font-medium text-card-foreground">
                          {selectedDestination || 'Belum dipilih'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Jumlah Peserta</p>
                        <p className="font-medium text-card-foreground">
                          {participants} orang
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Durasi</p>
                        <p className="font-medium text-card-foreground">{duration} hari</p>
                      </div>
                    </div>
                  </div>

                  {/* Selected Facilities */}
                  {selectedFacilities.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Fasilitas Terpilih</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedFacilities.map((id) => {
                          const facility = privateTripFacilities.find((f) => f.id === id)
                          return (
                            <span
                              key={id}
                              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                            >
                              {facility?.label}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Estimated Price */}
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-1">Estimasi Harga</p>
                    <p className="font-mono text-3xl font-bold text-primary">
                      {formatPrice(estimatedPrice)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      *Harga dapat berubah sesuai ketersediaan
                    </p>
                  </div>

                  <Button
                    onClick={handleWhatsAppClick}
                    className="w-full h-12 bg-primary hover:bg-primary-dark text-primary-foreground rounded-full text-base"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Konsultasi via WhatsApp
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton message="Halo, saya tertarik dengan Private Trip" />
    </main>
  )
}
