'use client'

import { ShoppingCart, Trash2, Plus, Minus, CreditCard, CheckCircle } from 'lucide-react'
import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/contexts/CartContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useNFCPayment } from '@/hooks/useNFCPayment'
import { cn } from '@/lib/utils'
import type { NFCPaymentData } from '@/types'

interface CartViewProps {
  isCompact?: boolean
}

export function CartView({ isCompact = false }: CartViewProps) {
  const { items, removeFromCart, updateQuantity, clearCart, total, itemCount } =
    useCart()
  const { t } = useLanguage()
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)

  const handlePaymentDetected = useCallback(
    (payment: NFCPaymentData) => {
      console.log('[CartView] Payment detected:', payment)

      // Show success message
      setShowPaymentSuccess(true)

      // Clear cart after payment
      setTimeout(() => {
        clearCart()
        setShowPaymentSuccess(false)
      }, 3000)
    },
    [clearCart]
  )

  const { paymentData, acknowledge, isNFCReady } = useNFCPayment({
    onPaymentDetected: handlePaymentDetected,
    enabled: itemCount > 0,
  })

  // Acknowledge payment after processing
  if (paymentData) {
    acknowledge(paymentData.paymentId)
  }

  if (showPaymentSuccess) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <h3 className="text-xl font-semibold text-green-600">
            {t('paymentSuccessful')}
          </h3>
          <p className="text-muted-foreground mt-2">{t('cartCleared')}</p>
        </CardContent>
      </Card>
    )
  }

  // Compact horizontal layout for landscape tablet
  if (isCompact) {
    return (
      <div className="flex items-center gap-4 p-2 bg-card rounded-lg border">
        {/* Cart Icon & Count */}
        <div className="flex items-center gap-2 shrink-0">
          <ShoppingCart className="w-5 h-5" />
          <Badge variant="secondary">{itemCount}</Badge>
        </div>

        {/* Items Preview - Scrollable horizontal */}
        {items.length === 0 ? (
          <span className="text-sm text-muted-foreground">{t('emptyCart')}</span>
        ) : (
          <div className="flex-1 flex items-center gap-2 overflow-x-auto">
            {items.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-1.5 px-2 py-1 bg-muted/50 rounded text-sm whitespace-nowrap shrink-0"
              >
                <span className="max-w-[80px] truncate">{item.name}</span>
                <span className="text-muted-foreground">×{item.quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-red-500 hover:text-red-600"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
            {items.length > 5 && (
              <span className="text-xs text-muted-foreground shrink-0">+{items.length - 5} more</span>
            )}
          </div>
        )}

        {/* Total & NFC */}
        {items.length > 0 && (
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{t('total')}</p>
              <p className="font-semibold tabular-nums">
                {total.toFixed(2)} {t('sar')}
              </p>
            </div>
            <div
              className={cn(
                'flex items-center gap-1 px-2 py-1.5 rounded border-2 border-dashed text-sm',
                isNFCReady
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 bg-gray-50 text-gray-500'
              )}
            >
              <CreditCard className="w-4 h-4" />
              <span>{isNFCReady ? 'Tap to Pay' : 'NFC Off'}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearCart}
            >
              Clear
            </Button>
          </div>
        )}
      </div>
    )
  }

  // Full vertical layout for desktop/portrait
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            {t('cart')}
          </span>
          <Badge variant="secondary">{itemCount} items</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>{t('emptyCart')}</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.price.toFixed(2)} {t('sar')}
                  </p>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>

                  <span className="w-8 text-center tabular-nums">
                    {item.quantity}
                  </span>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {items.length > 0 && (
        <CardFooter className="flex flex-col gap-4">
          <div className="w-full flex justify-between items-center text-lg font-semibold">
            <span>{t('total')}</span>
            <span>
              {total.toFixed(2)} {t('sar')}
            </span>
          </div>

          <div
            className={cn(
              'w-full p-4 rounded-lg border-2 border-dashed text-center transition-colors',
              isNFCReady
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-300 bg-gray-50 text-gray-500'
            )}
          >
            <CreditCard className="w-8 h-8 mx-auto mb-2" />
            <p className="font-medium">
              {isNFCReady ? t('tapCard') : 'NFC Offline'}
            </p>
            <p className="text-sm opacity-75">
              {isNFCReady ? 'Waiting for NFC card...' : 'Connect to pay'}
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={clearCart}
          >
            Clear Cart
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
