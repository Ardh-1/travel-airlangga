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

export function getOptimizedUnsplashUrl(url: string | null | undefined, width: number = 600, quality: number = 75): string {
  if (!url) return ''
  const cleanUrl = url.trim()
  if (!cleanUrl.includes('images.unsplash.com')) return cleanUrl
  try {
    const urlObj = new URL(cleanUrl)
    urlObj.searchParams.set('w', width.toString())
    urlObj.searchParams.set('q', quality.toString())
    urlObj.searchParams.set('auto', 'format')
    urlObj.searchParams.set('fit', 'crop')
    return urlObj.toString()
  } catch (e) {
    return cleanUrl
  }
}

export function compressAndConvertToWebP(
  file: File, 
  maxDimension: number = 1024, 
  quality: number = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width)
            width = maxDimension
          } else {
            width = Math.round((width * maxDimension) / height)
            height = maxDimension
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
          return
        }
        ctx.drawImage(img, 0, 0, width, height)

        const base64 = canvas.toDataURL('image/webp', quality)
        resolve(base64)
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = event.target?.result as string
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

