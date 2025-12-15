'use client'

import Image from 'next/image'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/contexts/CartContext'
import { useLanguage } from '@/contexts/LanguageContext'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { t } = useLanguage()

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative aspect-square bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {product.weight && (
          <Badge className="absolute top-2 right-2" variant="secondary">
            {product.weight} kg
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg truncate">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.category}</p>
        <p className="text-lg font-bold text-primary mt-2">
          {product.price.toFixed(2)} {t('sar')}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => addToCart(product)}
          className="w-full"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('addToCart')}
        </Button>
      </CardFooter>
    </Card>
  )
}
