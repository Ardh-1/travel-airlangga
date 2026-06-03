'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Users,
  Calendar,
  MapPin,
  MessageCircle,
  User,
  Briefcase,
  DollarSign,
  ClipboardList,
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const WHATSAPP_NUMBER = '6282122258373'

const privateTripSchema = z.object({
  name: z.string().min(1, 'Nama lengkap wajib diisi'),
  instansi: z.string().optional(),
  whatsapp: z.string().min(5, 'Nomor WhatsApp tidak valid'),
  destination: z.string().min(1, 'Destinasi trip wajib diisi'),
  budget: z.string().min(1, 'Estimasi budget wajib diisi'),
  participants: z.number().min(1, 'Minimal 1 peserta'),
  departureDate: z.string().min(1, 'Tanggal berangkat wajib diisi'),
  returnDate: z.string().min(1, 'Tanggal pulang wajib diisi'),
  additionalNeeds: z.string().optional(),
})

type PrivateTripFormData = z.infer<typeof privateTripSchema>

export default function PrivateTripPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<PrivateTripFormData>({
    resolver: zodResolver(privateTripSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      instansi: '',
      whatsapp: '',
      destination: '',
      budget: '',
      participants: 2,
      departureDate: '',
      returnDate: '',
      additionalNeeds: '',
    },
  })

  // Watch fields for live summary preview
  const watchedFields = watch()

  const handleWhatsAppClick = (data: PrivateTripFormData) => {
    const message = `Halo Airlangga Travel, saya ingin berkonsultasi mengenai kustomisasi Private Trip dengan detail berikut:

*Data Pemesan:*
- Nama Lengkap: ${data.name}
- Asal Instansi/Keluarga: ${data.instansi || '-'}
- Nomor WhatsApp: ${data.whatsapp}

*Detail Trip:*
- Destinasi Trip: ${data.destination}
- Estimasi Budget: ${data.budget}
- Jumlah Peserta: ${data.participants} orang
- Tanggal Berangkat: ${data.departureDate}
- Tanggal Pulang: ${data.returnDate}

*Kebutuhan Tambahan:*
${data.additionalNeeds || '-'}

Mohon informasi penawaran dan tindak lanjutnya. Terima kasih!`

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <main className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Hero Section */}
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
                Paket Private Trip
              </span>
              <h1 className="font-serif font-bold text-4xl md:text-5xl text-foreground text-balance">
                Customize Your Dream Vacation
              </h1>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                Silakan isi data diri dan rencana perjalanan kustom Anda di bawah ini. Tim konsultan travel kami akan segera memformulasikan penawaran terbaik untuk Anda.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Form & Summary Area */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <form onSubmit={handleSubmit(handleWhatsAppClick)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Form Sections */}
              <div className="lg:col-span-2 space-y-6">

                {/* 1. Data Pemesan */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-3xl border border-border/80 p-6 md:p-8 space-y-6 shadow-sm"
                >
                  <div className="flex items-center gap-3 border-b border-border/60 pb-3">
                    <User className="w-5 h-5 text-primary" />
                    <h2 className="font-serif font-bold text-xl text-foreground">Data Diri Pemesan</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Nama Lengkap *</Label>
                      <Input
                        id="name"
                        placeholder="Contoh: Budi Santoso"
                        className="rounded-xl h-11"
                        {...register('name')}
                      />
                      {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="whatsapp">Nomor WhatsApp Aktif *</Label>
                      <Input
                        id="whatsapp"
                        placeholder="Contoh: 081234567890"
                        className="rounded-xl h-11"
                        {...register('whatsapp')}
                      />
                      {errors.whatsapp && <p className="text-xs text-destructive">{errors.whatsapp.message}</p>}
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <Label htmlFor="instansi">Asal Instansi / Nama Rombongan Keluarga (Opsional)</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="instansi"
                          placeholder="Contoh: PT Angin Ribut / Rombongan Keluarga Budi"
                          className="pl-10 rounded-xl h-11"
                          {...register('instansi')}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* 2. Detail Rencana Perjalanan */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 }}
                  className="bg-card rounded-3xl border border-border/80 p-6 md:p-8 space-y-6 shadow-sm"
                >
                  <div className="flex items-center gap-3 border-b border-border/60 pb-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h2 className="font-serif font-bold text-xl text-foreground">Detail Rencana Trip</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 md:col-span-2">
                      <Label htmlFor="destination">Destinasi Wisata Impian *</Label>
                      <Input
                        id="destination"
                        placeholder="Contoh: Bali 3D2N / Labuan Bajo Premium"
                        className="rounded-xl h-11"
                        {...register('destination')}
                      />
                      {errors.destination && <p className="text-xs text-destructive">{errors.destination.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="budget">Estimasi Budget per Rombongan *</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="budget"
                          placeholder="Contoh: Rp 15.000.000"
                          className="pl-9 rounded-xl h-11"
                          {...register('budget')}
                        />
                      </div>
                      {errors.budget && <p className="text-xs text-destructive">{errors.budget.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="participants">Jumlah Peserta *</Label>
                      <div className="relative">
                        <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="participants"
                          type="number"
                          min={1}
                          className="pl-10 rounded-xl h-11"
                          {...register('participants', { valueAsNumber: true })}
                        />
                      </div>
                      {errors.participants && <p className="text-xs text-destructive">{errors.participants.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="departureDate">Tanggal Berangkat *</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="departureDate"
                          type="date"
                          className="pl-10 rounded-xl h-11"
                          {...register('departureDate')}
                        />
                      </div>
                      {errors.departureDate && <p className="text-xs text-destructive">{errors.departureDate.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="returnDate">Tanggal Pulang *</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="returnDate"
                          type="date"
                          className="pl-10 rounded-xl h-11"
                          {...register('returnDate')}
                        />
                      </div>
                      {errors.returnDate && <p className="text-xs text-destructive">{errors.returnDate.message}</p>}
                    </div>
                  </div>
                </motion.div>

                {/* 3. Kebutuhan Tambahan */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-card rounded-3xl border border-border/80 p-6 md:p-8 space-y-6 shadow-sm"
                >
                  <div className="flex items-center gap-3 border-b border-border/60 pb-3">
                    <ClipboardList className="w-5 h-5 text-primary" />
                    <h2 className="font-serif font-bold text-xl text-foreground">Kebutuhan Tambahan</h2>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="additionalNeeds">Tulis kebutuhan spesifik Anda (Opsional)</Label>
                    <Textarea
                      id="additionalNeeds"
                      placeholder="Contoh: Request hotel bintang 4, makan halal, include tiket penerbangan dari Surabaya, dokumentasi drone, dll."
                      className="rounded-2xl min-h-[120px] resize-none"
                      {...register('additionalNeeds')}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Sticky Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-card border border-border/85 rounded-3xl p-6 shadow-sm space-y-6"
                  >
                    <h3 className="font-serif font-bold text-lg text-foreground border-b border-border pb-3">
                      Ringkasan Pengajuan
                    </h3>

                    <div className="space-y-4 text-sm">
                      <div>
                        <span className="text-xs text-muted-foreground block">Destinasi Wisata</span>
                        <span className="font-medium text-foreground">{watchedFields.destination || '-'}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs text-muted-foreground block">Jumlah Peserta</span>
                          <span className="font-medium text-foreground">{watchedFields.participants || '0'} orang</span>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground block">Estimasi Budget</span>
                          <span className="font-medium text-foreground">{watchedFields.budget || '-'}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs text-muted-foreground block">Tgl Berangkat</span>
                          <span className="font-medium text-foreground">{watchedFields.departureDate || '-'}</span>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground block">Tgl Pulang</span>
                          <span className="font-medium text-foreground">{watchedFields.returnDate || '-'}</span>
                        </div>
                      </div>

                      {watchedFields.name && (
                        <div className="pt-3 border-t border-border/50">
                          <span className="text-xs text-muted-foreground block">Pemesan</span>
                          <span className="font-medium text-foreground block">{watchedFields.name}</span>
                          {watchedFields.instansi && (
                            <span className="text-xs text-muted-foreground block italic">{watchedFields.instansi}</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        disabled={!isValid}
                        className="w-full h-12 bg-primary hover:bg-primary-dark text-primary-foreground rounded-full text-base font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                      >
                        <MessageCircle className="w-5 h-5" />
                        Konsultasi via WhatsApp
                      </Button>
                      {!isValid && (
                        <p className="text-[10px] text-muted-foreground text-center mt-2 italic">
                          * Mohon lengkapi semua bidang bertanda bintang (*)
                        </p>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>

      <Footer />
      <WhatsAppButton message="Halo, saya ingin berkonsultasi mengenai Private Trip kustom" />
    </main>
  )
}
