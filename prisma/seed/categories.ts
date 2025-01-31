import { PrismaClient } from '@prisma/client'
import { CATEGORIES } from './categories-data'

export async function seedCategories(prisma: PrismaClient) {
  console.log('🌱 Seeding categories...')

  for (const category of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    })
  }

  console.log('✅ Categories seeded')
}