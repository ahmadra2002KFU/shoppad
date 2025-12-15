// Map-related TypeScript types

export interface SectionOffer {
  item: string
  discount: string
  price: string
}

export interface Section {
  id: string
  name: string
  color: string
  hoverColor: string
  position: { x: number; z: number }
  size: { w: number; d: number }
  icon: string
  offers: SectionOffer[]
}

export interface SupermarketMapProps {
  onSectionSelect?: (section: Section | null) => void
  selectedSection?: Section | null
  hoveredSection?: string | null
  onHoverChange?: (sectionId: string | null) => void
  showSectionButtons?: boolean
  showZoomControls?: boolean
  className?: string
}

export interface MapPanelProps {
  className?: string
}

export interface MapPreviewProps {
  onExpand: () => void
  className?: string
}

export interface MapModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export interface MapControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  className?: string
}
