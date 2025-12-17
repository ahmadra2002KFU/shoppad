'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { QRCodeSVG } from 'qrcode.react'
import { X, Receipt, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/contexts/LanguageContext'

interface ReceiptQRPanelProps {
  receiptId: string | null
  onExpire: () => void
  duration?: number // ms, default 180000 (3 minutes)
}

export function ReceiptQRPanel({
  receiptId,
  onExpire,
  duration = 180000,
}: ReceiptQRPanelProps) {
  const { t, isRTL } = useLanguage()
  const [timeRemaining, setTimeRemaining] = useState(duration)

  // Format time as mm:ss
  const formatTime = useCallback((ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }, [])

  // Countdown timer
  useEffect(() => {
    if (!receiptId) return

    setTimeRemaining(duration)

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1000) {
          clearInterval(interval)
          onExpire()
          return 0
        }
        return prev - 1000
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [receiptId, duration, onExpire])

  const handleClose = useCallback(() => {
    onExpire()
  }, [onExpire])

  return (
    <AnimatePresence>
      {receiptId && (
        <motion.div
          initial={{ opacity: 0, x: isRTL ? -20 : 20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: isRTL ? -20 : 20, scale: 0.95 }}
          transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
        >
          <Card className="w-full bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-emerald-800">
                <span className="flex items-center gap-2 text-base">
                  <Receipt className="w-5 h-5" />
                  {t('receipt')}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100"
                  onClick={handleClose}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col items-center gap-3 pt-0">
              {/* QR Code */}
              <div className="bg-white rounded-xl p-3 shadow-inner">
                <QRCodeSVG
                  value={receiptId}
                  size={100}
                  level="H"
                  bgColor="transparent"
                  fgColor="#059669"
                />
              </div>

              {/* Receipt ID */}
              <div className="text-center">
                <p className="text-xs text-emerald-600 mb-1">{t('receiptId')}</p>
                <p className="font-mono text-sm font-semibold text-emerald-800 tracking-wider">
                  {receiptId}
                </p>
              </div>

              {/* Countdown Timer */}
              <div className="flex items-center gap-1.5 text-emerald-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium tabular-nums">
                  {formatTime(timeRemaining)}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1 bg-emerald-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-500 rounded-full"
                  initial={{ width: '100%' }}
                  animate={{ width: `${(timeRemaining / duration) * 100}%` }}
                  transition={{ duration: 0.5, ease: 'linear' }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
