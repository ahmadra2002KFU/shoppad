'use client'

import { MapPreview } from './MapPreview'
import { MapModal } from './MapModal'
import { useMapPanel } from '@/hooks/useMapPanel'
import { cn } from '@/lib/utils'

interface MapPanelProps {
  className?: string
  isCompact?: boolean
}

export function MapPanel({ className, isCompact = false }: MapPanelProps) {
  const { isExpanded, setIsExpanded, handleExpand } = useMapPanel()

  return (
    <div className={cn(className)}>
      {/* Collapsed State - Always rendered in sidebar */}
      <MapPreview onExpand={handleExpand} isCompact={isCompact} />

      {/* Expanded State - Modal */}
      <MapModal open={isExpanded} onOpenChange={setIsExpanded} />
    </div>
  )
}
