import { PrismaClient } from '@prisma/client'
import { SAMPLE_QUIZZES } from './quiz-data'
import { LESSONS } from './lesson-data'


export async function seedQuizzes(prisma: PrismaClient) {
  console.log('🌱 Seeding quizzes...')

  for (const lessonData of LESSONS) {
    const lesson = await prisma.lesson.findFirst({
      where: { 
        title: lessonData.title
      }
    })

    if (!lesson) {
      console.log(`⚠️ Lesson not found: ${lessonData.title}`)
      continue
    }

    await prisma.quiz.create({
      data: {
        title: lessonData.quiz.title,
        lessonId: lesson.id,
        questions: {
          create: lessonData.quiz.questions.map(q => ({
            text: q.text,
            type: q.type,
            options: q.options,
            correctAnswer: q.correctAnswer,
            points: q.points,
            order: q.order
          }))
        }
      }
    })

    console.log(`✅ Created quiz for lesson: ${lesson.title}`)
  }
}