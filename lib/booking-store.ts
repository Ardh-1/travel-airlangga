'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Booking } from './types'

interface BookingState {
  bookings: Booking[]
  addBooking: (booking: Booking) => void
  removeBooking: (id: string) => void
  updateBookingStatus: (id: string, status: Booking['status']) => void
  getBookingById: (id: string) => Booking | undefined
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: [],
      addBooking: (booking) =>
        set((state) => ({ bookings: [...state.bookings, booking] })),
      removeBooking: (id) =>
        set((state) => ({
          bookings: state.bookings.filter((b) => b.id !== id),
        })),
      updateBookingStatus: (id, status) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id ? { ...b, status } : b
          ),
        })),
      getBookingById: (id) => get().bookings.find((b) => b.id === id),
    }),
    {
      name: 'airlangga-bookings',
    }
  )
)

export function generateBookingCode(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')
  return `ALG-${year}-${random}`
}
