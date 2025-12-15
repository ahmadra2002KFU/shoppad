'use client'

import { Map, Maximize2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { MapPreviewProps } from '@/types/map'

export function MapPreview({ onExpand, className }: MapPreviewProps) {
  return (
    <Card
      className={cn(
        'w-full cursor-pointer hover:bg-accent/50 transition-colors group',
        className
      )}
      onClick={onExpand}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <Map className="w-4 h-4" />
            Store Map
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 opacity-60 group-hover:opacity-100 transition-opacity"
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
      <CardContent className="pb-3">
        {/* Simplified store layout preview */}
        <div className="h-[120px] bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
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
              Tap to explore
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
