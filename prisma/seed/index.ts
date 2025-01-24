import { PrismaClient } from '@prisma/client'
import { seedPermissions } from './permissions'
import { seedRoles } from './roles'
import { seedUsers } from './users'
import { seedBlog } from './blog'

const prisma = new PrismaClient()

async function main() {
  await seedPermissions(prisma)
  await seedRoles(prisma)
  await seedUsers(prisma)
  await seedBlog(prisma)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })