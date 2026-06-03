'use client'

import { Map, Award, Tag, CreditCard, Headphones, ShieldCheck } from 'lucide-react'

const features = [
  {
    title: 'Best Destinations',
    description: 'Destinasi wisata terbaik dalam dan luar negeri yang sudah terseleksi',
    icon: Map,
  },
  {
    title: 'Prima Service',
    description: 'Pelayanan prima dari tim profesional yang berpengalaman',
    icon: Award,
  },
  {
    title: 'Best Price',
    description: 'Harga terbaik dan transparan tanpa biaya tersembunyi',
    icon: Tag,
  },
  {
    title: 'Flexible Payment',
    description: 'Pembayaran fleksibel dengan berbagai metode pembayaran',
    icon: CreditCard,
  },
  {
    title: '24/7 Customer Service',
    description: 'Layanan pelanggan siap membantu kapanpun Anda butuhkan',
    icon: Headphones,
  },
  {
    title: 'Best Facilities',
    description: 'Fasilitas terbaik untuk kenyamanan perjalanan Anda',
    icon: ShieldCheck,
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            Mengapa Memilih Kami
          </span>
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground mb-4 text-balance">
            Why Choose Airlangga Travel?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Kami berkomitmen memberikan pengalaman perjalanan terbaik dengan layanan berkualitas tinggi
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary transition-colors duration-300">
                <feature.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="font-serif font-semibold text-lg text-card-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
