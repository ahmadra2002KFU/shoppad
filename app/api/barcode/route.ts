import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

declare global {
  var io: any
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // DEBUG: Log raw received data
    console.log('[Barcode DEBUG] Raw data received:', JSON.stringify(data))
    console.log('[Barcode DEBUG] Barcode value:', JSON.stringify(data.barcode))
    console.log('[Barcode DEBUG] Barcode length:', data.barcode?.length)
    console.log('[Barcode DEBUG] Barcode char codes:', data.barcode ? [...data.barcode].map((c: string) => c.charCodeAt(0)) : 'N/A')

    // Clean the barcode - remove any control characters
    let cleanBarcode = data.barcode?.toString().trim().replace(/[\x00-\x1F\x7F]/g, '') || ''

    console.log('[Barcode DEBUG] Cleaned barcode:', JSON.stringify(cleanBarcode))

    // Validate barcode data
    if (!cleanBarcode) {
      return NextResponse.json(
        { success: false, error: 'Barcode is required' },
        { status: 400 }
      )
    }

    // Use cleaned barcode
    data.barcode = cleanBarcode

    // Look up product by barcode
    const product = await prisma.product.findUnique({
      where: { barcode: data.barcode },
    })

    const scanData = {
      scanId: Date.now().toString(),
      barcode: data.barcode,
      weight: data.weight || 0,
      timestamp: new Date().toISOString(),
      product: product
        ? {
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            barcode: product.barcode,
            weight: product.weight,
            image: product.image,
          }
        : null,
    }

    // Broadcast to WebSocket clients
    const io = global.io
    if (io) {
      io.emit('barcode:scan', scanData)
    }

    console.log(`[Barcode] Scanned: ${data.barcode} - Product: ${product?.name || 'Not found'}`)

    return NextResponse.json({
      success: true,
      message: 'Barcode scanned successfully',
      data: scanData,
    })
  } catch (error) {
    console.error('Barcode API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
