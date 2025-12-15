'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Only create socket once
    if (!socket) {
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || ''

      socket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
      })
    }

    socketRef.current = socket

    const onConnect = () => {
      console.log('[Socket] Connected:', socket?.id)
      setIsConnected(true)
      setConnectionError(null)
    }

    const onDisconnect = (reason: string) => {
      console.log('[Socket] Disconnected:', reason)
      setIsConnected(false)
    }

    const onConnectError = (error: Error) => {
      console.error('[Socket] Connection error:', error.message)
      setConnectionError(error.message)
      setIsConnected(false)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('connect_error', onConnectError)

    // Check current state
    if (socket.connected) {
      setIsConnected(true)
    }

    return () => {
      socket?.off('connect', onConnect)
      socket?.off('disconnect', onDisconnect)
      socket?.off('connect_error', onConnectError)
    }
  }, [])

  const subscribe = useCallback(
    <T>(event: string, callback: (data: T) => void) => {
      if (socket) {
        socket.on(event, callback)
        return () => {
          socket?.off(event, callback)
        }
      }
      return () => {}
    },
    []
  )

  const emit = useCallback((event: string, data: any) => {
    if (socket) {
      socket.emit(event, data)
    }
  }, [])

  return {
    socket: socketRef.current,
    isConnected,
    connectionError,
    subscribe,
    emit,
  }
}
