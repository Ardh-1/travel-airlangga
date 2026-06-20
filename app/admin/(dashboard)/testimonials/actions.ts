'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'

export async function deleteTestimonial(id: string) {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Unauthorized' }
  }

  if (!process.env.DATABASE_URL) {
    return { success: false, error: 'Database tidak terkoneksi (Mode Simulasi)' }
  }

  try {
    await prisma.testimonial.delete({
      where: { id },
    })

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/admin/testimonials')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete testimonial:', error)
    return { success: false, error: 'Gagal menghapus ulasan' }
  }
}

export async function createTestimonial(testimonialData: {
  videoUrl: string
}) {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Unauthorized' }
  }

  if (!process.env.DATABASE_URL) {
    return { success: false, error: 'Database tidak terkoneksi (Mode Simulasi)' }
  }

  try {
    const newTestimonial = await prisma.testimonial.create({
      data: {
        videoUrl: testimonialData.videoUrl,
      } as any,
    })

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/admin/testimonials')
    return { success: true, data: { id: newTestimonial.id } }
  } catch (error) {
    console.error('Failed to create testimonial:', error)
    return { success: false, error: 'Gagal membuat video baru' }
  }
}

export async function updateTestimonial(
  id: string,
  testimonialData: {
    videoUrl: string
  }
) {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Unauthorized' }
  }

  if (!process.env.DATABASE_URL) {
    return { success: false, error: 'Database tidak terkoneksi (Mode Simulasi)' }
  }

  try {
    await prisma.testimonial.update({
      where: { id },
      data: {
        videoUrl: testimonialData.videoUrl,
      } as any,
    })

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/admin/testimonials')
    return { success: true }
  } catch (error) {
    console.error('Failed to update testimonial:', error)
    return { success: false, error: 'Gagal memperbarui video' }
  }
}

