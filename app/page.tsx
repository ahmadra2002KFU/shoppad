'use client'

import { useEffect, useState } from 'react'
import { ProductCard } from '@/components/ProductCard'
import { WeightDisplay } from '@/components/WeightDisplay'
import { CartView } from '@/components/CartView'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useBarcodeToCart } from '@/hooks/useBarcodeToCart'
import { useLanguage } from '@/contexts/LanguageContext'
import type { Product } from '@/types'

export default function ShoppingPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [isLoading, setIsLoading] = useState(true)
  const { language, setLanguage, t } = useLanguage()

  // Enable barcode to cart functionality
  useBarcodeToCart({
    enabled: true,
    onProductAdded: (product) => {
      console.log('[Page] Product added via barcode:', product.name)
    },
    onProductNotFound: (barcode) => {
      console.log('[Page] Product not found for barcode:', barcode)
    },
  })

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products')
        const data = await response.json()

        if (data.success) {
          setProducts(data.data)
          setCategories(['All', ...data.categories])
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filter products by category
  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold text-primary">ShopPad</h1>

          {/* Language Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={language === 'en' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLanguage('en')}
            >
              EN
            </Button>
            <Button
              variant={language === 'ar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLanguage('ar')}
            >
              AR
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Sensor Status */}
          <div className="lg:col-span-1 space-y-6">
            <WeightDisplay />
            <CartView />
          </div>

          {/* Main Content - Products */}
          <div className="lg:col-span-3">
            {/* Category Filter */}
            <div className="mb-6 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-muted animate-pulse rounded-lg"
                  />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>{t('noProducts')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-4 mt-8">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>ShopPad v5.0 - Smart Shopping with ESP32 Integration</p>
          <div className="mt-1 flex justify-center gap-2">
            <Badge variant="outline">WebSocket</Badge>
            <Badge variant="outline">Real-time</Badge>
            <Badge variant="outline">NFC Payments</Badge>
          </div>
        </div>
      </footer>
    </div>
  )
}
