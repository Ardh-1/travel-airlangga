import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getYouTubeEmbedUrl(url: string | null | undefined): string {
  if (!url) return ''
  const cleanUrl = url.trim()

  // If already an embed link, return as is
  if (cleanUrl.includes('/embed/')) {
    return cleanUrl
  }

  // Extract ID from shorts: youtube.com/shorts/ID
  const shortsMatch = cleanUrl.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/i)
  if (shortsMatch && shortsMatch[1]) {
    return `https://www.youtube.com/embed/${shortsMatch[1]}`
  }

  // Extract ID from watch: youtube.com/watch?v=ID
  const watchMatch = cleanUrl.match(/v=([a-zA-Z0-9_-]+)/i)
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`
  }

  // Extract ID from share: youtu.be/ID
  const shareMatch = cleanUrl.match(/youtu\.be\/([a-zA-Z0-9_-]+)/i)
  if (shareMatch && shareMatch[1]) {
    return `https://www.youtube.com/embed/${shareMatch[1]}`
  }

  return cleanUrl;
}
