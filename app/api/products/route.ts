import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { category: 'asc' },
    })

    // Get unique categories
    const categories = [...new Set(products.map((p) => p.category))]

    return NextResponse.json({
      success: true,
      count: products.length,
      categories,
      data: products,
    })
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
