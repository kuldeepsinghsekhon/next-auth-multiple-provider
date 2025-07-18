import { PrismaClient } from '@prisma/client'
import { seedPermissions } from './permissions'
import { seedRoles } from './roles'
import { seedUsers } from './users'
import { seedBlog } from './blog'
import {seedCourses} from './course'
import { seedQuizzes } from './quiz'
import { seedLessons } from './lessons'
import { seedCategories } from './categories'
import { seedTags } from './tags'
import {seedAuthorProfiles} from './author'

const prisma = new PrismaClient()

async function main() {
  await seedPermissions(prisma)
  await seedRoles(prisma)
  await seedUsers(prisma)
  await seedCategories(prisma)
  await seedTags(prisma)
  await seedBlog(prisma)
  await seedCourses(prisma)
  await seedLessons(prisma)
  await seedQuizzes(prisma)
 await seedAuthorProfiles(prisma)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })