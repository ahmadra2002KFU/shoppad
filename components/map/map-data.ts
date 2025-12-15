import type { Section } from '@/types/map'

export const SECTIONS: Section[] = [
  {
    id: 'produce',
    name: 'Fresh Produce',
    color: '#5a7c5a',
    hoverColor: '#6b8f6b',
    position: { x: -3.5, z: -2.5 },
    size: { w: 3, d: 3 },
    icon: '🥬',
    offers: [
      { item: 'Organic Bananas', discount: '30% OFF', price: '$1.99/lb' },
      { item: 'Fresh Strawberries', discount: 'Buy 2 Get 1', price: '$3.49/box' },
      { item: 'Avocados', discount: '4 for $5', price: 'Limited Time' },
    ]
  },
  {
    id: 'dairy',
    name: 'Dairy & Eggs',
    color: '#7a9bb5',
    hoverColor: '#8dabc3',
    position: { x: 1, z: -2.5 },
    size: { w: 2.5, d: 3 },
    icon: '🥛',
    offers: [
      { item: 'Whole Milk Gallon', discount: '25% OFF', price: '$2.99' },
      { item: 'Greek Yogurt 4-Pack', discount: '$1 OFF', price: '$4.49' },
      { item: 'Farm Fresh Eggs', discount: 'BOGO', price: '$3.29/dozen' },
    ]
  },
  {
    id: 'meat',
    name: 'Meat & Seafood',
    color: '#8b6b61',
    hoverColor: '#9d7d73',
    position: { x: 4, z: -2.5 },
    size: { w: 2.5, d: 3 },
    icon: '🥩',
    offers: [
      { item: 'Ribeye Steak', discount: '40% OFF', price: '$9.99/lb' },
      { item: 'Salmon Fillet', discount: '$3 OFF', price: '$8.99/lb' },
      { item: 'Ground Beef', discount: 'Family Pack Deal', price: '$4.49/lb' },
    ]
  },
  {
    id: 'bakery',
    name: 'Fresh Bakery',
    color: '#c4a574',
    hoverColor: '#d4b584',
    position: { x: -3.5, z: 1 },
    size: { w: 3, d: 2.5 },
    icon: '🥐',
    offers: [
      { item: 'Artisan Sourdough', discount: 'Fresh Baked!', price: '$4.99' },
      { item: 'Croissants 6-Pack', discount: '20% OFF', price: '$5.99' },
      { item: 'Birthday Cakes', discount: 'Order Today!', price: 'From $19.99' },
    ]
  },
  {
    id: 'frozen',
    name: 'Frozen Foods',
    color: '#8fa5b5',
    hoverColor: '#a0b5c4',
    position: { x: 1, z: 1 },
    size: { w: 2.5, d: 2.5 },
    icon: '🧊',
    offers: [
      { item: 'Ice Cream Pints', discount: '3 for $10', price: 'All Brands' },
      { item: 'Frozen Pizza', discount: 'Buy 2 Get 1', price: '$6.99 each' },
      { item: 'Frozen Veggies', discount: '50% OFF', price: '$1.49/bag' },
    ]
  },
  {
    id: 'beverages',
    name: 'Beverages',
    color: '#7a8b7a',
    hoverColor: '#8a9b8a',
    position: { x: 4, z: 1 },
    size: { w: 2.5, d: 2.5 },
    icon: '🥤',
    offers: [
      { item: 'Sparkling Water 12-Pack', discount: '35% OFF', price: '$4.99' },
      { item: 'Fresh Orange Juice', discount: '$1 OFF', price: '$3.49' },
      { item: 'Energy Drinks', discount: '4 for $6', price: 'All Varieties' },
    ]
  },
  {
    id: 'snacks',
    name: 'Snacks & Candy',
    color: '#b5a08a',
    hoverColor: '#c4b09a',
    position: { x: -3.5, z: 4 },
    size: { w: 3, d: 2 },
    icon: '🍿',
    offers: [
      { item: 'Potato Chips', discount: 'BOGO 50% OFF', price: '$3.99' },
      { item: 'Chocolate Bars', discount: '3 for $5', price: 'Premium Selection' },
      { item: 'Trail Mix', discount: '25% OFF', price: '$4.99/lb' },
    ]
  },
  {
    id: 'checkout',
    name: 'Checkout',
    color: '#6b7280',
    hoverColor: '#7c8490',
    position: { x: 2.5, z: 4.5 },
    size: { w: 5, d: 1.5 },
    icon: '🛒',
    offers: [
      { item: 'Express Lane', discount: '15 Items or Less', price: 'Fast Service' },
      { item: 'Self Checkout', discount: 'Open 24/7', price: '6 Stations' },
      { item: 'Rewards Program', discount: 'Sign Up Today!', price: 'Extra 5% OFF' },
    ]
  },
]
