import { PrismaClient } from '@prisma/client'
import { COURSES } from './courses-data'

export async function seedLessons(prisma: PrismaClient) {
  console.log('🌱 Seeding lessons and quizzes...')

  for (const course of COURSES) {
    const courseRecord = await prisma.course.findUnique({
      where: { slug: course.slug }
    })

    if (!courseRecord) {
      console.log(`⚠️ Course not found: ${course.title}`)
      continue
    }

    for (const module of course.modules) {
      const moduleRecord = await prisma.module.create({
        data: {
          title: module.title,
          order: module.order,
          courseId: courseRecord.id
        }
      })

      for (const lesson of module.lessons) {
        const lessonRecord = await prisma.lesson.create({
          data: {
            title: lesson.title,
            content: lesson.content,
            order: lesson.order,
            moduleId: moduleRecord.id
          }
        })

        if (lesson.quiz) {
          await prisma.quiz.create({
            data: {
              title: lesson.quiz.title,
              lessonId: lessonRecord.id,
              questions: {
                create: lesson.quiz.questions.map(q => ({
                  text: q.text,
                  type: q.type,
                  options: q.options,
                  correctAnswer: q.correctAnswer,
                  explanation: q.explanation,
                  points: q.points,
                  order: q.order
                }))
              }
            }
          })
          console.log(`✅ Created quiz for lesson: ${lesson.title}`)
        }
      }
    }
  }
}