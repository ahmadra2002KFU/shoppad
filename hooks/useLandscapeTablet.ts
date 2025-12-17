'use client'

import { useState, useEffect } from 'react'

export function useLandscapeTablet() {
  const [isLandscapeTablet, setIsLandscapeTablet] = useState(false)

  useEffect(() => {
    const checkLandscapeTablet = () => {
      const isLandscape = window.innerWidth > window.innerHeight
      const isTabletHeight = window.innerHeight <= 850
      const isTabletWidth = window.innerWidth >= 768
      setIsLandscapeTablet(isLandscape && isTabletHeight && isTabletWidth)
    }

    // Check on mount
    checkLandscapeTablet()

    // Listen for resize and orientation changes
    window.addEventListener('resize', checkLandscapeTablet)
    window.addEventListener('orientationchange', checkLandscapeTablet)

    return () => {
      window.removeEventListener('resize', checkLandscapeTablet)
      window.removeEventListener('orientationchange', checkLandscapeTablet)
    }
  }, [])

  return isLandscapeTablet
}
