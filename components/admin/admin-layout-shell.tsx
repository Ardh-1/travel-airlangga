'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  CalendarDays,
  Car,
  FileSpreadsheet,
  MessageSquareQuote,
  Settings,
  User as UserIcon,
  Image as ImageIcon,
  Menu,
  X,
} from 'lucide-react'
import { SignOutButton } from '@/components/admin/sign-out-button'
import { cn } from '@/lib/utils'

interface AdminLayoutShellProps {
  session: any // Using any to avoid complex type import mismatches, matches NextAuth Session
  children: React.ReactNode
}

export function AdminLayoutShell({ session, children }: AdminLayoutShellProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/bookings', label: 'Bookings', icon: FileSpreadsheet },
    { href: '/admin/trips', label: 'Open Trips', icon: CalendarDays },
    { href: '/admin/cars', label: 'Daftar Armada', icon: Car },
    { href: '/admin/testimonials', label: 'Testimoni', icon: MessageSquareQuote },
    { href: '/admin/gallery', label: 'Kelola Galeri', icon: ImageIcon },
    { href: '/admin/settings', label: 'Pengaturan', icon: Settings },
  ]

  const SidebarContent = () => (
    <>
      {/* Header/Logo */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-sidebar-border">
        <Link href="/" className="relative w-40 h-10">
          <Image
            src="/images/logo.webp"
            alt="Airlangga Travel"
            fill
            className="object-contain"
            priority
          />
        </Link>
        {/* Mobile close button inside sidebar */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary/40 rounded-lg transition-colors cursor-pointer"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-sidebar-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
          <UserIcon className="w-5 h-5" />
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-semibold text-sidebar-foreground line-clamp-1">
            {session?.user?.name || 'Administrator'}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {session?.user?.email || 'admin@airlangga.com'}
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "text-primary")} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-sidebar-border">
        <SignOutButton />
      </div>
    </>
  )

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar (Permanent on md+) */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border hidden md:flex flex-col fixed top-0 bottom-0 left-0 z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Navigation (md-) */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Dark Overlay background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Sidebar drawer panel */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-72 bg-sidebar border-r border-sidebar-border z-50 flex flex-col md:hidden shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Wrapper */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Top Navbar Header */}
        <header className="h-20 bg-card/85 backdrop-blur-md border-b border-border flex items-center justify-between px-4 sm:px-6 md:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Hamburger Button on Mobile */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 -ml-2 text-foreground hover:text-primary transition-colors cursor-pointer rounded-lg hover:bg-secondary/40"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-base sm:text-lg font-bold text-foreground line-clamp-1">
              Panel Administrator
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-muted-foreground">Aktif sebagai</p>
              <p className="text-sm font-semibold text-foreground">
                {session?.user?.name || 'Admin'}
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-primary text-sm font-bold">
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        {/* Responsive Content Container */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 bg-secondary/5">
          {children}
        </main>
      </div>
    </div>
  )
}
