import { PrismaClient } from '@prisma/client'
import { AUTHOR_PROFILES } from './blog-data'

export async function seedAuthorProfiles(prisma: PrismaClient) {
  console.log('🌱 Seeding Authors Profile...')

  const users = await prisma.user.findMany({
    where: {
      email: {
        in: ['superadmin@example.com', 'admin@example.com', 'testuser@example.com']
      }
    }
  })

  const userMap = users.reduce((map, user) => {
    map[user.email] = user.id
    return map
  }, {} as Record<string, string>)

  for (const profile of AUTHOR_PROFILES) {
    const userId = userMap[profile.email]
    if (userId) {
      await prisma.authorProfile.upsert({
        where: { userId },
        update: {},
        create: {
          ...profile,
          userId
        }
      })
    }
  }

  console.log('✅ Authors Profile seeded')
}