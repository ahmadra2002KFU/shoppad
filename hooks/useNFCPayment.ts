'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSocket } from './useSocket'
import type { NFCPaymentData } from '@/types'

interface UseNFCPaymentOptions {
  onPaymentDetected?: (payment: NFCPaymentData) => void
  enabled?: boolean
}

interface UseNFCPaymentReturn {
  paymentData: NFCPaymentData | null
  acknowledge: (paymentId: string) => void
  isConnected: boolean
  isNFCReady: boolean
}

export function useNFCPayment(options: UseNFCPaymentOptions = {}): UseNFCPaymentReturn {
  const { onPaymentDetected, enabled = true } = options
  const { isConnected, subscribe } = useSocket()
  const [paymentData, setPaymentData] = useState<NFCPaymentData | null>(null)
  const processedPayments = useRef<Set<string>>(new Set())

  const acknowledge = useCallback((paymentId: string) => {
    processedPayments.current.add(paymentId)
    setPaymentData(null)
  }, [])

  useEffect(() => {
    if (!enabled) return

    const unsubscribe = subscribe<NFCPaymentData>('nfc:payment', (data) => {
      // Only process if not already processed
      if (!processedPayments.current.has(data.paymentId)) {
        console.log('[NFC] Payment detected:', data.cardUID)
        setPaymentData(data)

        // Call callback if provided
        if (onPaymentDetected) {
          onPaymentDetected(data)
        }
      }
    })

    return unsubscribe
  }, [enabled, subscribe, onPaymentDetected])

  return {
    paymentData,
    acknowledge,
    isConnected,
    isNFCReady: isConnected,
  }
}
