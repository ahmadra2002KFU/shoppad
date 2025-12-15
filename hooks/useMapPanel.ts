'use client'

import { useState, useCallback } from 'react'
import type { Section } from '@/types/map'

export interface UseMapPanelReturn {
  // Panel state
  isExpanded: boolean
  setIsExpanded: (expanded: boolean) => void

  // Map interaction state
  selectedSection: Section | null
  setSelectedSection: (section: Section | null) => void
  hoveredSection: string | null
  setHoveredSection: (sectionId: string | null) => void

  // Actions
  handleExpand: () => void
  handleCollapse: () => void
  handleSectionClick: (section: Section) => void
}

export function useMapPanel(): UseMapPanelReturn {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedSection, setSelectedSection] = useState<Section | null>(null)
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)

  const handleExpand = useCallback(() => {
    setIsExpanded(true)
  }, [])

  const handleCollapse = useCallback(() => {
    setIsExpanded(false)
    setSelectedSection(null)
  }, [])

  const handleSectionClick = useCallback((section: Section) => {
    setSelectedSection(section)
  }, [])

  return {
    isExpanded,
    setIsExpanded,
    selectedSection,
    setSelectedSection,
    hoveredSection,
    setHoveredSection,
    handleExpand,
    handleCollapse,
    handleSectionClick,
  }
}
