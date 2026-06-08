export interface Trip {
  id: string
  title: string
  slug: string
  destination: string
  duration: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  departureDates: string[]
  meetingPoint: string
  itinerary: ItineraryDay[]
  includes: string[]
  excludes: string[]
  category: 'domestic' | 'international'
  featured?: boolean
  depositPercentage?: number
  description?: string
  terms?: string
  transportation?: string
}

export interface ItineraryDay {
  day: number
  title: string
  description: string
  activities: string[]
}

export interface Booking {
  id: string
  tripId: string
  tripTitle: string
  customerName: string
  email: string
  whatsapp: string
  participants: number
  departureDate: string
  totalPrice: number
  status: 'pending' | 'dp_paid' | 'paid' | 'cancelled'
  bookingCode: string
  createdAt: string
  paymentDeadline: string
  depositPercentage?: number
}

export interface Car {
  id: string
  name: string
  type: string
  capacity: number
  pricePerDay: number
  image: string
  features: string[]
}

export interface Testimonial {
  id: string
  videoUrl: string
}

export interface PrivateTripRequest {
  destination: string
  participants: number
  duration: number
  facilities: string[]
  estimatedPrice: number
}

export interface GalleryItem {
  id: string
  location: string
  image: string
  showOnHome?: boolean
  showOnAbout?: boolean
  createdAt?: string
}
