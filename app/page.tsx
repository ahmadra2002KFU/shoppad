'use client'

import { useEffect, useState, useCallback } from 'react'
import { ProductCard } from '@/components/ProductCard'
import { WeightDisplay } from '@/components/WeightDisplay'
import { CartView } from '@/components/CartView'
import { MapPanel } from '@/components/map'
import { PaymentSuccessOverlay } from '@/components/PaymentSuccessOverlay'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useBarcodeToCart } from '@/hooks/useBarcodeToCart'
import { useNFCPayment } from '@/hooks/useNFCPayment'
import { useLanguage } from '@/contexts/LanguageContext'
import { useLandscapeTablet } from '@/hooks/useLandscapeTablet'
import type { Product, NFCPaymentData } from '@/types'

export default function ShoppingPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [isLoading, setIsLoading] = useState(true)
  const [activePayment, setActivePayment] = useState<NFCPaymentData | null>(null)
  const { language, setLanguage, t } = useLanguage()
  const isLandscapeTablet = useLandscapeTablet()

  // Handle NFC payment detection
  const handlePaymentDetected = useCallback((payment: NFCPaymentData) => {
    console.log('[Page] NFC Payment detected:', payment.cardUID)
    setActivePayment(payment)
  }, [])

  const handlePaymentClose = useCallback(() => {
    setActivePayment(null)
  }, [])

  // Enable NFC payment detection
  useNFCPayment({
    enabled: true,
    onPaymentDetected: handlePaymentDetected,
  })

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
        <div className={`container flex items-center justify-between px-4 ${isLandscapeTablet ? 'h-12' : 'h-16'}`}>
          <h1 className={`font-bold text-primary ${isLandscapeTablet ? 'text-xl' : 'text-2xl'}`}>ShopPad</h1>

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

      {/* Cart - Different placement based on viewport */}
      {isLandscapeTablet ? (
        /* Landscape Tablet: Horizontal cart strip below header */
        <div className="sticky top-12 z-40 bg-background border-b">
          <div className="container px-4 py-2">
            <CartView isCompact />
          </div>
        </div>
      ) : (
        /* Desktop: Fixed cart on right */
        <div className="hidden md:block fixed top-20 right-4 z-40 w-80 max-h-[calc(100vh-6rem)] overflow-auto">
          <CartView />
        </div>
      )}

      <main className={`container px-4 ${isLandscapeTablet ? 'py-3 pr-4' : 'py-6 md:pr-[22rem]'}`}>
        <div className={`grid gap-4 ${isLandscapeTablet ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-4 gap-6'}`}>

          {/* Status Panel - Horizontal in landscape, vertical sidebar otherwise */}
          <div className={isLandscapeTablet
            ? 'grid grid-cols-2 gap-3'
            : 'md:col-span-1 space-y-6'
          }>
            <WeightDisplay isCompact={isLandscapeTablet} />
            <MapPanel isCompact={isLandscapeTablet} />
            {/* Mobile Cart - shown only on small screens, not in landscape tablet */}
            {!isLandscapeTablet && (
              <div className="md:hidden">
                <CartView />
              </div>
            )}
          </div>

          {/* Main Content - Products */}
          <div className={isLandscapeTablet ? '' : 'md:col-span-3'}>
            {/* Category Filter */}
            <div className={`flex flex-wrap gap-2 ${isLandscapeTablet ? 'mb-3' : 'mb-6'}`}>
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
              <div className={`grid gap-4 ${isLandscapeTablet ? 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'}`}>
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
              <div className={`grid gap-4 ${isLandscapeTablet ? 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'}`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} isCompact={isLandscapeTablet} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer - Hidden in landscape tablet */}
      {!isLandscapeTablet && (
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
      )}

      {/* NFC Payment Success Overlay */}
      <PaymentSuccessOverlay
        payment={activePayment}
        onClose={handlePaymentClose}
        autoCloseDelay={5000}
      />
    </div>
  )
}
