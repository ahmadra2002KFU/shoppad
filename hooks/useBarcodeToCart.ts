'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useBarcode } from './useBarcode'
import { useCart } from '@/contexts/CartContext'
import type { Product } from '@/types'

interface UseBarcodeToCartOptions {
  enabled?: boolean
  cooldownMs?: number
  onProductAdded?: (product: Product) => void
  onProductNotFound?: (barcode: string) => void
}

export function useBarcodeToCart(options: UseBarcodeToCartOptions = {}) {
  const {
    enabled = true,
    cooldownMs = 3000,
    onProductAdded,
    onProductNotFound,
  } = options

  const { scanData, acknowledge, isConnected } = useBarcode()
  const { addToCart } = useCart()
  const lastProcessedBarcode = useRef<string | null>(null)
  const lastProcessedTime = useRef<number>(0)

  const processBarcode = useCallback(
    (barcode: string, product: Product | null) => {
      const now = Date.now()

      // Check cooldown for same barcode
      if (
        barcode === lastProcessedBarcode.current &&
        now - lastProcessedTime.current < cooldownMs
      ) {
        console.log('[BarcodeToCart] Cooldown active, skipping:', barcode)
        return false
      }

      lastProcessedBarcode.current = barcode
      lastProcessedTime.current = now

      if (product) {
        addToCart(product)
        console.log('[BarcodeToCart] Added to cart:', product.name)
        onProductAdded?.(product)
        return true
      } else {
        console.log('[BarcodeToCart] Product not found:', barcode)
        onProductNotFound?.(barcode)
        return false
      }
    },
    [addToCart, cooldownMs, onProductAdded, onProductNotFound]
  )

  useEffect(() => {
    console.log('[BarcodeToCart] useEffect triggered, enabled:', enabled, 'scanData:', scanData)

    if (!enabled || !scanData) {
      console.log('[BarcodeToCart] Skipping - enabled:', enabled, 'has scanData:', !!scanData)
      return
    }

    const { scanId, barcode, product } = scanData
    console.log('[BarcodeToCart] Processing scan:', { scanId, barcode, productName: product?.name })

    // Process the barcode
    const added = processBarcode(barcode, product as Product | null)
    console.log('[BarcodeToCart] processBarcode result:', added)

    // Acknowledge the scan
    acknowledge(scanId)
  }, [enabled, scanData, acknowledge, processBarcode])

  return {
    isConnected,
    lastProcessedBarcode: lastProcessedBarcode.current,
  }
}
