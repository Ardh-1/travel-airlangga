import NextAuth from 'next-auth'
import { authConfig } from '@/auth.config'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

interface RateLimitRecord {
  count: number
  resetTime: number
  blockedUntil?: number
  violationCount: number
}

const rateLimitMap = new Map<string, RateLimitRecord>()
let lastCleanup = Date.now()
const CLEANUP_INTERVAL = 5 * 60 * 1000 // 5 minutes

function checkRateLimit(ip: string, limit: number, windowMs: number): { limited: boolean; blockedUntil?: number } {
  const now = Date.now()
  let record = rateLimitMap.get(ip)

  if (!record) {
    record = {
      count: 1,
      resetTime: now + windowMs,
      violationCount: 0,
    }
    rateLimitMap.set(ip, record)
    return { limited: false }
  }

  // If currently blocked, check if block expired
  if (record.blockedUntil && now < record.blockedUntil) {
    // Extend block time slightly if they keep hammering while blocked
    record.blockedUntil = now + (windowMs * Math.min(record.violationCount + 1, 10))
    return { limited: true, blockedUntil: record.blockedUntil }
  }

  // If reset time passed, reset count
  if (now > record.resetTime) {
    record.count = 1
    record.resetTime = now + windowMs
    // Decay violation count over time if clean for a while
    if (now > record.resetTime + (windowMs * 10)) {
      record.violationCount = Math.max(0, record.violationCount - 1)
    }
    return { limited: false }
  }

  record.count++
  if (record.count > limit) {
    record.violationCount++
    record.blockedUntil = now + (windowMs * Math.min(record.violationCount, 10))
    return { limited: true, blockedUntil: record.blockedUntil }
  }

  return { limited: false }
}

function cleanExpiredRecords() {
  const now = Date.now()
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    lastCleanup = now
    for (const [ip, record] of rateLimitMap.entries()) {
      if (!record.blockedUntil && now > record.resetTime + CLEANUP_INTERVAL) {
        rateLimitMap.delete(ip)
      } else if (record.blockedUntil && now > record.blockedUntil + CLEANUP_INTERVAL) {
        rateLimitMap.delete(ip)
      }
    }
  }
}

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith('/admin/login')
  const isAdminPage = req.nextUrl.pathname.startsWith('/admin')
  const isAdminApi = req.nextUrl.pathname.startsWith('/api/admin')
  const isApiRoute = req.nextUrl.pathname.startsWith('/api')

  const origin = req.headers.get('origin') || ''
  const isAllowedOrigin = origin.includes('192.168.18.7')

  // Get Client IP Address safely with reverse proxy, CDN, and fallback support
  const ip = req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-real-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    (req as any).ip ||
    '127.0.0.1'

  // Periodically clean up cache to prevent memory exhaustion
  cleanExpiredRecords()

  // Rate limit thresholds based on request type
  let limit = 100 // Default limit for general page views
  const windowMs = 60000 // 1 minute window

  if (isAuthPage || req.nextUrl.pathname.startsWith('/api/auth')) {
    limit = 15 // Strict brute force protection for login & auth endpoints
  } else if (isAdminPage || isAdminApi) {
    limit = 30 // Admin panel and admin APIs abuse protection
  } else if (isApiRoute) {
    limit = 30 // Public API abuse protection
  } else if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
    limit = 30 // Strict protection for form submissions / data writes
  }

  // Trigger rate limit check
  const { limited, blockedUntil } = checkRateLimit(ip, limit, windowMs)
  if (limited) {
    const retryAfter = blockedUntil ? Math.ceil((blockedUntil - Date.now()) / 1000) : 60
    const retryAfterStr = String(retryAfter > 0 ? retryAfter : 60)

    if (isApiRoute) {
      const response = NextResponse.json(
        { error: `Too many requests. Please try again after ${retryAfterStr} seconds.` },
        { status: 429 }
      )
      response.headers.set('Retry-After', retryAfterStr)
      if (isAllowedOrigin) {
        response.headers.set('Access-Control-Allow-Origin', origin)
        response.headers.set('Access-Control-Allow-Credentials', 'true')
      }
      return response
    }

    return new NextResponse(
      `<html><head><title>Too Many Requests</title><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/></head><body style="font-family:sans-serif; text-align:center; padding: 50px; background-color: #f9fafb;"><div style="max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 16px; border: 1px border #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);"><h1 style="color:#e11d48; margin-bottom: 12px; font-size: 24px;">Terlalu Banyak Permintaan (429)</h1><p style="color:#4b5563; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">Sistem mendeteksi aktivitas mencurigakan atau rentetan request berlebih dari alamat IP Anda. Silakan tunggu sekitar ${retryAfterStr} detik lalu muat ulang halaman.</p><div style="font-size: 12px; color: #9ca3af;">Airlangga Travel Shield</div></div></body></html>`,
      {
        status: 429,
        headers: {
          'Content-Type': 'text/html',
          'Retry-After': retryAfterStr,
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
        },
      }
    )
  }

  // Handle preflight CORS requests (OPTIONS)
  if (req.method === 'OPTIONS' && isApiRoute && isAllowedOrigin) {
    const response = new NextResponse(null, { status: 204 })
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    return response
  }

  // Protect admin API routes — return 401 JSON instead of redirect
  if (isAdminApi && !isLoggedIn) {
    const response = NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
    if (isAllowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Access-Control-Allow-Credentials', 'true')
    }
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    return response
  }

  if (isAdminPage && !isAuthPage && !isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/login', req.nextUrl))
  }

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin', req.nextUrl))
  }

  const response = NextResponse.next()

  // Add CORS headers for normal API responses
  if (isApiRoute && isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  // Inject safety headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Common static extensions (.png, .jpg, .svg, .css, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|woff|woff2|ico|json|txt|map)).*)',
  ],
}

