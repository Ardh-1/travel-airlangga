import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { image, folder = 'general' } = await req.json()

    if (!image) {
      return NextResponse.json({ success: false, error: 'Tidak ada data gambar' }, { status: 400 })
    }

    // Check if the image is a base64 data URL
    const isBase64 = image.startsWith('data:image/')
    if (!isBase64) {
      // If it's already a URL or doesn't match base64 format, return it as is
      return NextResponse.json({ success: true, url: image })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://skinjavdiesnvffsuktn.supabase.co'
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseKey) {
      console.warn('SUPABASE_SERVICE_ROLE_KEY is not configured. Storing image as Base64 in database.')
      return NextResponse.json({
        success: true,
        url: image, // Return the original base64
        fallback: true,
        message: 'Supabase credentials missing. Falling back to local Base64 storage.'
      })
    }

    // Parse base64
    const match = image.match(/^data:([^;]+);base64,(.+)$/)
    if (!match) {
      return NextResponse.json({ success: false, error: 'Format Base64 tidak valid' }, { status: 400 })
    }

    const mimeType = match[1]
    const base64Data = match[2]
    const buffer = Buffer.from(base64Data, 'base64')

    // Determine extension and filename
    const extension = mimeType.split('/')[1] || 'webp'
    const filename = `${randomUUID()}.${extension}`
    const bucket = 'travel-assets'
    const filePath = `${folder}/${filename}`

    const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${filePath}`

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': mimeType,
        'x-upsert': 'true'
      },
      body: buffer
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Supabase upload API error:', errorText)
      // On failure, fallback to base64 instead of crashing
      return NextResponse.json({
        success: true,
        url: image,
        fallback: true,
        message: `Supabase upload failed: ${errorText}. Falling back to Base64.`
      })
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${filePath}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fallback: false
    })
  } catch (error: any) {
    console.error('Upload handler error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Gagal memproses unggahan gambar'
    }, { status: 500 })
  }
}
