'use client'

import { Scale, Wifi, WifiOff, RefreshCw, CreditCard, ScanBarcode, TrendingUp, TrendingDown, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useWeight } from '@/hooks/useWeight'
import { useCart } from '@/contexts/CartContext'
import { useSocketContext } from '@/contexts/SocketContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { cn } from '@/lib/utils'

// Tolerance for weight comparison (kg)
const WEIGHT_TOLERANCE = 0.15

interface WeightDisplayProps {
  isCompact?: boolean
}

export function WeightDisplay({ isCompact = false }: WeightDisplayProps) {
  const {
    weight,
    isLoading,
    lastUpdated,
    isConnected,
    isSensorResponding,
    refetch,
  } = useWeight()

  const { expectedWeight, itemCount } = useCart()
  const { connectionError } = useSocketContext()
  const { t } = useLanguage()

  // Calculate weight difference and status
  const weightDiff = weight !== null ? weight - expectedWeight : null
  const isWeightMatching = weightDiff !== null && Math.abs(weightDiff) <= WEIGHT_TOLERANCE
  const isOverweight = weightDiff !== null && weightDiff > WEIGHT_TOLERANCE
  const isUnderweight = weightDiff !== null && weightDiff < -WEIGHT_TOLERANCE

  const formatTime = (date: Date | null) => {
    if (!date) return '--:--:--'
    return date.toLocaleTimeString()
  }

  // Compact layout for landscape tablet
  if (isCompact) {
    return (
      <Card className="w-full">
        <CardHeader className="py-2 pb-1">
          <CardTitle className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Scale className="w-4 h-4" />
              {t('status')}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={refetch}
              disabled={isLoading}
            >
              <RefreshCw className={cn('w-3 h-3', isLoading && 'animate-spin')} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="py-2 space-y-2">
          {/* Compact weight display */}
          <div className={cn(
            "p-2 rounded-lg border-2 transition-colors flex items-center justify-between gap-3",
            isWeightMatching && "bg-green-50 border-green-300 dark:bg-green-950/30 dark:border-green-800",
            isOverweight && "bg-amber-50 border-amber-300 dark:bg-amber-950/30 dark:border-amber-800",
            isUnderweight && "bg-red-50 border-red-300 dark:bg-red-950/30 dark:border-red-800",
            !weightDiff && "bg-muted border-transparent"
          )}>
            {/* Actual Weight */}
            <div className="text-center">
              <p className="text-[10px] text-muted-foreground uppercase">{t('actual')}</p>
              <p className={cn(
                "text-xl font-bold tabular-nums leading-tight",
                isWeightMatching && "text-green-600 dark:text-green-400",
                isOverweight && "text-amber-600 dark:text-amber-400",
                isUnderweight && "text-red-600 dark:text-red-400"
              )}>
                {weight !== null ? weight.toFixed(2) : '--.--'}
                <span className="text-xs font-normal ml-0.5">{t('kg')}</span>
              </p>
            </div>

            {/* Status Indicator */}
            {weightDiff !== null && (
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium shrink-0",
                isWeightMatching && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
                isOverweight && "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
                isUnderweight && "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
              )}>
                {isWeightMatching && <><Check className="w-3 h-3" /> {t('ok')}</>}
                {isOverweight && <><TrendingUp className="w-3 h-3" /> +{weightDiff.toFixed(2)}</>}
                {isUnderweight && <><TrendingDown className="w-3 h-3" /> {weightDiff.toFixed(2)}</>}
              </div>
            )}

            {/* Expected Weight */}
            <div className="text-center">
              <p className="text-[10px] text-muted-foreground uppercase">{t('expected')}</p>
              <p className="text-base font-semibold tabular-nums leading-tight">
                {expectedWeight.toFixed(2)}
                <span className="text-xs font-normal ml-0.5">{t('kg')}</span>
              </p>
              <p className="text-[10px] text-muted-foreground">{itemCount} {t('items')}</p>
            </div>
          </div>

          {/* Compact sensor status grid */}
          <div className="grid grid-cols-4 gap-1.5">
            <div className="flex flex-col items-center p-1 rounded bg-muted/50">
              {isConnected ? (
                <Wifi className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-red-500" />
              )}
              <span className="text-[9px] mt-0.5">{t('server')}</span>
            </div>
            <div className="flex flex-col items-center p-1 rounded bg-muted/50">
              <Scale className={cn("w-3.5 h-3.5", isSensorResponding ? "text-green-500" : "text-muted-foreground")} />
              <span className="text-[9px] mt-0.5">{t('scale')}</span>
            </div>
            <div className="flex flex-col items-center p-1 rounded bg-muted/50">
              <CreditCard className={cn("w-3.5 h-3.5", isConnected ? "text-green-500" : "text-muted-foreground")} />
              <span className="text-[9px] mt-0.5">{t('nfc')}</span>
            </div>
            <div className="flex flex-col items-center p-1 rounded bg-muted/50">
              <ScanBarcode className={cn("w-3.5 h-3.5", isConnected ? "text-green-500" : "text-muted-foreground")} />
              <span className="text-[9px] mt-0.5">{t('scanLabel')}</span>
            </div>
          </div>

          {/* Error Message */}
          {connectionError && (
            <div className="text-center text-[10px] text-red-500">
              {connectionError}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Full layout for desktop/portrait
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Scale className="w-5 h-5" />
            {t('sensorStatus')}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={refetch}
            disabled={isLoading}
          >
            <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Weight Display - Actual vs Expected */}
        <div className={cn(
          "p-4 rounded-lg border-2 transition-colors",
          isWeightMatching && "bg-green-50 border-green-300 dark:bg-green-950/30 dark:border-green-800",
          isOverweight && "bg-amber-50 border-amber-300 dark:bg-amber-950/30 dark:border-amber-800",
          isUnderweight && "bg-red-50 border-red-300 dark:bg-red-950/30 dark:border-red-800",
          !weightDiff && "bg-muted border-transparent"
        )}>
          {/* Actual Weight */}
          <div className="text-center mb-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('actualWeight')}</p>
            <p className={cn(
              "text-4xl font-bold tabular-nums",
              isWeightMatching && "text-green-600 dark:text-green-400",
              isOverweight && "text-amber-600 dark:text-amber-400",
              isUnderweight && "text-red-600 dark:text-red-400"
            )}>
              {weight !== null ? weight.toFixed(2) : '--.--.'}
            </p>
            <p className="text-sm text-muted-foreground">{t('kg')}</p>
          </div>

          {/* Divider */}
          <div className="border-t border-dashed my-3" />

          {/* Expected Weight */}
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <p className="text-xs text-muted-foreground">{t('expected')}</p>
              <p className="text-lg font-semibold tabular-nums">
                {expectedWeight.toFixed(2)} {t('kg')}
              </p>
              <p className="text-xs text-muted-foreground">{itemCount} {t('items')}</p>
            </div>

            {/* Status Indicator */}
            <div className="flex-1 flex justify-center">
              {weightDiff !== null && (
                <div className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                  isWeightMatching && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
                  isOverweight && "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
                  isUnderweight && "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                )}>
                  {isWeightMatching && <><Check className="w-3 h-3" /> {t('match')}</>}
                  {isOverweight && <><TrendingUp className="w-3 h-3" /> +{weightDiff.toFixed(2)}</>}
                  {isUnderweight && <><TrendingDown className="w-3 h-3" /> {weightDiff.toFixed(2)}</>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="space-y-2">
          {/* Server Connection */}
          <div className="flex items-center justify-between p-2 rounded bg-muted/50">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm">{t('server')}</span>
            </div>
            <Badge variant={isConnected ? 'success' : 'destructive'}>
              {isConnected ? t('connected') : t('disconnected')}
            </Badge>
          </div>

          {/* Weight Sensor */}
          <div className="flex items-center justify-between p-2 rounded bg-muted/50">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4" />
              <span className="text-sm">{t('weightSensor')}</span>
            </div>
            <Badge
              variant={
                isSensorResponding
                  ? 'success'
                  : isConnected
                  ? 'warning'
                  : 'secondary'
              }
            >
              {isSensorResponding
                ? t('active')
                : isConnected
                ? t('waiting')
                : t('offline')}
            </Badge>
          </div>

          {/* NFC Reader */}
          <div className="flex items-center justify-between p-2 rounded bg-muted/50">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="text-sm">{t('nfcReader')}</span>
            </div>
            <Badge variant={isConnected ? 'success' : 'secondary'}>
              {isConnected ? t('ready') : t('offline')}
            </Badge>
          </div>

          {/* Barcode Scanner */}
          <div className="flex items-center justify-between p-2 rounded bg-muted/50">
            <div className="flex items-center gap-2">
              <ScanBarcode className="w-4 h-4" />
              <span className="text-sm">{t('barcodeScanner')}</span>
            </div>
            <Badge variant={isConnected ? 'success' : 'secondary'}>
              {isConnected ? t('ready') : t('offline')}
            </Badge>
          </div>
        </div>

        {/* Last Update */}
        <div className="text-center text-xs text-muted-foreground">
          {t('lastUpdate')} {formatTime(lastUpdated)}
        </div>

        {/* Error Message */}
        {connectionError && (
          <div className="text-center text-xs text-red-500">
            {connectionError}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
