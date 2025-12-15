'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSocket } from './useSocket'
import type { WeightData, WeightStats } from '@/types'

// Sanitize weight: ensure positive only (no cap - let actual reading show)
function sanitizeWeight(rawWeight: number | null | undefined): number | null {
  if (rawWeight === null || rawWeight === undefined || isNaN(rawWeight)) {
    return null
  }
  // Only ensure positive, no cap
  return Math.abs(rawWeight)
}

interface UseWeightReturn {
  weight: number | null
  rawWeight: number | null // Original value from sensor
  isLoading: boolean
  isError: boolean
  error: string | null
  lastUpdated: Date | null
  stats: WeightStats | null
  isConnected: boolean
  isSensorResponding: boolean
  refetch: () => Promise<void>
}

export function useWeight(): UseWeightReturn {
  const { isConnected, subscribe } = useSocket()
  const [rawWeight, setRawWeight] = useState<number | null>(null)
  const [weight, setWeight] = useState<number | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isSensorResponding, setIsSensorResponding] = useState(false)
  const [stats, setStats] = useState<WeightStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Timeout to detect if sensor stopped sending data
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (lastUpdated) {
        const timeSinceLastUpdate = Date.now() - lastUpdated.getTime()
        if (timeSinceLastUpdate > 5000) {
          setIsSensorResponding(false)
        }
      }
    }, 5000)

    return () => clearTimeout(timeout)
  }, [lastUpdated])

  // Subscribe to weight updates
  useEffect(() => {
    const unsubscribe = subscribe<WeightData>('weight:update', (data) => {
      const raw = data.weight
      const sanitized = sanitizeWeight(raw)

      setRawWeight(raw ?? null)
      setWeight(sanitized)
      setLastUpdated(new Date(data.timestamp))
      setIsSensorResponding(true)
      setIsLoading(false)
      setIsError(false)
      setError(null)

      // Update stats with sanitized weight (only if valid)
      if (sanitized !== null) {
        setStats((prev) => {
          if (!prev) {
            return {
              count: 1,
              average: sanitized,
              min: sanitized,
              max: sanitized,
              latest: sanitized,
            }
          }
          return {
            count: prev.count + 1,
            average: (prev.average * prev.count + sanitized) / (prev.count + 1),
            min: Math.min(prev.min, sanitized),
            max: Math.max(prev.max, sanitized),
            latest: sanitized,
          }
        })
      }
    })

    return unsubscribe
  }, [subscribe])

  // Update connection state
  useEffect(() => {
    if (!isConnected) {
      setIsError(true)
      setError('Disconnected from server')
    } else {
      setIsError(false)
      setError(null)
    }
    setIsLoading(!isConnected)
  }, [isConnected])

  const refetch = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/weight')
      const data = await response.json()

      if (data.success && data.data && data.data.length > 0) {
        const latest = data.data[0]
        const raw = latest.weight
        const sanitized = sanitizeWeight(raw)

        setRawWeight(raw)
        setWeight(sanitized)
        setLastUpdated(new Date(latest.timestamp))
        setIsSensorResponding(true)
      }
      setIsLoading(false)
    } catch (err) {
      setIsError(true)
      setError('Failed to fetch weight data')
      setIsLoading(false)
    }
  }, [])

  return {
    weight,
    rawWeight,
    isLoading,
    isError,
    error,
    lastUpdated,
    stats,
    isConnected,
    isSensorResponding,
    refetch,
  }
}
