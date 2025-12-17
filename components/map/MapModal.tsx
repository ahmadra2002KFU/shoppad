'use client'

import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import dynamic from 'next/dynamic'
import type { MapModalProps } from '@/types/map'
import { useLanguage } from '@/contexts/LanguageContext'

// Dynamic import for SupermarketMap to avoid SSR issues with Three.js
const SupermarketMap = dynamic(
  () => import('./SupermarketMap').then((mod) => mod.SupermarketMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-4xl mb-3">🛒</div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    ),
  }
)

export function MapModal({ open, onOpenChange }: MapModalProps) {
  const { t } = useLanguage()
  // Detect if mobile screen size (using window.matchMedia for consistency with Tailwind's sm breakpoint)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 639px)')
    setIsMobile(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            {/* Overlay/Backdrop */}
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            </Dialog.Overlay>

            {/* Modal Content */}
            <Dialog.Content asChild>
              <motion.div
                className={cn(
                  'fixed z-50 bg-background rounded-xl shadow-2xl overflow-hidden',
                  // Desktop: centered modal positioning (transforms handled by motion)
                  'left-[50%] top-[50%]',
                  'w-[90vw] max-w-[1200px] h-[85vh] max-h-[800px]',
                  // Mobile: fullscreen
                  'max-sm:w-full max-sm:h-full max-sm:max-w-none max-sm:max-h-none',
                  'max-sm:rounded-none max-sm:left-0 max-sm:top-0'
                )}
                initial={{
                  opacity: 0,
                  scale: isMobile ? 1 : 0.95,
                  x: isMobile ? 0 : '-50%',
                  y: isMobile ? 0 : '-50%',
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: isMobile ? 0 : '-50%',
                  y: isMobile ? 0 : '-50%',
                }}
                exit={{
                  opacity: 0,
                  scale: isMobile ? 1 : 0.95,
                  x: isMobile ? 0 : '-50%',
                  y: isMobile ? 0 : '-50%',
                }}
                transition={{
                  type: 'spring',
                  duration: 0.3,
                  bounce: 0.2,
                }}
              >
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-background via-background/80 to-transparent">
                  <div className="flex items-center justify-between">
                    <div>
                      <Dialog.Title className="text-lg font-semibold">
                        {t('storeDirectory')}
                      </Dialog.Title>
                      <Dialog.Description className="text-sm text-muted-foreground">
                        {t('mapInstructions')}
                      </Dialog.Description>
                    </div>
                    <Dialog.Close asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 rounded-full shrink-0"
                        aria-label="Close map"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </Dialog.Close>
                  </div>
                </div>

                {/* Map Container */}
                <div className="w-full h-full pt-20">
                  <SupermarketMap
                    showSectionButtons={true}
                    showZoomControls={true}
                  />
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
