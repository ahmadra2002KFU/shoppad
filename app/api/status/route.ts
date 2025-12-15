import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

declare global {
  var io: any
}

export async function GET() {
  try {
    // Get database stats
    const productCount = await prisma.product.count()
    const readingCount = await prisma.weightReading.count()

    // Get latest weight reading
    const latestReading = await prisma.weightReading.findFirst({
      orderBy: { timestamp: 'desc' },
    })

    // Get socket.io connection count
    const io = global.io
    const socketConnections = io?.sockets?.sockets?.size || 0

    return NextResponse.json({
      success: true,
      status: 'online',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      stats: {
        products: productCount,
        weightReadings: readingCount,
        socketConnections,
        latestWeight: latestReading?.weight || null,
        latestWeightTime: latestReading?.timestamp?.toISOString() || null,
      },
    })
  } catch (error) {
    console.error('Status API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
