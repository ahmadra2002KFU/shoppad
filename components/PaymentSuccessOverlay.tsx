'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { CheckCircle2, CreditCard, X } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from '@/components/ui/button'
import type { NFCPaymentData } from '@/types'

interface PaymentSuccessOverlayProps {
  payment: NFCPaymentData | null
  onClose: () => void
  autoCloseDelay?: number // ms, default 5000
}

export function PaymentSuccessOverlay({
  payment,
  onClose,
  autoCloseDelay = 5000,
}: PaymentSuccessOverlayProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (payment) {
      setIsVisible(true)

      // Auto-close after delay
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Wait for exit animation
      }, autoCloseDelay)

      return () => clearTimeout(timer)
    }
  }, [payment, autoCloseDelay, onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  return (
    <AnimatePresence>
      {payment && isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Content */}
          <motion.div
            className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 shadow-2xl max-w-md w-full text-white overflow-hidden"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{
              type: 'spring',
              duration: 0.5,
              bounce: 0.3,
            }}
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full"
              onClick={handleClose}
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Animated checkmark */}
              <motion.div
                className="relative mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  delay: 0.2,
                  duration: 0.6,
                  bounce: 0.5,
                }}
              >
                {/* Ripple effects */}
                <motion.div
                  className="absolute inset-0 bg-white/30 rounded-full"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatDelay: 0.5,
                  }}
                />
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-full"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{
                    duration: 1,
                    delay: 0.3,
                    repeat: Infinity,
                    repeatDelay: 0.5,
                  }}
                />

                {/* Checkmark icon */}
                <div className="relative bg-white rounded-full p-4">
                  <motion.div
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <CheckCircle2 className="w-16 h-16 text-green-500" strokeWidth={2.5} />
                  </motion.div>
                </div>
              </motion.div>

              {/* Success text */}
              <motion.h2
                className="text-3xl font-bold mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Payment Successful!
              </motion.h2>

              <motion.p
                className="text-white/80 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Your NFC card has been processed
              </motion.p>

              {/* Card info */}
              <motion.div
                className="bg-white/20 rounded-2xl p-4 w-full backdrop-blur-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-white/20 rounded-lg p-2">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-white/70">Card ID</p>
                    <p className="font-mono font-semibold tracking-wider">
                      {payment.cardUID}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-white/20">
                  <span className="text-sm text-white/70">Transaction ID</span>
                  <span className="font-mono text-sm">#{payment.paymentId}</span>
                </div>
              </motion.div>

              {/* QR Code with RFID Tag ID */}
              <motion.div
                className="bg-white rounded-2xl p-4 mt-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, type: 'spring', bounce: 0.3 }}
              >
                <QRCodeSVG
                  value={payment.cardUID}
                  size={120}
                  level="H"
                  className="mx-auto"
                  bgColor="transparent"
                  fgColor="#059669"
                />
                <p className="text-xs text-emerald-700 mt-2 font-medium">
                  Scan for receipt
                </p>
              </motion.div>

              {/* Auto-close indicator */}
              <motion.div
                className="mt-6 w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <p className="text-sm text-white/60 mb-2">Auto-closing in a moment...</p>
                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white/60 rounded-full"
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{
                      duration: autoCloseDelay / 1000,
                      ease: 'linear',
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
