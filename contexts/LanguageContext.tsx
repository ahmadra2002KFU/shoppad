'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'

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
  cancelCheckout: { en: 'Cancel', ar: 'إلغاء' },
  waitingForPayment: { en: 'Waiting for payment...', ar: 'في انتظار الدفع...' },
  receipt: { en: 'Receipt', ar: 'الإيصال' },
  receiptId: { en: 'Receipt ID', ar: 'رقم الإيصال' },

  // Status
  online: { en: 'Online', ar: 'متصل' },
  offline: { en: 'Offline', ar: 'غير متصل' },
  loading: { en: 'Loading...', ar: 'جاري التحميل...' },
  error: { en: 'Error', ar: 'خطأ' },
  noProducts: { en: 'No products found', ar: 'لم يتم العثور على منتجات' },
  emptyCart: { en: 'Your cart is empty', ar: 'سلتك فارغة' },

  // Payment Success Overlay
  paymentSuccessTitle: { en: 'Payment Successful!', ar: 'تم الدفع بنجاح!' },
  nfcProcessed: { en: 'Your NFC card has been processed', ar: 'تمت معالجة بطاقة NFC الخاصة بك' },
  cardId: { en: 'Card ID', ar: 'رقم البطاقة' },
  transactionId: { en: 'Transaction ID', ar: 'رقم المعاملة' },
  scanForReceipt: { en: 'Scan for receipt', ar: 'امسح للإيصال' },
  autoClosing: { en: 'Auto-closing in a moment...', ar: 'سيتم الإغلاق تلقائياً...' },

  // Weight Display
  status: { en: 'Status', ar: 'الحالة' },
  sensorStatus: { en: 'Sensor Status', ar: 'حالة المستشعر' },
  actualWeight: { en: 'Actual Weight', ar: 'الوزن الفعلي' },
  actual: { en: 'Actual', ar: 'الفعلي' },
  expected: { en: 'Expected', ar: 'المتوقع' },
  items: { en: 'items', ar: 'عناصر' },
  match: { en: 'Match', ar: 'مطابق' },
  ok: { en: 'OK', ar: 'موافق' },
  server: { en: 'Server', ar: 'الخادم' },
  scale: { en: 'Scale', ar: 'الميزان' },
  nfc: { en: 'NFC', ar: 'NFC' },
  scanLabel: { en: 'Scan', ar: 'المسح' },
  active: { en: 'Active', ar: 'نشط' },
  ready: { en: 'Ready', ar: 'جاهز' },
  lastUpdate: { en: 'Last update:', ar: 'آخر تحديث:' },
  kg: { en: 'kg', ar: 'كجم' },

  // Magazine
  magazine: { en: 'Magazine', ar: 'مجلة الأسبوع' },
  weeklyMagazine: { en: 'Weekly Magazine', ar: 'مجلة الأسبوع' },
  weeklyOffers: { en: 'Weekly Offers', ar: 'عروض الأسبوع' },
  thisWeeksDeals: { en: "This Week's Best Deals", ar: 'أفضل عروض هذا الأسبوع' },
  validUntil: { en: 'Valid until', ar: 'صالح حتى' },
  limitedTime: { en: 'Limited Time', ar: 'لفترة محدودة' },
  hotDeal: { en: 'Hot Deal', ar: 'عرض ساخن' },
  newArrival: { en: 'New Arrival', ar: 'وصل حديثاً' },
  bestSeller: { en: 'Best Seller', ar: 'الأكثر مبيعاً' },
  saveUpTo: { en: 'Save up to', ar: 'وفر حتى' },
  outOfStock: { en: 'Out of Stock', ar: 'غير متوفر' },
  soldOut: { en: 'Sold Out', ar: 'نفذت الكمية' },

  // Map
  storeMap: { en: 'Store Map', ar: 'خريطة المتجر' },
  storeDirectory: { en: 'Store Directory', ar: 'دليل المتجر' },
  tapToExplore: { en: 'Tap to explore', ar: 'انقر للاستكشاف' },
  tapToViewOffers: { en: 'Tap to view offers', ar: 'انقر لعرض العروض' },
  todaysSpecialOffers: { en: "Today's Special Offers", ar: 'عروض اليوم الخاصة' },
  loadingStoreMap: { en: 'Loading Store Map...', ar: 'جاري تحميل خريطة المتجر...' },
  close: { en: 'Close', ar: 'إغلاق' },
  mapInstructions: { en: 'Drag to rotate, pinch to zoom, tap sections for offers', ar: 'اسحب للتدوير، قرّب للتكبير، انقر على الأقسام للعروض' },

  // Store Sections
  produce: { en: 'Produce', ar: 'الخضروات' },
  dairy: { en: 'Dairy', ar: 'الألبان' },
  meat: { en: 'Meat', ar: 'اللحوم' },
  bakery: { en: 'Bakery', ar: 'المخبوزات' },
  frozen: { en: 'Frozen', ar: 'المجمدات' },

  // App/Footer
  appTitle: { en: 'ShopPad', ar: 'شوب باد' },
  appVersion: { en: 'ShopPad v5.0 - Smart Shopping with ESP32 Integration', ar: 'شوب باد v5.0 - تسوق ذكي مع تكامل ESP32' },
  webSocket: { en: 'WebSocket', ar: 'ويب سوكت' },
  realTime: { en: 'Real-time', ar: 'الوقت الفعلي' },
  nfcPayments: { en: 'NFC Payments', ar: 'دفع NFC' },

  // Misc
  add: { en: 'Add', ar: 'إضافة' },
  more: { en: 'more', ar: 'المزيد' },
  clearCart: { en: 'Clear Cart', ar: 'مسح السلة' },
  allCategories: { en: 'All', ar: 'الكل' },
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

  // Load saved language preference on mount
  useEffect(() => {
    const saved = localStorage.getItem('language') as Language
    if (saved && (saved === 'en' || saved === 'ar')) {
      setLanguageState(saved)
      document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr'
      document.documentElement.lang = saved
    }
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    // Save to localStorage
    localStorage.setItem('language', lang)
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
