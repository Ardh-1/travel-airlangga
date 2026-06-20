'use client'

import { Plane, Users, MapPin, Star } from 'lucide-react'

const stats = [
  { label: 'Trips', value: '500+', icon: Plane },
  { label: 'Travelers', value: '10k+', icon: Users },
  { label: 'Destinations', value: '50+', icon: MapPin },
  { label: 'Rating', value: '4.9', icon: Star },
]

export function StatsSection() {
  return (
    <section className="relative md:-mt-20 mt-10 z-10">
      <div className="container mx-auto px-4">
        <div className="bg-card rounded-3xl shadow-xl border border-border p-8 md:p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
                  <stat.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="font-mono text-3xl md:text-4xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
