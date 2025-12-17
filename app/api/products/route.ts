import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { category: 'asc' },
    })

    // Get unique categories with their Arabic translations
    const categoryMap = new Map<string, string>()
    products.forEach((p) => {
      if (!categoryMap.has(p.category)) {
        categoryMap.set(p.category, p.categoryAr || p.category)
      }
    })

    const categories = [...categoryMap.keys()]
    const categoryTranslations = Object.fromEntries(categoryMap)

    return NextResponse.json({
      success: true,
      count: products.length,
      categories,
      categoryTranslations,
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
