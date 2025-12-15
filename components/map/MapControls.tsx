'use client'

import { Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { MapControlsProps } from '@/types/map'

export function MapControls({ onZoomIn, onZoomOut, className }: MapControlsProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomIn}
        className="w-12 h-12 rounded-lg shadow-md"
        aria-label="Zoom in"
      >
        <Plus className="w-5 h-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomOut}
        className="w-12 h-12 rounded-lg shadow-md"
        aria-label="Zoom out"
      >
        <Minus className="w-5 h-5" />
      </Button>
    </div>
  )
}
