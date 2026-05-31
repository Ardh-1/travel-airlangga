import { prisma } from '@/lib/prisma'
import TestimonialsClient from './testimonials-client'

export const dynamic = 'force-dynamic'

const mockTestimonials = [
  {
    id: 'mock-test-1',
    videoUrl: 'https://www.youtube.com/embed/82Z07bXlR30',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mock-test-2',
    videoUrl: 'https://www.youtube.com/embed/1vR_sO0Fv-o',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
]

export default async function TestimonialsModerationPage() {
  if (!process.env.DATABASE_URL) {
    return <TestimonialsClient initialTestimonials={mockTestimonials} isMockData={true} />
  }

  try {
    const dbTestimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
    })

    const formattedTestimonials = dbTestimonials.map((t: any) => ({
      id: t.id,
      videoUrl: t.videoUrl,
      createdAt: t.createdAt.toISOString(),
    }))

    return <TestimonialsClient initialTestimonials={formattedTestimonials} isMockData={false} />
  } catch (error) {
    console.warn('Prisma getTestimonials failed, falling back to mock testimonials:', error)
    return <TestimonialsClient initialTestimonials={mockTestimonials} isMockData={true} />
  }
}

