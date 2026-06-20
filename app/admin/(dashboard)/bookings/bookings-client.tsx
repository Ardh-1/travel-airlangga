'use client'

import { useState, useTransition } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Mail,
  Phone,
  Calendar,
  Users,
  Car,
  Compass,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { updateBookingStatus } from './actions'

interface BookingItem {
  id: string
  bookingCode: string
  customerName: string
  email: string
  whatsapp: string
  bookingType: string
  departureDate: string
  totalPrice: number
  status: string
  participants: number
  createdAt: string
  tripTitle?: string
}

interface BookingsClientProps {
  initialBookings: BookingItem[]
  isMockData: boolean
}

export default function BookingsClient({ initialBookings, isMockData }: BookingsClientProps) {
  const [bookings, setBookings] = useState<BookingItem[]>(initialBookings)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmData, setConfirmData] = useState<{
    id: string
    bookingCode: string
    customerName: string
    status: 'pending' | 'dp_paid' | 'paid' | 'cancelled'
  } | null>(null)

  const openConfirm = (
    id: string,
    bookingCode: string,
    customerName: string,
    status: 'pending' | 'dp_paid' | 'paid' | 'cancelled'
  ) => {
    setConfirmData({ id, bookingCode, customerName, status })
    setConfirmOpen(true)
  }

  const handleConfirmAction = () => {
    if (confirmData) {
      handleStatusChange(confirmData.id, confirmData.status)
      setConfirmOpen(false)
      setConfirmData(null)
    }
  }

  const getWhatsAppLink = (number: string) => {
    let cleanNumber = number.replace(/\D/g, '')
    if (cleanNumber.startsWith('0')) {
      cleanNumber = '62' + cleanNumber.substring(1)
    }
    return `https://wa.me/${cleanNumber}`
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleStatusChange = async (bookingId: string, newStatus: 'pending' | 'dp_paid' | 'paid' | 'cancelled') => {
    if (isMockData) {
      toast.warning('Mode Simulasi: Perubahan status hanya disimpan di memori sementara')
      setBookings((prev) =>
        newStatus === 'cancelled'
          ? prev.filter((b) => b.id !== bookingId)
          : prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      )
      return
    }

    startTransition(async () => {
      const result = await updateBookingStatus(bookingId, newStatus)
      if (result.success) {
        toast.success(newStatus === 'cancelled' ? 'Pemesanan berhasil dibatalkan' : `Status pemesanan berhasil diubah menjadi ${newStatus === 'dp_paid' ? 'DP Terbayar' : newStatus === 'paid' ? 'Lunas' : newStatus}`)
        setBookings((prev) =>
          newStatus === 'cancelled'
            ? prev.filter((b) => b.id !== bookingId)
            : prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
        )
      } else {
        toast.error(result.error || 'Gagal mengubah status pemesanan')
      }
    })
  }

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.whatsapp.includes(searchQuery)

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter
    const matchesType = typeFilter === 'all' || b.bookingType === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Daftar Pemesanan
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Lihat dan kelola semua reservasi open trip & car rental
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-card border border-border p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center shadow-sm">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Cari kode booking, nama, email, whatsapp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 border-border rounded-xl"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 h-11 rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="dp_paid">DP Terbayar</SelectItem>
              <SelectItem value="paid">Lunas (Paid)</SelectItem>
            </SelectContent>
          </Select>

          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-40 h-11 rounded-xl">
              <SelectValue placeholder="Tipe Booking" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              <SelectItem value="trip">Open Trip</SelectItem>
              <SelectItem value="car">Rental Mobil</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset Filters */}
          <Button
            variant="ghost"
            onClick={() => {
              setSearchQuery('')
              setStatusFilter('all')
              setTypeFilter('all')
            }}
            className="h-11 px-4 hover:bg-secondary rounded-xl text-sm"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Bookings List */}
      {(() => {
        interface GroupedBookings {
          [packageTitle: string]: {
            [departureDate: string]: BookingItem[]
          }
        }

        const groupedBookings = filteredBookings.reduce<GroupedBookings>((acc, b) => {
          const packageTitle = b.tripTitle || (b.bookingType === 'trip' ? 'Trip Tidak Diketahui' : 'Rental Mobil')
          if (!acc[packageTitle]) {
            acc[packageTitle] = {}
          }
          const departureDate = b.departureDate || 'Tanggal Tidak Ditentukan'
          if (!acc[packageTitle][departureDate]) {
            acc[packageTitle][departureDate] = []
          }
          acc[packageTitle][departureDate].push(b)
          return acc
        }, {})

        // List of all packages matching filters
        const packageTitles = Object.keys(groupedBookings)

        // Validate selected package
        const activePackage = selectedPackage && packageTitles.includes(selectedPackage) ? selectedPackage : null

        if (activePackage === null) {
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packageTitles.length > 0 ? (
                packageTitles.map((title) => {
                  const dateGroups = groupedBookings[title]
                  const totalBookings = Object.values(dateGroups).reduce((sum, list) => sum + list.length, 0)
                  const firstBooking = dateGroups[Object.keys(dateGroups)[0]]?.[0]
                  const isCar = title.startsWith('Rental Mobil') || firstBooking?.bookingType === 'car'

                  return (
                    <motion.div
                      key={title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="outline"
                            className={
                              isCar
                                ? 'bg-indigo-500/5 text-indigo-500 border-indigo-500/20'
                                : 'bg-blue-500/5 text-blue-500 border-blue-500/20'
                            }
                          >
                            {isCar ? 'Rental Mobil' : 'Trip'}
                          </Badge>
                          <Badge className="bg-primary text-primary-foreground font-semibold">
                            {totalBookings} Booking
                          </Badge>
                        </div>

                        <div className="flex items-start gap-3">
                          {isCar ? (
                            <Car className="w-5 h-5 text-primary mt-1 shrink-0" />
                          ) : (
                            <Compass className="w-5 h-5 text-primary mt-1 shrink-0" />
                          )}
                          <h3 className="font-serif font-bold text-lg text-card-foreground leading-snug line-clamp-2">
                            {title}
                          </h3>
                        </div>

                        <div className="text-xs text-muted-foreground flex items-center gap-1.5 pt-2 border-t border-border/50">
                          <Calendar className="w-4 h-4 text-primary shrink-0" />
                          <span>{Object.keys(dateGroups).length} Jadwal Keberangkatan / Sewa</span>
                        </div>
                      </div>

                      <Button
                        onClick={() => {
                          setSelectedPackage(title)
                          setSelectedDate(null)
                        }}
                        className="w-full mt-6 rounded-xl bg-primary hover:bg-primary-dark text-primary-foreground font-medium flex items-center justify-center gap-1.5"
                      >
                        Lihat Pemesanan
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  )
                })
              ) : (
                <div className="col-span-full bg-card border border-border rounded-2xl p-20 text-center shadow-sm">
                  <div className="w-16 h-16 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-serif font-semibold text-lg text-foreground">
                    Tidak Ada Pemesanan Ditemukan
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Coba gunakan kata kunci pencarian atau filter yang berbeda
                  </p>
                </div>
              )}
            </div>
          )
        }

        const dateGroups = groupedBookings[activePackage]
        const dateOptions = Object.keys(dateGroups)
        const activeDate = selectedDate && dateOptions.includes(selectedDate) ? selectedDate : (dateOptions[0] || null)
        const bookingsInActiveDate = activeDate ? dateGroups[activeDate] : []
        const isCar = activePackage.startsWith('Rental Mobil') || bookingsInActiveDate[0]?.bookingType === 'car'

        return (
          <div className="space-y-6">
            {/* Header / Back Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-secondary/10 border border-border/50 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedPackage(null)
                    setSelectedDate(null)
                  }}
                  className="rounded-xl flex items-center gap-1 h-9 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Semua Paket
                </Button>
                <div className="border-l border-border h-6 hidden sm:block" />
                <div>
                  <h2 className="font-serif font-bold text-base md:text-lg text-foreground flex items-center gap-2">
                    {isCar ? <Car className="w-5 h-5 text-primary" /> : <Compass className="w-5 h-5 text-primary" />}
                    {activePackage}
                  </h2>
                </div>
              </div>
              <Badge variant="outline" className="bg-background text-foreground font-semibold w-fit">
                Total: {Object.values(dateGroups).reduce((sum, list) => sum + list.length, 0)} Booking
              </Badge>
            </div>

            {/* Date Tabs */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-muted-foreground block uppercase tracking-wider">
                Pilih {isCar ? 'Tanggal Rental' : 'Jadwal Keberangkatan'}:
              </span>
              <div className="flex flex-wrap gap-2">
                {dateOptions.map((date) => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                      activeDate === date
                        ? 'bg-primary border-primary text-primary-foreground shadow-sm'
                        : 'bg-card border-border hover:bg-secondary/20 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {date} ({dateGroups[date].length})
                  </button>
                ))}
              </div>
            </div>

            {/* Bookings Details */}
            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden divide-y divide-border">
              {bookingsInActiveDate.length > 0 ? (
                bookingsInActiveDate.map((b) => (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 hover:bg-secondary/5 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    {/* Booking Core Info */}
                    <div className="space-y-3 lg:max-w-md">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-sm text-foreground bg-secondary px-3 py-1 rounded-lg border border-border">
                          {b.bookingCode}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Dipesan: {new Date(b.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-serif font-semibold text-base text-foreground">
                          {b.customerName}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                            {b.email}
                          </span>
                          <a
                            href={getWhatsAppLink(b.whatsapp)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer text-muted-foreground"
                          >
                            <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                            {b.whatsapp}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Booking Detail Metadata */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 lg:flex-1 lg:max-w-xl">
                      <div className="space-y-0.5">
                        <span className="text-xs text-muted-foreground block">{isCar ? 'Tanggal Rental' : 'Keberangkatan'}</span>
                        <span className="font-medium text-sm text-foreground flex items-center gap-1.5 mt-0.5">
                          <Calendar className="w-4 h-4 text-primary shrink-0" />
                          {b.departureDate}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-xs text-muted-foreground block">{isCar ? 'Durasi Rental' : 'Jumlah Peserta'}</span>
                        <span className="font-medium text-sm text-foreground flex items-center gap-1.5 mt-0.5">
                          <Users className="w-4 h-4 text-primary shrink-0" />
                          {b.bookingType === 'trip' ? `${b.participants} Orang` : `${b.participants} Hari`}
                        </span>
                      </div>

                      <div className="col-span-2 sm:col-span-1 space-y-0.5">
                        <span className="text-xs text-muted-foreground block">Total Pembayaran</span>
                        <span className="font-mono font-bold text-base text-primary block mt-0.5">
                          {formatPrice(b.totalPrice)}
                        </span>
                      </div>
                    </div>

                    {/* Actions & Current Status */}
                    <div className="flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-border">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground hidden lg:block text-right">Status saat ini:</span>
                        <Badge
                          className={
                            b.status === 'paid'
                              ? 'bg-success text-success-foreground'
                              : b.status === 'dp_paid'
                              ? 'bg-amber-500 text-white'
                              : b.status === 'pending'
                              ? 'bg-zinc-500 text-white'
                              : 'bg-destructive text-destructive-foreground'
                          }
                        >
                          {b.status === 'paid' ? 'Lunas' : b.status === 'dp_paid' ? 'DP Terbayar' : b.status === 'pending' ? 'Pending' : 'Batal'}
                        </Badge>
                      </div>

                      {/* Actions Buttons */}
                      <div className="flex items-center gap-1.5">
                        {b.status === 'dp_paid' ? (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => openConfirm(b.id, b.bookingCode, b.customerName, 'paid')}
                            disabled={isPending}
                            className="rounded-lg h-9 text-xs bg-success hover:bg-success/90 text-success-foreground flex items-center gap-1 cursor-pointer font-medium"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Pelunasan
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openConfirm(b.id, b.bookingCode, b.customerName, 'paid')}
                            disabled={b.status === 'paid' || isPending}
                            className="rounded-lg h-9 text-xs border-success/30 hover:bg-success/10 hover:text-success text-success-dark flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Lunas
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openConfirm(b.id, b.bookingCode, b.customerName, 'cancelled')}
                          disabled={b.status === 'cancelled' || isPending}
                          className="rounded-lg h-9 text-xs border-destructive/30 hover:bg-destructive/10 hover:text-destructive text-destructive flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                          Batal
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-20 bg-card">
                  <div className="w-16 h-16 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-serif font-semibold text-lg text-foreground">
                    Tidak Ada Pemesanan Pada Tanggal Ini
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Pilih tanggal keberangkatan/sewa yang lain pada barisan tab di atas
                  </p>
                </div>
              )}
            </div>
          </div>
        )
      })()}

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmData?.status === 'cancelled' ? 'Konfirmasi Pembatalan' : 'Konfirmasi Status Pembayaran'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmData?.status === 'cancelled' ? (
                <>Apakah Anda yakin ingin membatalkan pemesanan <strong>{confirmData?.bookingCode}</strong> ({confirmData?.customerName})? Tindakan ini tidak dapat dibatalkan.</>
              ) : (
                <>Apakah Anda yakin ingin mengubah status pemesanan <strong>{confirmData?.bookingCode}</strong> ({confirmData?.customerName}) menjadi <strong>Lunas</strong>?</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmData(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              className={confirmData?.status === 'cancelled' ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' : 'bg-success hover:bg-success/90 text-success-foreground'}
            >
              {confirmData?.status === 'cancelled' ? 'Ya, Batalkan' : 'Ya, Lunas'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
