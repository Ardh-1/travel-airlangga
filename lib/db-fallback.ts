import { prisma } from './prisma'
import { trips as staticTrips, cars as staticCars, testimonials as staticTestimonials } from './data'
import type { Trip, Car, Testimonial, Booking, GalleryItem } from './types'

export async function getTrips(): Promise<Trip[]> {
  if (!process.env.DATABASE_URL) {
    return staticTrips
  }
  try {
    const dbTrips = await prisma.trip.findMany({
      include: {
        departureDates: true,
        itineraries: {
          include: {
            activities: { orderBy: { orderIndex: 'asc' } },
          },
          orderBy: { day: 'asc' },
        },
        includes: true,
        excludes: true,
      },
    })

    if (dbTrips.length === 0) return staticTrips

    return dbTrips.map((t) => ({
      id: t.id,
      title: t.title,
      slug: t.slug,
      destination: t.destination,
      duration: t.duration,
      price: t.price,
      originalPrice: t.originalPrice ?? undefined,
      image: t.image,
      images: [],
      availableSlots: t.availableSlots,
      totalSlots: t.totalSlots,
      departureDates: t.departureDates.map((d) => d.departureDate),
      meetingPoint: t.meetingPoint,
      itinerary: t.itineraries.map((it) => ({
        day: it.day,
        title: it.title,
        description: it.description,
        activities: it.activities.map((a) => a.activity),
      })),
      includes: t.includes.map((inc) => inc.item),
      excludes: t.excludes.map((exc) => exc.item),
      category: t.category as 'domestic' | 'international',
      featured: t.featured,
      depositPercentage: (t as any).depositPercentage ?? 100,
      description: (t as any).description ?? undefined,
      terms: (t as any).terms ?? undefined,
      transportation: (t as any).transportation ?? 'Darat',
    }))
  } catch (error) {
    console.warn('Prisma getTrips failed, falling back to static data:', error)
    return staticTrips
  }
}

export async function getTripBySlug(slug: string): Promise<Trip | null> {
  if (!process.env.DATABASE_URL) {
    return staticTrips.find((t) => t.slug === slug) || null
  }
  try {
    const t = await prisma.trip.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { orderIndex: 'asc' } },
        departureDates: true,
        itineraries: {
          include: {
            activities: { orderBy: { orderIndex: 'asc' } },
          },
          orderBy: { day: 'asc' },
        },
        includes: true,
        excludes: true,
      },
    })

    if (!t) return staticTrips.find((st) => st.slug === slug) || null

    return {
      id: t.id,
      title: t.title,
      slug: t.slug,
      destination: t.destination,
      duration: t.duration,
      price: t.price,
      originalPrice: t.originalPrice ?? undefined,
      image: t.image,
      images: t.images.map((img) => img.imageUrl),
      availableSlots: t.availableSlots,
      totalSlots: t.totalSlots,
      departureDates: t.departureDates.map((d) => d.departureDate),
      meetingPoint: t.meetingPoint,
      itinerary: t.itineraries.map((it) => ({
        day: it.day,
        title: it.title,
        description: it.description,
        activities: it.activities.map((a) => a.activity),
      })),
      includes: t.includes.map((inc) => inc.item),
      excludes: t.excludes.map((exc) => exc.item),
      category: t.category as 'domestic' | 'international',
      featured: t.featured,
      depositPercentage: (t as any).depositPercentage ?? 100,
      description: t.description ?? undefined,
      terms: t.terms ?? undefined,
      transportation: (t as any).transportation ?? 'Darat',
    }
  } catch (error) {
    console.warn(`Prisma getTripBySlug(${slug}) failed, falling back to static data:`, error)
    return staticTrips.find((t) => t.slug === slug) || null
  }
}

export async function getCars(): Promise<Car[]> {
  if (!process.env.DATABASE_URL) {
    return staticCars
  }
  try {
    const dbCars = await prisma.car.findMany({
      include: { features: true },
    })

    if (dbCars.length === 0) return staticCars

    return dbCars.map((c) => ({
      id: c.id,
      name: c.name,
      type: c.type,
      capacity: c.capacity,
      pricePerDay: c.pricePerDay,
      image: c.image,
      features: c.features.map((f) => f.feature),
    }))
  } catch (error) {
    console.warn('Prisma getCars failed, falling back to static data:', error)
    return staticCars
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!process.env.DATABASE_URL) {
    return staticTestimonials
  }
  try {
    const dbTestimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
    })

    if (dbTestimonials.length === 0) return staticTestimonials

    return dbTestimonials.map((t) => ({
      id: t.id,
      videoUrl: (t as any).videoUrl || '',
    }))
  } catch (error) {
    console.warn('Prisma getTestimonials failed, falling back to static data:', error)
    return staticTestimonials
  }
}

export async function createBooking(data: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> {
  const id = crypto.randomUUID()
  const createdAt = new Date().toISOString()
  const booking: Booking = { ...data, id, createdAt }

  if (!process.env.DATABASE_URL) {
    return booking
  }

  try {
    const dbBooking = await prisma.booking.create({
      data: {
        id,
        bookingCode: booking.bookingCode,
        customerName: booking.customerName,
        email: booking.email,
        whatsapp: booking.whatsapp,
        bookingType: booking.tripId ? 'trip' : 'car',
        tripId: booking.tripId || null,
        participants: booking.participants,
        departureDate: booking.departureDate,
        totalPrice: booking.totalPrice,
        status: booking.status,
        paymentDeadline: new Date(booking.paymentDeadline),
      },
    })
    return {
      ...booking,
      createdAt: dbBooking.createdAt.toISOString(),
      paymentDeadline: dbBooking.paymentDeadline.toISOString(),
    }
  } catch (error) {
    console.warn('Prisma createBooking failed, returning mock booking:', error)
    return booking
  }
}

export async function getBookingByCode(bookingCode: string): Promise<Booking | null> {
  if (!process.env.DATABASE_URL) {
    // Simulasi: jika tidak ada DB, kita kembalikan mock booking jika kodenya valid
    if (bookingCode.toUpperCase().startsWith('ALG-') || bookingCode.toUpperCase().startsWith('TRV-')) {
      return {
        id: 'mock-booking-id',
        bookingCode: bookingCode.toUpperCase(),
        customerName: 'Budi Santoso',
        email: 'budi.santoso@gmail.com',
        whatsapp: '081234567890',
        tripId: 'mock-trip-id',
        tripTitle: 'Open Trip Labuan Bajo Premium',
        participants: 2,
        departureDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
        totalPrice: 3500000,
        status: 'dp_paid',
        paymentDeadline: new Date(Date.now() + 86400000).toISOString(),
        createdAt: new Date().toISOString(),
        depositPercentage: 50,
      }
    }
    return null
  }

  try {
    const dbBooking = await prisma.booking.findUnique({
      where: { bookingCode },
      include: {
        trip: true,
        car: true,
      },
    })

    if (!dbBooking) return null

    return {
      id: dbBooking.id,
      bookingCode: dbBooking.bookingCode,
      customerName: dbBooking.customerName,
      email: dbBooking.email,
      whatsapp: dbBooking.whatsapp,
      tripId: dbBooking.tripId || '',
      tripTitle: dbBooking.trip?.title || dbBooking.car?.name || 'Pemesanan Travel',
      participants: dbBooking.participants,
      departureDate: dbBooking.departureDate,
      totalPrice: dbBooking.totalPrice,
      status: dbBooking.status as 'pending' | 'paid' | 'cancelled',
      paymentDeadline: dbBooking.paymentDeadline.toISOString(),
      createdAt: dbBooking.createdAt.toISOString(),
      depositPercentage: dbBooking.trip?.depositPercentage ?? 100,
    }
  } catch (error) {
    console.error(`Error fetching booking by code ${bookingCode}:`, error)
    return null
  }
}

export const staticGalleryItems: GalleryItem[] = [
  {
    id: '1',
    location: 'Taman Nasional Komodo, NTT',
    image: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=1200&q=80',
    showOnHome: true,
    showOnAbout: true
  },
  {
    id: '2',
    location: 'Gunung Bromo, Jawa Timur',
    image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80',
    showOnHome: true,
    showOnAbout: true
  },
  {
    id: '3',
    location: 'Nusa Penida, Bali',
    image: 'https://images.unsplash.com/photo-1502759683299-cdcd6974244f?auto=format&fit=crop&w=1200&q=80',
    showOnHome: true,
    showOnAbout: false
  },
  {
    id: '4',
    location: 'Magelang, Jawa Tengah',
    image: 'https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&fit=crop&w=1200&q=80',
    showOnHome: true,
    showOnAbout: false
  },
  {
    id: '5',
    location: 'Raja Ampat, Papua Barat',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    showOnHome: true,
    showOnAbout: true
  },
  {
    id: '6',
    location: 'Ubud, Bali',
    image: 'https://images.unsplash.com/photo-1552608494-18ba4c799d6a?auto=format&fit=crop&w=1200&q=80',
    showOnHome: true,
    showOnAbout: true
  },
  {
    id: '7',
    location: 'Samosir, Sumatera Utara',
    image: 'https://images.unsplash.com/photo-1617042371383-a13e36d92a21?auto=format&fit=crop&w=1200&q=80',
    showOnHome: true,
    showOnAbout: false
  },
  {
    id: '8',
    location: 'Pura Luhur Uluwatu, Bali',
    image: 'https://images.unsplash.com/photo-1542044896530-05d85be9b11a?auto=format&fit=crop&w=1200&q=80',
    showOnHome: false,
    showOnAbout: true
  },
  {
    id: '9',
    location: 'Dataran Tinggi Dieng, Jawa Tengah',
    image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80',
    showOnHome: false,
    showOnAbout: true
  },
  {
    id: '10',
    location: 'Taman Nasional Bunaken, Sulawesi Utara',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    showOnHome: false,
    showOnAbout: true
  },
  {
    id: '11',
    location: 'Sungai Kapuas, Kalimantan Barat',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    showOnHome: false,
    showOnAbout: true
  }
]

export async function getGalleryItems(): Promise<GalleryItem[]> {
  if (!process.env.DATABASE_URL) {
    return staticGalleryItems
  }
  try {
    const dbItems = await (prisma as any).galleryItem.findMany({
      orderBy: { createdAt: 'desc' },
    })

    if (dbItems.length === 0) return staticGalleryItems

    return dbItems.map((item: any) => ({
      id: item.id,
      location: item.location,
      image: item.image,
      showOnHome: item.showOnHome ?? true,
      showOnAbout: item.showOnAbout ?? false,
      createdAt: item.createdAt.toISOString(),
    }))
  } catch (error) {
    console.warn('Prisma getGalleryItems failed, falling back to static data:', error)
    return staticGalleryItems
  }
}

