// Magazine-related TypeScript types

export interface MagazineOffer {
  id: string
  item: {
    en: string
    ar: string
  }
  description?: {
    en: string
    ar: string
  }
  originalPrice: string
  discountedPrice: string
  discount: string
  category: string
  badge?: 'hot' | 'new' | 'bestseller'
  outOfStock?: boolean
}

export interface MagazineCategory {
  id: string
  name: {
    en: string
    ar: string
  }
  icon: string
  color: string
  offers: MagazineOffer[]
}

export interface MagazineModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}
