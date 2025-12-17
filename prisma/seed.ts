import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const products = [
  // Fresh Produce - منتجات طازجة
  {
    id: "1",
    name: "Fresh Tomatoes",
    nameAr: "طماطم طازجة",
    category: "Fresh Produce",
    categoryAr: "منتجات طازجة",
    price: 11.25,
    image: "/assets/tomato.jpg",
    barcode: "1234567890123",
    weight: 0.5,
  },
  {
    id: "2",
    name: "Organic Potatoes",
    nameAr: "بطاطس عضوية",
    category: "Fresh Produce",
    categoryAr: "منتجات طازجة",
    price: 13.12,
    image: "/assets/potato.jpg",
    barcode: "1234567890124",
    weight: 1.0,
  },
  {
    id: "3",
    name: "Red Apples",
    nameAr: "تفاح أحمر",
    category: "Fresh Produce",
    categoryAr: "منتجات طازجة",
    price: 18.75,
    image: "/assets/apple.jpg",
    barcode: "1234567890125",
    weight: 0.8,
  },
  {
    id: "4",
    name: "Fresh Bananas",
    nameAr: "موز طازج",
    category: "Fresh Produce",
    categoryAr: "منتجات طازجة",
    price: 9.50,
    image: "/assets/banana.jpg",
    barcode: "1234567890126",
    weight: 0.6,
    soldOut: true,
  },
  {
    id: "5",
    name: "Fresh Carrots",
    nameAr: "جزر طازج",
    category: "Fresh Produce",
    categoryAr: "منتجات طازجة",
    price: 8.75,
    image: "/assets/carrot.jpg",
    barcode: "1234567890127",
    weight: 0.7,
  },
  // Dairy & Bakery - الألبان والمخبوزات
  {
    id: "6",
    name: "Fresh Milk",
    nameAr: "حليب طازج",
    category: "Dairy & Bakery",
    categoryAr: "الألبان والمخبوزات",
    price: 15.99,
    image: "/assets/milk.jpg",
    barcode: "2234567890123",
    weight: 1.0,
  },
  {
    id: "7",
    name: "Fresh Bread",
    nameAr: "خبز طازج",
    category: "Dairy & Bakery",
    categoryAr: "الألبان والمخبوزات",
    price: 7.50,
    image: "/assets/bread.jpg",
    barcode: "2234567890124",
    weight: undefined,
  },
  {
    id: "8",
    name: "Cheese Selection",
    nameAr: "تشكيلة أجبان",
    category: "Dairy & Bakery",
    categoryAr: "الألبان والمخبوزات",
    price: 32.99,
    image: "/assets/cheese.jpg",
    barcode: "2234567890125",
    weight: 0.3,
    soldOut: true,
  },
  // Beverages - المشروبات
  {
    id: "9",
    name: "Orange Juice",
    nameAr: "عصير برتقال",
    category: "Beverages",
    categoryAr: "المشروبات",
    price: 12.50,
    image: "/assets/juice.jpg",
    barcode: "3234567890123",
    weight: 1.0,
  },
  // Pantry Staples - مواد غذائية أساسية
  {
    id: "10",
    name: "Pasta",
    nameAr: "معكرونة",
    category: "Pantry Staples",
    categoryAr: "مواد غذائية أساسية",
    price: 14.25,
    image: "/assets/pasta.jpg",
    barcode: "4234567890123",
    weight: undefined,
  },
  {
    id: "11",
    name: "White Rice",
    nameAr: "أرز أبيض",
    category: "Pantry Staples",
    categoryAr: "مواد غذائية أساسية",
    price: 28.99,
    image: "/assets/rice.jpg",
    barcode: "4234567890124",
    weight: 2.0,
  },
  {
    id: "12",
    name: "Olive Oil",
    nameAr: "زيت زيتون",
    category: "Pantry Staples",
    categoryAr: "مواد غذائية أساسية",
    price: 45.00,
    image: "/assets/oil.jpg",
    barcode: "4234567890125",
    weight: 1.0,
    soldOut: true,
  },
  // Household - مستلزمات منزلية
  {
    id: "13",
    name: "Cleaning Supplies",
    nameAr: "مواد تنظيف",
    category: "Household",
    categoryAr: "مستلزمات منزلية",
    price: 22.50,
    image: "/assets/cleaning.jpg",
    barcode: "5234567890123",
    weight: undefined,
  },
  {
    id: "14",
    name: "Tissue Paper",
    nameAr: "مناديل ورقية",
    category: "Household",
    categoryAr: "مستلزمات منزلية",
    price: 18.99,
    image: "/assets/tissue.jpg",
    barcode: "5234567890124",
    weight: undefined,
  },
  {
    id: "15",
    name: "Soap & Shampoo",
    nameAr: "صابون وشامبو",
    category: "Household",
    categoryAr: "مستلزمات منزلية",
    price: 35.75,
    image: "/assets/soap.jpg",
    barcode: "5234567890125",
    weight: undefined,
  },
  // Snacks - وجبات خفيفة
  {
    id: "16",
    name: "Chips & Snacks",
    nameAr: "رقائق ووجبات خفيفة",
    category: "Snacks",
    categoryAr: "وجبات خفيفة",
    price: 16.50,
    image: "/assets/snacks.jpg",
    barcode: "6234567890123",
    weight: undefined,
    soldOut: true,
  },
  // Meat & Poultry - اللحوم والدواجن
  {
    id: "17",
    name: "Fresh Chicken",
    nameAr: "دجاج طازج",
    category: "Meat & Poultry",
    categoryAr: "اللحوم والدواجن",
    price: 42.00,
    image: "/assets/chicken.jpg",
    barcode: "7234567890123",
    weight: 1.5,
  },
  // Clothing - ملابس
  {
    id: "18",
    name: "Cotton T-Shirt",
    nameAr: "تيشيرت قطني",
    category: "Clothing",
    categoryAr: "ملابس",
    price: 75.00,
    image: "/assets/clothing.jpg",
    barcode: "8234567890123",
    weight: undefined,
  },
  {
    id: "19",
    name: "Casual Pants",
    nameAr: "بنطلون كاجوال",
    category: "Clothing",
    categoryAr: "ملابس",
    price: 150.00,
    image: "/assets/clothing.jpg",
    barcode: "8234567890124",
    weight: undefined,
  },
  // Kitchen - أدوات المطبخ
  {
    id: "20",
    name: "Cookware Set",
    nameAr: "طقم أواني طبخ",
    category: "Kitchen",
    categoryAr: "أدوات المطبخ",
    price: 299.99,
    image: "/assets/kitchen.jpg",
    barcode: "9234567890123",
    weight: undefined,
    soldOut: true,
  },
  {
    id: "21",
    name: "Kitchen Utensils",
    nameAr: "أدوات مطبخ",
    category: "Kitchen",
    categoryAr: "أدوات المطبخ",
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
        nameAr: product.nameAr,
        category: product.category,
        categoryAr: product.categoryAr,
        price: product.price,
        image: product.image,
        barcode: product.barcode,
        weight: product.weight,
        soldOut: product.soldOut || false,
      },
    })
    console.log(`Created product: ${product.name} / ${product.nameAr}${product.soldOut ? ' (SOLD OUT)' : ''}`)
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
