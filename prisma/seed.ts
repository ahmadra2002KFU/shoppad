import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const products = [
  // Fresh Produce
  {
    id: "1",
    name: "Fresh Tomatoes",
    category: "Fresh Produce",
    price: 11.25,
    image: "/assets/tomato.jpg",
    barcode: "1234567890123",
    weight: 0.5,
  },
  {
    id: "2",
    name: "Organic Potatoes",
    category: "Fresh Produce",
    price: 13.12,
    image: "/assets/potato.jpg",
    barcode: "1234567890124",
    weight: 1.0,
  },
  {
    id: "3",
    name: "Red Apples",
    category: "Fresh Produce",
    price: 18.75,
    image: "/assets/apple.jpg",
    barcode: "1234567890125",
    weight: 0.8,
  },
  {
    id: "4",
    name: "Fresh Bananas",
    category: "Fresh Produce",
    price: 9.50,
    image: "/assets/banana.jpg",
    barcode: "1234567890126",
    weight: 0.6,
  },
  {
    id: "5",
    name: "Fresh Carrots",
    category: "Fresh Produce",
    price: 8.75,
    image: "/assets/carrot.jpg",
    barcode: "1234567890127",
    weight: 0.7,
  },
  // Dairy & Bakery
  {
    id: "6",
    name: "Fresh Milk",
    category: "Dairy & Bakery",
    price: 15.99,
    image: "/assets/milk.jpg",
    barcode: "2234567890123",
    weight: 1.0,
  },
  {
    id: "7",
    name: "Fresh Bread",
    category: "Dairy & Bakery",
    price: 7.50,
    image: "/assets/bread.jpg",
    barcode: "2234567890124",
    weight: undefined,
  },
  {
    id: "8",
    name: "Cheese Selection",
    category: "Dairy & Bakery",
    price: 32.99,
    image: "/assets/cheese.jpg",
    barcode: "2234567890125",
    weight: 0.3,
  },
  // Beverages
  {
    id: "9",
    name: "Orange Juice",
    category: "Beverages",
    price: 12.50,
    image: "/assets/juice.jpg",
    barcode: "3234567890123",
    weight: 1.0,
  },
  // Pantry Staples
  {
    id: "10",
    name: "Pasta",
    category: "Pantry Staples",
    price: 14.25,
    image: "/assets/pasta.jpg",
    barcode: "4234567890123",
    weight: undefined,
  },
  {
    id: "11",
    name: "White Rice",
    category: "Pantry Staples",
    price: 28.99,
    image: "/assets/rice.jpg",
    barcode: "4234567890124",
    weight: 2.0,
  },
  {
    id: "12",
    name: "Olive Oil",
    category: "Pantry Staples",
    price: 45.00,
    image: "/assets/oil.jpg",
    barcode: "4234567890125",
    weight: 1.0,
  },
  // Household
  {
    id: "13",
    name: "Cleaning Supplies",
    category: "Household",
    price: 22.50,
    image: "/assets/cleaning.jpg",
    barcode: "5234567890123",
    weight: undefined,
  },
  {
    id: "14",
    name: "Tissue Paper",
    category: "Household",
    price: 18.99,
    image: "/assets/tissue.jpg",
    barcode: "5234567890124",
    weight: undefined,
  },
  {
    id: "15",
    name: "Soap & Shampoo",
    category: "Household",
    price: 35.75,
    image: "/assets/soap.jpg",
    barcode: "5234567890125",
    weight: undefined,
  },
  // Snacks
  {
    id: "16",
    name: "Chips & Snacks",
    category: "Snacks",
    price: 16.50,
    image: "/assets/snacks.jpg",
    barcode: "6234567890123",
    weight: undefined,
  },
  // Meat & Poultry
  {
    id: "17",
    name: "Fresh Chicken",
    category: "Meat & Poultry",
    price: 42.00,
    image: "/assets/chicken.jpg",
    barcode: "7234567890123",
    weight: 1.5,
  },
  // Clothing
  {
    id: "18",
    name: "Cotton T-Shirt",
    category: "Clothing",
    price: 75.00,
    image: "/assets/clothing.jpg",
    barcode: "8234567890123",
    weight: undefined,
  },
  {
    id: "19",
    name: "Casual Pants",
    category: "Clothing",
    price: 150.00,
    image: "/assets/clothing.jpg",
    barcode: "8234567890124",
    weight: undefined,
  },
  // Kitchen
  {
    id: "20",
    name: "Cookware Set",
    category: "Kitchen",
    price: 299.99,
    image: "/assets/kitchen.jpg",
    barcode: "9234567890123",
    weight: undefined,
  },
  {
    id: "21",
    name: "Kitchen Utensils",
    category: "Kitchen",
    price: 93.75,
    image: "/assets/kitchen.jpg",
    barcode: "9234567890124",
    weight: undefined,
  },
]

async function main() {
  console.log('Starting seed...')

  // Clear existing products
  await prisma.product.deleteMany()

  // Insert products
  for (const product of products) {
    await prisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.image,
        barcode: product.barcode,
        weight: product.weight,
      },
    })
    console.log(`Created product: ${product.name}`)
  }

  console.log(`Seed completed! Created ${products.length} products.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
