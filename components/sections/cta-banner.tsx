'use client'

import { MessageCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const WHATSAPP_NUMBER = '6208111211143'
const WHATSAPP_MESSAGE = 'Halo Airlangga Travel, saya tertarik untuk booking trip'

export function CTABannerSection() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="relative bg-secondary rounded-3xl p-10 md:p-16 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full blur-3xl" />
          </div>

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground mb-4 text-balance">
                Siap Berangkat?
              </h2>
              <p className="text-muted-foreground max-w-lg leading-relaxed">
                Konsultasikan rencana perjalanan Anda dengan tim kami. 
                Kami siap membantu mewujudkan liburan impian Anda!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary-dark text-primary-foreground rounded-full px-8 h-14"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 w-5 h-5" />
                  Chat WhatsApp
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-foreground text-foreground hover:bg-foreground hover:text-background rounded-full px-8 h-14"
              >
                <a href="/open-trip">
                  Lihat Trip
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
