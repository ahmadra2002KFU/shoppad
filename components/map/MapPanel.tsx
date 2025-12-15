'use client'

import { MapPreview } from './MapPreview'
import { MapModal } from './MapModal'
import { useMapPanel } from '@/hooks/useMapPanel'
import type { MapPanelProps } from '@/types/map'
import { cn } from '@/lib/utils'

export function MapPanel({ className }: MapPanelProps) {
  const { isExpanded, setIsExpanded, handleExpand } = useMapPanel()

  return (
    <div className={cn(className)}>
      {/* Collapsed State - Always rendered in sidebar */}
      <MapPreview onExpand={handleExpand} />

      {/* Expanded State - Modal */}
      <MapModal open={isExpanded} onOpenChange={setIsExpanded} />
    </div>
  )
}
