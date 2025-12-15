'use client'

import { CartProvider } from '@/contexts/CartContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { SocketProvider } from '@/contexts/SocketContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SocketProvider>
      <LanguageProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </LanguageProvider>
    </SocketProvider>
  )
}
