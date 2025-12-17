'use client'

import React, { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'motion/react'
import { X, Newspaper } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'
import { MAGAZINE_CATEGORIES, getValidUntilDate } from './magazine-data'
import type { MagazineModalProps } from '@/types/magazine'

export function MagazineModal({ open, onOpenChange }: MagazineModalProps) {
  const { t, language, isRTL } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 639px)')
    setIsMobile(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Reset selected category when modal closes
  useEffect(() => {
    if (!open) {
      setSelectedCategory(null)
    }
  }, [open])

  const filteredCategories = selectedCategory
    ? MAGAZINE_CATEGORIES.filter((c) => c.id === selectedCategory)
    : MAGAZINE_CATEGORIES

  const getBadgeLabel = (badge: string, outOfStock?: boolean) => {
    if (outOfStock) return t('outOfStock')
    switch (badge) {
      case 'hot':
        return t('hotDeal')
      case 'new':
        return t('newArrival')
      case 'bestseller':
        return t('bestSeller')
      default:
        return ''
    }
  }

  const getBadgeColor = (badge: string, outOfStock?: boolean) => {
    if (outOfStock) return 'bg-gray-500'
    switch (badge) {
      case 'hot':
        return 'bg-red-500'
      case 'new':
        return 'bg-blue-500'
      case 'bestseller':
        return 'bg-amber-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            {/* Overlay/Backdrop */}
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            </Dialog.Overlay>

            {/* Modal Content */}
            <Dialog.Content asChild>
              <motion.div
                className={cn(
                  'fixed z-50 bg-background rounded-xl shadow-2xl overflow-hidden flex flex-col',
                  'left-[50%] top-[50%]',
                  'w-[90vw] max-w-[900px] h-[85vh] max-h-[700px]',
                  'max-sm:w-full max-sm:h-full max-sm:max-w-none max-sm:max-h-none',
                  'max-sm:rounded-none max-sm:left-0 max-sm:top-0'
                )}
                initial={{
                  opacity: 0,
                  scale: isMobile ? 1 : 0.95,
                  x: isMobile ? 0 : '-50%',
                  y: isMobile ? 0 : '-50%',
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: isMobile ? 0 : '-50%',
                  y: isMobile ? 0 : '-50%',
                }}
                exit={{
                  opacity: 0,
                  scale: isMobile ? 1 : 0.95,
                  x: isMobile ? 0 : '-50%',
                  y: isMobile ? 0 : '-50%',
                }}
                transition={{
                  type: 'spring',
                  duration: 0.3,
                  bounce: 0.2,
                }}
              >
                {/* Header */}
                <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Newspaper className="w-7 h-7" />
                      <div>
                        <Dialog.Title className="text-lg font-semibold">
                          {t('weeklyMagazine')}
                        </Dialog.Title>
                        <Dialog.Description className="text-sm text-white/80">
                          {t('validUntil')} {getValidUntilDate()}
                        </Dialog.Description>
                      </div>
                    </div>
                    <Dialog.Close asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full text-white hover:bg-white/20 shrink-0"
                        aria-label="Close"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </Dialog.Close>
                  </div>
                </div>

                {/* Category Filter Pills */}
                <div className="p-3 border-b bg-muted/30 shrink-0 overflow-x-auto">
                  <div className="flex gap-2 min-w-max">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap',
                        selectedCategory === null
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      )}
                    >
                      {t('allCategories')}
                    </button>
                    {MAGAZINE_CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5',
                          selectedCategory === category.id
                            ? 'text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        )}
                        style={{
                          backgroundColor:
                            selectedCategory === category.id
                              ? category.color
                              : undefined,
                        }}
                      >
                        <span>{category.icon}</span>
                        <span>{category.name[language]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Offers List */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-6">
                    {filteredCategories.map((category) => (
                      <div key={category.id}>
                        {/* Category Header */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">{category.icon}</span>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {category.name[language]}
                          </h3>
                        </div>

                        {/* Offers Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {category.offers.map((offer) => (
                            <div
                              key={offer.id}
                              className={cn(
                                'relative p-4 rounded-xl bg-white border border-gray-100 shadow-sm transition-shadow',
                                offer.outOfStock
                                  ? 'opacity-60 grayscale'
                                  : 'hover:shadow-md'
                              )}
                            >
                              {/* Badge */}
                              {(offer.badge || offer.outOfStock) && (
                                <span
                                  className={cn(
                                    'absolute top-2 text-xs font-bold text-white px-2 py-0.5 rounded-full',
                                    getBadgeColor(offer.badge || '', offer.outOfStock),
                                    isRTL ? 'left-2' : 'right-2'
                                  )}
                                >
                                  {getBadgeLabel(offer.badge || '', offer.outOfStock)}
                                </span>
                              )}

                              {/* Item Details */}
                              <div className="mb-2">
                                <h4 className={cn(
                                  'font-semibold',
                                  offer.outOfStock ? 'text-gray-500' : 'text-gray-800'
                                )}>
                                  {offer.item[language]}
                                </h4>
                                {offer.description && (
                                  <p className="text-sm text-gray-500">
                                    {offer.description[language]}
                                  </p>
                                )}
                              </div>

                              {/* Price Section */}
                              <div className="flex items-center justify-between mt-3">
                                {offer.outOfStock ? (
                                  <span className="text-lg font-bold text-gray-400 line-through">
                                    {offer.originalPrice} {t('sar')}
                                  </span>
                                ) : (
                                  <>
                                    <div className="flex items-baseline gap-2">
                                      <span className="text-lg font-bold text-green-600">
                                        {offer.discountedPrice} {t('sar')}
                                      </span>
                                      <span className="text-sm text-gray-400 line-through">
                                        {offer.originalPrice} {t('sar')}
                                      </span>
                                    </div>
                                    <span
                                      className="px-2 py-1 rounded-lg text-white text-sm font-bold"
                                      style={{ backgroundColor: category.color }}
                                    >
                                      -{offer.discount}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-muted/30 shrink-0">
                  <p className="text-center text-sm text-muted-foreground">
                    {t('limitedTime')} - {t('validUntil')} {getValidUntilDate()}
                  </p>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
