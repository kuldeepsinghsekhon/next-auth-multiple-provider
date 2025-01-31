import { PrismaClient } from '@prisma/client'
import { TAGS } from './tags-data'

export async function seedTags(prisma: PrismaClient) {
  console.log('🌱 Seeding tags...')

  for (const tag of TAGS) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag
    })
  }

  console.log('✅ Tags seeded')
}