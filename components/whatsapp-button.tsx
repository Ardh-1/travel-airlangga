'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

const WHATSAPP_NUMBER = '6208111211143'
const DEFAULT_MESSAGE = 'Halo Airlangga Travel, saya ingin bertanya tentang trip'

interface WhatsAppButtonProps {
  message?: string
}

export function WhatsAppButton({ message = DEFAULT_MESSAGE }: WhatsAppButtonProps) {
  const [mounted, setMounted] = useState(false)
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 hover:bg-primary-dark transition-colors"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 text-primary-foreground" />
      
      {/* Pulse animation */}
      <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-25" />
    </motion.a>
  )
}
