'use client'

import { Map, Maximize2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'

interface MapPreviewProps {
  onExpand: () => void
  className?: string
  isCompact?: boolean
}

export function MapPreview({ onExpand, className, isCompact = false }: MapPreviewProps) {
  const { t } = useLanguage()

  return (
    <Card
      className={cn(
        'w-full cursor-pointer hover:bg-accent/50 transition-colors group',
        className
      )}
      onClick={onExpand}
    >
      <CardHeader className={cn("pb-2", isCompact && "py-2")}>
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <Map className="w-4 h-4" />
            {t('storeMap')}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className={cn("opacity-60 group-hover:opacity-100 transition-opacity", isCompact ? "h-8 w-8" : "h-10 w-10")}
            onClick={(e) => {
              e.stopPropagation()
              onExpand()
            }}
            aria-label="Expand store map"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className={cn("pb-3", isCompact && "py-2")}>
        {/* Simplified store layout preview */}
        <div className={cn("bg-muted rounded-lg flex items-center justify-center relative overflow-hidden", isCompact ? "h-[70px]" : "h-[120px]")}>
          <div className="grid grid-cols-3 gap-1.5 p-3 w-full h-full">
            {/* Row 1 */}
            <div
              className="rounded-md transition-transform group-hover:scale-105"
              style={{ backgroundColor: 'rgba(90, 124, 90, 0.7)' }}
              title="Produce"
            />
            <div
              className="rounded-md transition-transform group-hover:scale-105"
              style={{ backgroundColor: 'rgba(122, 155, 181, 0.7)' }}
              title="Dairy"
            />
            <div
              className="rounded-md transition-transform group-hover:scale-105"
              style={{ backgroundColor: 'rgba(139, 107, 97, 0.7)' }}
              title="Meat"
            />
            {/* Row 2 */}
            <div
              className="rounded-md transition-transform group-hover:scale-105"
              style={{ backgroundColor: 'rgba(196, 165, 116, 0.7)' }}
              title="Bakery"
            />
            <div
              className="rounded-md transition-transform group-hover:scale-105"
              style={{ backgroundColor: 'rgba(143, 165, 181, 0.7)' }}
              title="Frozen"
            />
            <div
              className="rounded-md transition-transform group-hover:scale-105"
              style={{ backgroundColor: 'rgba(122, 139, 122, 0.7)' }}
              title="Beverages"
            />
          </div>
          {/* Overlay with tap instruction */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs text-white font-medium px-3 py-1.5 bg-black/50 rounded-full">
              {t('tapToExplore')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
