import { PrismaClient } from '@prisma/client'
import { SAMPLE_COURSES } from './courses-data'

const prisma = new PrismaClient()

// export async function seedCourses() {
//   const admin = await prisma.user.findFirst({
//     where: { role: { name: 'ADMIN' } }
//   })
// console.log('🌱 Seeding courses...')
//   if (!admin) throw new Error('Admin user not found')
//     for (const course of SAMPLE_COURSES) {
//         await prisma.course.upsert({
//           where: { slug: course.slug },
//           update: {},
//           create: {
//             ...course,
//             authorId: admin.id,
//             modules: {
//               create: course.modules.map(module => ({
//                 ...module,
//                 lessons: {
//                   create: module.lessons
//                 }
//               }))
//             }
//           }
//         })
//   }
// }
export async function seedCourses(prisma: PrismaClient) {
  const admin = await prisma.user.findFirst({
    where:{ role: { name: 'ADMIN' } }
  })

  if (!admin) throw new Error('Admin user not found')

  for (const course of SAMPLE_COURSES) {
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: {},
      create: {
        ...course,
        authorId: admin.id,
        modules: {
          create: course.modules.map(module => ({
            title: module.title,
            order: module.order,
            lessons: {
              create: module.lessons.map(lesson => ({
                title: lesson.title,
                content: lesson.content,
                type: lesson.type,
                order: lesson.order
              }))
            }
          }))
        }
      }
    })
  }
}