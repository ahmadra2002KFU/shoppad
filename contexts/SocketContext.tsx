'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useSocket } from '@/hooks/useSocket'

interface SocketContextType {
  isConnected: boolean
  connectionError: string | null
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export function SocketProvider({ children }: { children: ReactNode }) {
  const { isConnected, connectionError } = useSocket()

  return (
    <SocketContext.Provider value={{ isConnected, connectionError }}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocketContext() {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error('useSocketContext must be used within a SocketProvider')
  }
  return context
}
