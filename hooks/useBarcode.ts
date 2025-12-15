'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSocket } from './useSocket'
import type { BarcodeScanData } from '@/types'

interface UseBarcodeReturn {
  scanData: BarcodeScanData | null
  acknowledge: (scanId: string) => void
  isConnected: boolean
}

export function useBarcode(): UseBarcodeReturn {
  const { isConnected, subscribe } = useSocket()
  const [scanData, setScanData] = useState<BarcodeScanData | null>(null)
  const processedScans = useRef<Set<string>>(new Set())

  const acknowledge = useCallback((scanId: string) => {
    processedScans.current.add(scanId)
    setScanData(null)
  }, [])

  useEffect(() => {
    const unsubscribe = subscribe<BarcodeScanData>('barcode:scan', (data) => {
      // Only process if not already processed
      if (!processedScans.current.has(data.scanId)) {
        console.log('[Barcode] Received scan:', data.barcode, data.product?.name)
        setScanData(data)
      }
    })

    return unsubscribe
  }, [subscribe])

  return {
    scanData,
    acknowledge,
    isConnected,
  }
}
