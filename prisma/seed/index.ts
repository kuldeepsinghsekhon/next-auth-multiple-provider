import { PrismaClient } from '@prisma/client'
import { seedPermissions } from './permissions'
import { seedRoles } from './roles'
import { seedUsers } from './users'
import { seedBlog } from './blog'
import {seedCourses} from './course'
import { seedQuizzes } from './quiz'
import { seedLessons } from './lessons'

const prisma = new PrismaClient()

async function main() {
  await seedPermissions(prisma)
  await seedRoles(prisma)
  await seedUsers(prisma)
  await seedBlog(prisma)
  await seedCourses(prisma)
  await seedLessons(prisma)
  await seedQuizzes(prisma)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })