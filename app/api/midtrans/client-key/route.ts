import { NextResponse } from 'next/server'

export async function GET() {
  const clientKey = process.env.MIDTRANS_CLIENT_KEY || ''
  const serverKey = process.env.MIDTRANS_SERVER_KEY || ''
  
  // Use MIDTRANS_IS_SANDBOX env var, fallback to key prefix detection
  const isSandbox = process.env.MIDTRANS_IS_SANDBOX === 'true' || serverKey.startsWith('SB-')
  const isProduction = !isSandbox

  return NextResponse.json({
    clientKey,
    isProduction,
  })
}
