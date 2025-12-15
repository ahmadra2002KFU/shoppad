import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Declare global io type
declare global {
  var io: any
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate weight data
    if (typeof data.weight !== 'number' || isNaN(data.weight)) {
      return NextResponse.json(
        { success: false, error: 'Invalid weight value' },
        { status: 400 }
      )
    }

    // Round to 2 decimal places
    const roundedWeight = parseFloat(data.weight.toFixed(2))

    // Save to database
    const reading = await prisma.weightReading.create({
      data: {
        weight: roundedWeight,
        deviceId: data.deviceId || request.headers.get('x-forwarded-for') || 'unknown',
      },
    })

    // Broadcast to WebSocket clients
    const io = global.io
    if (io) {
      io.emit('weight:update', {
        weight: reading.weight,
        timestamp: reading.timestamp.toISOString(),
        deviceId: reading.deviceId,
      })
    }

    return NextResponse.json({
      success: true,
      weight: reading.weight,
      timestamp: reading.timestamp.toISOString(),
    })
  } catch (error) {
    console.error('Weight API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Get latest weight readings
    const readings = await prisma.weightReading.findMany({
      take: 100,
      orderBy: { timestamp: 'desc' },
    })

    return NextResponse.json({
      success: true,
      count: readings.length,
      data: readings,
    })
  } catch (error) {
    console.error('Weight GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
