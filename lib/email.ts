import type { Booking } from './types'
import { prisma } from './prisma'
import { trips as staticTrips } from './data'

export async function sendBookingConfirmationEmail(booking: Booking) {
  const isSimulation = !process.env.RESEND_API_KEY

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  let depositPercentage = 100
  if (booking.tripId) {
    try {
      if (process.env.DATABASE_URL) {
        const trip = await prisma.trip.findUnique({
          where: { id: booking.tripId }
        })
        if (trip) {
          depositPercentage = (trip as any).depositPercentage ?? 100
        }
      } else {
        const trip = staticTrips.find(t => t.id === booking.tripId)
        if (trip) {
          depositPercentage = trip.depositPercentage ?? 100
        }
      }
    } catch (err) {
      console.warn('Failed to fetch trip for email depositPercentage check:', err)
    }
  }

  const trackLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/track-order?code=${booking.bookingCode}`
  const isDpPaid = booking.status === 'dp_paid'
  const depositAmount = booking.totalPrice * (depositPercentage / 100)
  const remainingAmount = booking.totalPrice - depositAmount

  const emailHtml = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Konfirmasi Pemesanan Airlangga Travel</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background-color: #f8fafc;
          color: #334155;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
        }
        .header {
          text-align: center;
          padding: 40px 20px;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }
        .header h1 {
          color: #f59e0b;
          margin: 0;
          font-size: 26px;
          letter-spacing: 1.5px;
          font-weight: 800;
        }
        .header p {
          color: #94a3b8;
          margin: 8px 0 0 0;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .status-banner {
          background-color: #f0fdf4;
          border-left: 4px solid #10b981;
          padding: 14px 20px;
          margin: 24px 30px 0 30px;
          border-radius: 8px;
        }
        .status-text {
          font-size: 14px;
          color: #166534;
          font-weight: 600;
        }
        .content {
          padding: 30px 30px 40px 30px;
        }
        .greeting {
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 24px;
          color: #475569;
        }
        .booking-card {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 20px;
          margin-bottom: 24px;
        }
        .booking-code-label {
          font-size: 10px;
          text-transform: uppercase;
          color: #64748b;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .booking-code {
          font-size: 22px;
          font-family: 'Courier New', Courier, monospace;
          font-weight: bold;
          color: #0284c7;
          margin-top: 4px;
          margin-bottom: 16px;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px dashed #e2e8f0;
          font-size: 14px;
        }
        .info-row:last-of-type {
          border-bottom: none;
        }
        .info-label {
          color: #64748b;
        }
        .info-value {
          font-weight: 600;
          color: #0f172a;
          text-align: right;
        }
        .price-section {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 2px solid #e2e8f0;
        }
        .price-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          font-size: 14px;
        }
        .price-row.total {
          padding-top: 10px;
          font-size: 17px;
          font-weight: 700;
        }
        .price-row.total .price-value {
          color: #0f172a;
          font-size: 18px;
          font-weight: 800;
        }
        .price-row.highlighted {
          color: #f59e0b;
          font-weight: 700;
        }
        .price-row.success {
          color: #10b981;
          font-weight: 700;
        }
        .btn-container {
          text-align: center;
          margin: 30px 0;
        }
        .btn {
          background-color: #f59e0b;
          color: #0f172a !important;
          text-decoration: none;
          padding: 14px 32px;
          border-radius: 9999px;
          font-weight: 700;
          font-size: 14px;
          display: inline-block;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
        }
        .instructions {
          font-size: 13.5px;
          color: #475569;
          line-height: 1.6;
          padding: 20px;
          background-color: #fcfcfd;
          border-left: 4px solid #f59e0b;
          border-radius: 0 10px 10px 0;
          border-top: 1px solid #edf2f7;
          border-right: 1px solid #edf2f7;
          border-bottom: 1px solid #edf2f7;
        }
        .instructions strong {
          color: #0f172a;
          display: inline-block;
          margin-bottom: 6px;
        }
        .footer {
          text-align: center;
          padding: 30px 20px;
          background-color: #f8fafc;
          border-top: 1px solid #e2e8f0;
          font-size: 12px;
          color: #64748b;
          line-height: 1.6;
        }
        .footer a {
          color: #f59e0b;
          text-decoration: none;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>AIRLANGGA TRAVEL</h1>
          <p>Eksplorasi Dunia dengan Kenyamanan Utama</p>
        </div>
        
        <div class="status-banner">
          <div class="status-text">
            ✓ Booking Dikonfirmasi — Pembayaran ${isDpPaid ? 'Uang Muka (DP) Terbayar' : 'Lunas'}
          </div>
        </div>

        <div class="content">
          <div class="greeting">
            Halo <strong>${booking.customerName}</strong>,<br><br>
            Terima kasih telah memesan perjalanan bersama Airlangga Travel. Reservasi Anda telah berhasil dikonfirmasi dengan rincian pembayaran di bawah ini.
          </div>

          <div class="booking-card">
            <div class="booking-code-label">KODE BOOKING</div>
            <div class="booking-code">${booking.bookingCode}</div>
            
            <div class="info-row">
              <span class="info-label">Paket Perjalanan</span>
              <span class="info-value">${booking.tripTitle}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Tanggal Keberangkatan</span>
              <span class="info-value">${booking.departureDate}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Jumlah Peserta</span>
              <span class="info-value">${booking.participants} Orang</span>
            </div>
            <div class="info-row">
              <span class="info-label">No. WhatsApp</span>
              <span class="info-value">${booking.whatsapp}</span>
            </div>

            <div class="price-section">
              <div class="price-row">
                <span class="info-label">Total Harga Paket</span>
                <span class="info-value">${formatPrice(booking.totalPrice)}</span>
              </div>
              
              ${isDpPaid ? `
                <div class="price-row success">
                  <span class="info-label">Uang Muka Terbayar (DP ${depositPercentage}%)</span>
                  <span class="info-value">${formatPrice(depositAmount)}</span>
                </div>
                <div class="price-row total highlighted">
                  <span class="price-label">Sisa Pelunasan</span>
                  <span class="price-value">${formatPrice(remainingAmount)}</span>
                </div>
              ` : `
                <div class="price-row total success">
                  <span class="price-label">Total Terbayar (Lunas)</span>
                  <span class="price-value">${formatPrice(booking.totalPrice)}</span>
                </div>
              `}
            </div>
          </div>

          <div class="btn-container">
            <a href="${trackLink}" class="btn" target="_blank">Lacak Status Pesanan</a>
          </div>

          ${isDpPaid ? `
            <div class="instructions">
              <strong>Langkah Selanjutnya (Pembayaran Uang Muka):</strong><br>
              Pembayaran Down Payment (DP) sebesar <strong>${depositPercentage}%</strong> telah kami terima. Silakan lakukan pelunasan sisa pembayaran sebesar <strong>${formatPrice(remainingAmount)}</strong> sebelum tanggal keberangkatan melalui halaman Lacak Pesanan di atas. Tim kami juga akan menghubungi Anda melalui WhatsApp untuk koordinasi perjalanan.
            </div>
          ` : `
            <div class="instructions">
              <strong>Langkah Selanjutnya (Pembayaran Lunas):</strong><br>
              Pemesanan Anda telah lunas sepenuhnya. Tim Customer Service kami akan segera menghubungi Anda melalui WhatsApp ke nomor <strong>${booking.whatsapp}</strong> untuk memberikan panduan detail perjalanan dan daftar perlengkapan yang perlu dipersiapkan.
            </div>
          `}
        </div>
        
        <div class="footer">
          &copy; ${new Date().getFullYear()} Airlangga Travel. All rights reserved.<br>
          Butuh bantuan? Hubungi <a href="https://wa.me/628111211143">WhatsApp Customer Service</a> kami.
        </div>
      </div>
    </body>
    </html>
  `

  if (isSimulation) {
    console.log(`
==================================================
[SIMULATION] EMAIL SENT SUCCESSFULLY
To: ${booking.email}
Subject: Konfirmasi Pemesanan - ${booking.bookingCode}
--------------------------------------------------
Link Lacak: ${trackLink}
Detail Booking:
  - Pelanggan: ${booking.customerName}
  - Paket: ${booking.tripTitle}
  - Total: ${formatPrice(booking.totalPrice)}
  - Status: ${booking.status}
  - Batas Bayar: ${booking.paymentDeadline}
==================================================
`)
    return { success: true, simulated: true }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Airlangga Travel <onboarding@resend.dev>', // resend testing domain
        to: [booking.email],
        subject: `[Airlangga Travel] Konfirmasi Booking ${booking.bookingCode}`,
        html: emailHtml,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Failed to send email via Resend API:', errorData)
      return { success: false, error: errorData }
    }

    const data = await response.json()
    console.log('Email sent successfully via Resend API:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error occurred while sending email:', error)
    return { success: false, error }
  }
}
