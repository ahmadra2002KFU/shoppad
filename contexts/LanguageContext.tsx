'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

type Language = 'en' | 'ar'

interface Translations {
  [key: string]: {
    en: string
    ar: string
  }
}

const translations: Translations = {
  // Navigation
  shopping: { en: 'Shopping', ar: 'التسوق' },
  cart: { en: 'Cart', ar: 'السلة' },
  checkout: { en: 'Checkout', ar: 'الدفع' },

  // Products
  addToCart: { en: 'Add to Cart', ar: 'أضف إلى السلة' },
  removeFromCart: { en: 'Remove', ar: 'إزالة' },
  price: { en: 'Price', ar: 'السعر' },
  quantity: { en: 'Quantity', ar: 'الكمية' },
  total: { en: 'Total', ar: 'المجموع' },
  sar: { en: 'SAR', ar: 'ر.س' },

  // Categories
  freshProduce: { en: 'Fresh Produce', ar: 'المنتجات الطازجة' },
  dairyBakery: { en: 'Dairy & Bakery', ar: 'الألبان والمخبوزات' },
  beverages: { en: 'Beverages', ar: 'المشروبات' },
  pantryStaples: { en: 'Pantry Staples', ar: 'المواد الغذائية الأساسية' },
  household: { en: 'Household', ar: 'المنزلية' },
  snacks: { en: 'Snacks', ar: 'الوجبات الخفيفة' },
  meatPoultry: { en: 'Meat & Poultry', ar: 'اللحوم والدواجن' },
  clothing: { en: 'Clothing', ar: 'الملابس' },
  kitchen: { en: 'Kitchen', ar: 'المطبخ' },

  // Sensors
  weightSensor: { en: 'Weight Sensor', ar: 'مستشعر الوزن' },
  nfcReader: { en: 'NFC Reader', ar: 'قارئ NFC' },
  barcodeScanner: { en: 'Barcode Scanner', ar: 'ماسح الباركود' },
  connected: { en: 'Connected', ar: 'متصل' },
  disconnected: { en: 'Disconnected', ar: 'غير متصل' },
  waiting: { en: 'Waiting...', ar: 'في الانتظار...' },

  // Payment
  payWithNFC: { en: 'Pay with NFC', ar: 'الدفع بـ NFC' },
  tapCard: { en: 'Tap your card to pay', ar: 'انقر على بطاقتك للدفع' },
  paymentSuccessful: { en: 'Payment Successful!', ar: 'تم الدفع بنجاح!' },
  cartCleared: { en: 'Cart cleared', ar: 'تم مسح السلة' },

  // Status
  online: { en: 'Online', ar: 'متصل' },
  offline: { en: 'Offline', ar: 'غير متصل' },
  loading: { en: 'Loading...', ar: 'جاري التحميل...' },
  error: { en: 'Error', ar: 'خطأ' },
  noProducts: { en: 'No products found', ar: 'لم يتم العثور على منتجات' },
  emptyCart: { en: 'Your cart is empty', ar: 'سلتك فارغة' },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    // Update document direction
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [])

  const t = useCallback(
    (key: string): string => {
      const translation = translations[key]
      if (!translation) {
        console.warn(`Missing translation for key: ${key}`)
        return key
      }
      return translation[language]
    },
    [language]
  )

  const isRTL = language === 'ar'

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
