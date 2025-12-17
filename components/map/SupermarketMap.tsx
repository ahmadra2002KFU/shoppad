'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { SECTIONS } from './map-data'
import type { Section, SupermarketMapProps } from '@/types/map'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'

interface MeshRef {
  group: THREE.Group
  mainMesh: THREE.Mesh
  material: THREE.MeshStandardMaterial
}

export function SupermarketMap({
  onSectionSelect,
  selectedSection: externalSelectedSection,
  onHoverChange,
  showZoomControls = true,
  className,
}: SupermarketMapProps) {
  const { t, isRTL } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const meshesRef = useRef<Record<string, MeshRef>>({})
  const raycasterRef = useRef(new THREE.Raycaster())
  const mouseRef = useRef(new THREE.Vector2())

  const [internalSelectedSection, setInternalSelectedSection] = useState<Section | null>(null)
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Use external selected section if provided, otherwise use internal
  const selectedSection = externalSelectedSection !== undefined
    ? externalSelectedSection
    : internalSelectedSection

  const dragStartRef = useRef({ x: 0, y: 0 })
  const cameraAngleRef = useRef({ theta: Math.PI / 4, phi: Math.PI / 3 })
  const cameraDistanceRef = useRef(15)
  const targetRef = useRef(new THREE.Vector3(0, 0, 1))
  const lastPinchDistanceRef = useRef<number | null>(null)

  const updateCamera = useCallback(() => {
    if (!cameraRef.current) return
    const { theta, phi } = cameraAngleRef.current
    const distance = cameraDistanceRef.current

    cameraRef.current.position.x = targetRef.current.x + distance * Math.sin(phi) * Math.cos(theta)
    cameraRef.current.position.y = targetRef.current.y + distance * Math.cos(phi)
    cameraRef.current.position.z = targetRef.current.z + distance * Math.sin(phi) * Math.sin(theta)
    cameraRef.current.lookAt(targetRef.current)
  }, [])

  // Zoom handlers for external controls
  const handleZoomIn = useCallback(() => {
    cameraDistanceRef.current = Math.max(8, cameraDistanceRef.current - 2)
    updateCamera()
  }, [updateCamera])

  const handleZoomOut = useCallback(() => {
    cameraDistanceRef.current = Math.min(25, cameraDistanceRef.current + 2)
    updateCamera()
  }, [updateCamera])

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#f5f5f5')
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    cameraRef.current = camera
    updateCamera()

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(15, 25, 15)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    directionalLight.shadow.camera.near = 0.5
    directionalLight.shadow.camera.far = 50
    directionalLight.shadow.camera.left = -15
    directionalLight.shadow.camera.right = 15
    directionalLight.shadow.camera.top = 15
    directionalLight.shadow.camera.bottom = -15
    directionalLight.shadow.bias = -0.0001
    scene.add(directionalLight)

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3)
    fillLight.position.set(-10, 10, -10)
    scene.add(fillLight)

    // Floor
    const floorGeometry = new THREE.BoxGeometry(18, 0.2, 14)
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: '#e8e4e0',
      roughness: 0.9,
      metalness: 0.0,
    })
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.position.y = -0.1
    floor.position.z = 1
    floor.receiveShadow = true
    scene.add(floor)

    // Floor border
    const borderGeometry = new THREE.BoxGeometry(18.2, 0.05, 14.2)
    const borderMaterial = new THREE.MeshStandardMaterial({
      color: '#9ca3af',
      roughness: 0.5,
    })
    const border = new THREE.Mesh(borderGeometry, borderMaterial)
    border.position.y = 0.025
    border.position.z = 1
    scene.add(border)

    // Floor grid
    const tileSize = 2
    for (let x = -8; x <= 8; x += tileSize) {
      for (let z = -5; z <= 7; z += tileSize) {
        const lineGeo = new THREE.PlaneGeometry(0.02, tileSize)
        const lineMat = new THREE.MeshBasicMaterial({ color: '#d1d5db', side: THREE.DoubleSide })
        const lineV = new THREE.Mesh(lineGeo, lineMat)
        lineV.rotation.x = -Math.PI / 2
        lineV.position.set(x, 0.01, z + tileSize/2)
        scene.add(lineV)

        const lineH = new THREE.Mesh(lineGeo.clone(), lineMat)
        lineH.rotation.x = -Math.PI / 2
        lineH.rotation.z = Math.PI / 2
        lineH.position.set(x + tileSize/2, 0.01, z)
        scene.add(lineH)
      }
    }

    // Create sections
    SECTIONS.forEach((section) => {
      const group = new THREE.Group()

      // Base platform
      const baseGeometry = new THREE.BoxGeometry(section.size.w, 0.08, section.size.d)
      const baseMaterial = new THREE.MeshStandardMaterial({
        color: '#4a4a4a',
        roughness: 0.7,
        metalness: 0.1,
      })
      const base = new THREE.Mesh(baseGeometry, baseMaterial)
      base.position.y = 0.04
      base.castShadow = true
      base.receiveShadow = true
      group.add(base)

      // Main shelving unit
      const shelfHeight = 1.4
      const geometry = new THREE.BoxGeometry(section.size.w - 0.1, shelfHeight, section.size.d - 0.1)
      const material = new THREE.MeshStandardMaterial({
        color: section.color,
        roughness: 0.6,
        metalness: 0.05,
      })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.y = shelfHeight / 2 + 0.08
      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.userData = { sectionId: section.id }
      group.add(mesh)

      // Shelf layers
      const shelfLayers = 3
      for (let i = 1; i <= shelfLayers; i++) {
        const layerGeo = new THREE.BoxGeometry(section.size.w - 0.05, 0.03, section.size.d - 0.05)
        const layerMat = new THREE.MeshStandardMaterial({
          color: '#d4d4d4',
          roughness: 0.4,
          metalness: 0.2,
        })
        const layer = new THREE.Mesh(layerGeo, layerMat)
        layer.position.y = 0.08 + (shelfHeight / (shelfLayers + 1)) * i
        layer.castShadow = true
        group.add(layer)
      }

      // Top sign
      const signGeometry = new THREE.BoxGeometry(section.size.w * 0.8, 0.25, 0.08)
      const signMaterial = new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.3,
        metalness: 0.0,
      })
      const sign = new THREE.Mesh(signGeometry, signMaterial)
      sign.position.y = shelfHeight + 0.2
      sign.position.z = section.size.d / 2 - 0.1
      sign.castShadow = true
      group.add(sign)

      // Sign accent
      const accentGeo = new THREE.BoxGeometry(section.size.w * 0.8, 0.04, 0.1)
      const accentMat = new THREE.MeshStandardMaterial({
        color: section.color,
        roughness: 0.3,
      })
      const accent = new THREE.Mesh(accentGeo, accentMat)
      accent.position.y = shelfHeight + 0.34
      accent.position.z = section.size.d / 2 - 0.1
      group.add(accent)

      group.position.set(section.position.x, 0, section.position.z)
      scene.add(group)

      meshesRef.current[section.id] = { group, mainMesh: mesh, material }
    })

    // Entrance mat
    const entranceGeometry = new THREE.BoxGeometry(3.5, 0.02, 1.2)
    const entranceMaterial = new THREE.MeshStandardMaterial({
      color: '#4a5568',
      roughness: 0.9,
    })
    const entrance = new THREE.Mesh(entranceGeometry, entranceMaterial)
    entrance.position.set(0, 0.01, 7)
    entrance.receiveShadow = true
    scene.add(entrance)

    // Entrance text area
    const textBgGeo = new THREE.BoxGeometry(2.5, 0.01, 0.6)
    const textBgMat = new THREE.MeshStandardMaterial({ color: '#2d3748' })
    const textBg = new THREE.Mesh(textBgGeo, textBgMat)
    textBg.position.set(0, 0.02, 7)
    scene.add(textBg)

    // Shopping cart
    const cartBodyGeo = new THREE.BoxGeometry(0.4, 0.3, 0.6)
    const cartMat = new THREE.MeshStandardMaterial({ color: '#9ca3af', metalness: 0.6, roughness: 0.3 })
    const cartBody = new THREE.Mesh(cartBodyGeo, cartMat)
    cartBody.position.set(-2.5, 0.25, 6.5)
    cartBody.castShadow = true
    scene.add(cartBody)

    const cartHandleGeo = new THREE.BoxGeometry(0.4, 0.4, 0.03)
    const cartHandle = new THREE.Mesh(cartHandleGeo, cartMat)
    cartHandle.position.set(-2.5, 0.5, 6.2)
    cartHandle.castShadow = true
    scene.add(cartHandle)

    setIsLoaded(true)

    // Animation loop
    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId)
      renderer.dispose()
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [updateCamera])

  // Handle resize with ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (cameraRef.current && rendererRef.current && width > 0 && height > 0) {
          cameraRef.current.aspect = width / height
          cameraRef.current.updateProjectionMatrix()
          rendererRef.current.setSize(width, height)
        }
      }
    })

    resizeObserver.observe(containerRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  // Update mesh colors on hover
  useEffect(() => {
    Object.entries(meshesRef.current).forEach(([id, { material }]) => {
      const section = SECTIONS.find(s => s.id === id)
      if (section) {
        const targetColor = hoveredSection === id ? section.hoverColor : section.color
        material.color.set(targetColor)
      }
    })
  }, [hoveredSection])

  const getIntersectedSection = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current || !cameraRef.current || !sceneRef.current) return null

    const rect = containerRef.current.getBoundingClientRect()
    mouseRef.current.x = ((clientX - rect.left) / rect.width) * 2 - 1
    mouseRef.current.y = -((clientY - rect.top) / rect.height) * 2 + 1

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current)

    const meshes = Object.values(meshesRef.current).map(m => m.mainMesh)
    const intersects = raycasterRef.current.intersectObjects(meshes)

    if (intersects.length > 0) {
      return intersects[0].object.userData.sectionId as string
    }
    return null
  }, [])

  const handlePointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

    dragStartRef.current = { x: clientX, y: clientY }
    setIsDragging(false)
  }, [])

  const handlePointerMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // For touch events, check if there are active touches
    const isTouchEvent = 'touches' in e
    if (isTouchEvent && e.touches.length === 0) return

    const clientX = isTouchEvent ? e.touches[0].clientX : e.clientX
    const clientY = isTouchEvent ? e.touches[0].clientY : e.clientY

    // For mouse: check buttons, for touch: always consider pressed during touchmove
    const isPressed = isTouchEvent ? true : (e as React.MouseEvent).buttons > 0

    if (isPressed) {
      const deltaX = clientX - dragStartRef.current.x
      const deltaY = clientY - dragStartRef.current.y

      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        setIsDragging(true)
      }

      cameraAngleRef.current.theta += deltaX * 0.01
      cameraAngleRef.current.phi = Math.max(0.3, Math.min(Math.PI / 2.2, cameraAngleRef.current.phi - deltaY * 0.01))

      dragStartRef.current = { x: clientX, y: clientY }
      updateCamera()
    } else {
      const sectionId = getIntersectedSection(clientX, clientY)
      setHoveredSection(sectionId)
      onHoverChange?.(sectionId)
    }
  }, [updateCamera, getIntersectedSection, onHoverChange])

  const handlePointerUp = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) {
      const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX
      const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY

      const sectionId = getIntersectedSection(clientX, clientY)
      if (sectionId) {
        const section = SECTIONS.find(s => s.id === sectionId) || null
        if (onSectionSelect) {
          onSectionSelect(section)
        } else {
          setInternalSelectedSection(section)
        }
      }
    }
    setIsDragging(false)
  }, [isDragging, getIntersectedSection, onSectionSelect])

  // Wheel zoom handler - needs to be attached manually with passive: false
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    cameraDistanceRef.current = Math.max(8, Math.min(25, cameraDistanceRef.current + e.deltaY * 0.01))
    updateCamera()
  }, [updateCamera])

  // Attach wheel listener with passive: false to allow preventDefault
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  // Native touch handlers for proper preventDefault support
  const handleNativeTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0]
      dragStartRef.current = { x: touch.clientX, y: touch.clientY }
      setIsDragging(false)
    }
  }, [])

  const handleNativeTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault() // Prevent browser scrolling/zooming

    if (e.touches.length === 1) {
      // Single finger - rotation
      const touch = e.touches[0]
      const deltaX = touch.clientX - dragStartRef.current.x
      const deltaY = touch.clientY - dragStartRef.current.y

      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        setIsDragging(true)
      }

      cameraAngleRef.current.theta += deltaX * 0.01
      cameraAngleRef.current.phi = Math.max(0.3, Math.min(Math.PI / 2.2, cameraAngleRef.current.phi - deltaY * 0.01))

      dragStartRef.current = { x: touch.clientX, y: touch.clientY }
      updateCamera()
    } else if (e.touches.length === 2) {
      // Two fingers - pinch zoom
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (lastPinchDistanceRef.current === null) {
        lastPinchDistanceRef.current = distance
        return
      }

      const delta = lastPinchDistanceRef.current - distance
      cameraDistanceRef.current = Math.max(8, Math.min(25, cameraDistanceRef.current + delta * 0.05))
      lastPinchDistanceRef.current = distance
      updateCamera()
    }
  }, [updateCamera])

  const handleNativeTouchEnd = useCallback((e: TouchEvent) => {
    lastPinchDistanceRef.current = null

    if (!isDragging && e.changedTouches.length > 0) {
      const touch = e.changedTouches[0]
      const sectionId = getIntersectedSection(touch.clientX, touch.clientY)
      if (sectionId) {
        const section = SECTIONS.find(s => s.id === sectionId) || null
        if (onSectionSelect) {
          onSectionSelect(section)
        } else {
          setInternalSelectedSection(section)
        }
      }
    }
    setIsDragging(false)
  }, [isDragging, getIntersectedSection, onSectionSelect])

  // Attach native touch listeners with passive: false to allow preventDefault
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('touchstart', handleNativeTouchStart, { passive: false })
    container.addEventListener('touchmove', handleNativeTouchMove, { passive: false })
    container.addEventListener('touchend', handleNativeTouchEnd, { passive: false })

    return () => {
      container.removeEventListener('touchstart', handleNativeTouchStart)
      container.removeEventListener('touchmove', handleNativeTouchMove)
      container.removeEventListener('touchend', handleNativeTouchEnd)
    }
  }, [handleNativeTouchStart, handleNativeTouchMove, handleNativeTouchEnd])


  const handleCloseDetails = useCallback(() => {
    if (onSectionSelect) {
      onSectionSelect(null)
    } else {
      setInternalSelectedSection(null)
    }
  }, [onSectionSelect])

  return (
    <div className={cn('w-full h-full bg-gray-100 overflow-hidden relative', className)}>
      {/* 3D Canvas */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={() => {
          setHoveredSection(null)
          onHoverChange?.(null)
        }}
        // Touch events are handled via native addEventListener with { passive: false }
        // to allow preventDefault() and block browser's default touch behaviors
      />

      {/* Hovered Section Indicator */}
      {hoveredSection && !selectedSection && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
          <div
            className="px-4 py-2 rounded-lg text-white font-medium shadow-lg text-sm"
            style={{ backgroundColor: SECTIONS.find(s => s.id === hoveredSection)?.color }}
          >
            {SECTIONS.find(s => s.id === hoveredSection)?.icon} {t('tapToViewOffers')}
          </div>
        </div>
      )}

      {/* Detail Panel */}
      {selectedSection && (
        <div
          className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
          onClick={handleCloseDetails}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Panel Header */}
            <div
              className="p-5 text-white"
              style={{ backgroundColor: selectedSection.color }}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedSection.icon}</span>
                <div>
                  <h2 className="text-xl font-semibold">{selectedSection.name}</h2>
                  <p className="text-white/80 text-sm">{t('todaysSpecialOffers')}</p>
                </div>
              </div>
            </div>

            {/* Offers List */}
            <div className="p-4 space-y-2">
              {selectedSection.offers.map((offer, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <div>
                    <h3 className="font-medium text-gray-800">{offer.item}</h3>
                    <p className="text-sm text-gray-500">{offer.price}</p>
                  </div>
                  <div
                    className="px-3 py-1 rounded-full text-white text-xs font-semibold"
                    style={{ backgroundColor: selectedSection.color }}
                  >
                    {offer.discount}
                  </div>
                </div>
              ))}
            </div>

            {/* Close Button */}
            <div className="p-4 pt-2">
              <button
                onClick={handleCloseDetails}
                className="w-full py-3 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors min-h-[48px]"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Zoom Controls */}
      {showZoomControls && (
        <div className={`absolute bottom-4 z-10 flex flex-col gap-2 ${isRTL ? 'left-4' : 'right-4'}`}>
          <button
            onClick={handleZoomIn}
            className="w-12 h-12 rounded-lg bg-white text-gray-700 text-xl font-medium hover:bg-gray-50 transition-colors shadow-md border border-gray-200 flex items-center justify-center"
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="w-12 h-12 rounded-lg bg-white text-gray-700 text-xl font-medium hover:bg-gray-50 transition-colors shadow-md border border-gray-200 flex items-center justify-center"
            aria-label="Zoom out"
          >
            −
          </button>
        </div>
      )}

      {/* Loading State */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="text-4xl mb-3">🛒</div>
            <p className="text-gray-600 font-medium">{t('loadingStoreMap')}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default SupermarketMap
