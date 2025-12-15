import { NextRequest, NextResponse } from 'next/server'

declare global {
  var io: any
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate NFC data
    if (!data.cardUID) {
      return NextResponse.json(
        { success: false, error: 'Card UID is required' },
        { status: 400 }
      )
    }

    const paymentData = {
      paymentId: Date.now().toString(),
      cardUID: data.cardUID,
      weight: data.weight || 0,
      timestamp: new Date().toISOString(),
      trigger: data.trigger || 'nfc_detected',
      status: 'pending' as const,
    }

    // Broadcast to WebSocket clients
    const io = global.io
    if (io) {
      io.emit('nfc:payment', paymentData)
    }

    console.log(`[NFC] Payment triggered - Card: ${data.cardUID}, Weight: ${data.weight}kg`)

    return NextResponse.json({
      success: true,
      message: 'Payment trigger received',
      payment_successful: true,
      data: paymentData,
    })
  } catch (error) {
    console.error('NFC Payment API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
