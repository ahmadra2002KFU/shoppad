'use client'

import Image from 'next/image'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/contexts/CartContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  isCompact?: boolean
}

export function ProductCard({ product, isCompact = false }: ProductCardProps) {
  const { addToCart } = useCart()
  const { t, isRTL } = useLanguage()

  // Get localized name and category
  const displayName = isRTL && product.nameAr ? product.nameAr : product.name
  const displayCategory = isRTL && product.categoryAr ? product.categoryAr : product.category

  if (isCompact) {
    return (
      <Card className={cn(
        "overflow-hidden transition-shadow",
        product.soldOut ? "opacity-60 grayscale" : "hover:shadow-lg"
      )}>
        <div className="relative aspect-square bg-gray-100">
          <Image
            src={product.image}
            alt={displayName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 20vw"
          />
          {product.soldOut ? (
            <Badge className={`absolute top-1 ${isRTL ? 'left-1' : 'right-1'} text-[10px] px-1 py-0 bg-gray-500`}>
              {t('soldOut')}
            </Badge>
          ) : product.weight && (
            <Badge className={`absolute top-1 ${isRTL ? 'left-1' : 'right-1'} text-[10px] px-1 py-0`} variant="secondary">
              {product.weight}kg
            </Badge>
          )}
        </div>
        <CardContent className="p-2">
          <h3 className={cn("font-medium text-sm truncate", product.soldOut && "text-gray-500")}>{displayName}</h3>
          <p className={cn("text-sm font-bold", product.soldOut ? "text-gray-400 line-through" : "text-primary")}>
            {product.price.toFixed(2)} {t('sar')}
          </p>
        </CardContent>
        <CardFooter className="p-2 pt-0">
          <Button
            onClick={() => addToCart(product)}
            className="w-full h-7 text-xs"
            size="sm"
            disabled={product.soldOut}
          >
            <Plus className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
            {product.soldOut ? t('soldOut') : t('add')}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className={cn(
      "overflow-hidden transition-shadow",
      product.soldOut ? "opacity-60 grayscale" : "hover:shadow-lg"
    )}>
      <div className="relative aspect-square bg-gray-100">
        <Image
          src={product.image}
          alt={displayName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {product.soldOut ? (
          <Badge className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} bg-gray-500`}>
            {t('soldOut')}
          </Badge>
        ) : product.weight && (
          <Badge className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'}`} variant="secondary">
            {product.weight} kg
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className={cn("font-semibold text-lg truncate", product.soldOut && "text-gray-500")}>{displayName}</h3>
        <p className="text-sm text-muted-foreground">{displayCategory}</p>
        <p className={cn("text-lg font-bold mt-2", product.soldOut ? "text-gray-400 line-through" : "text-primary")}>
          {product.price.toFixed(2)} {t('sar')}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => addToCart(product)}
          className="w-full"
          size="sm"
          disabled={product.soldOut}
        >
          <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {product.soldOut ? t('soldOut') : t('addToCart')}
        </Button>
      </CardFooter>
    </Card>
  )
}
