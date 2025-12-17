export interface Product {
  id: string
  name: string
  nameAr?: string
  category: string
  categoryAr?: string
  price: number
  barcode?: string
  weight?: number
  image: string
  soldOut?: boolean
}

export interface CartItem extends Product {
  quantity: number
}

export interface WeightData {
  weight: number
  timestamp: string
  deviceId?: string
}

export interface BarcodeScanData {
  scanId: string
  barcode: string
  weight: number
  timestamp: string
  product?: Product | null
}

export interface NFCPaymentData {
  paymentId: string
  cardUID: string
  weight: number
  timestamp: string
  trigger: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
}

export interface WeightStats {
  count: number
  average: number
  min: number
  max: number
  latest: number
}
