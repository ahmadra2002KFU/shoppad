'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSocket } from './useSocket'
import type { WeightData, WeightStats } from '@/types'

interface UseWeightReturn {
  weight: number | null
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
      setWeight(data.weight)
      setLastUpdated(new Date(data.timestamp))
      setIsSensorResponding(true)
      setIsLoading(false)
      setIsError(false)
      setError(null)

      // Update stats
      setStats((prev) => {
        const newWeight = data.weight
        if (!prev) {
          return {
            count: 1,
            average: newWeight,
            min: newWeight,
            max: newWeight,
            latest: newWeight,
          }
        }
        return {
          count: prev.count + 1,
          average: (prev.average * prev.count + newWeight) / (prev.count + 1),
          min: Math.min(prev.min, newWeight),
          max: Math.max(prev.max, newWeight),
          latest: newWeight,
        }
      })
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
        setWeight(latest.weight)
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
