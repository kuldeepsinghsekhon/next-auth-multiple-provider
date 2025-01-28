'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
export interface QuizSubmission {
    quizId: string
    userId: string
    answers: Record<string, string>
  }
  
  export async function submitQuizAttempt({
    quizId,
    userId,
    answers
  }: QuizSubmission) {
    const session = await auth()
    if (!session?.user) throw new Error('Unauthorized')
  
    return prisma.$transaction(async (tx) => {
      // Create attempt
      const attempt = await tx.quizAttempt.create({
        data: {
          quizId,
          userId,
          status: 'COMPLETED'
        }
      })
  
      // Get quiz questions
      const quiz = await tx.quiz.findUnique({
        where: { id: quizId },
        include: { questions: true }
      })
  
      if (!quiz) throw new Error('Quiz not found')
  
      // Grade answers and create attempt records
      let score = 0
      const questionAttempts = await Promise.all(
        quiz.questions.map(async (question) => {
          const isCorrect = answers[question.id] === question.correctAnswer
          if (isCorrect) score += question.points
  
          return tx.questionAttempt.create({
            data: {
              questionId: question.id,
              attemptId: attempt.id,
              answer: answers[question.id],
              isCorrect,
              points: isCorrect ? question.points : 0
            }
          })
        })
      )
  
      // Update attempt with final score
      const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0)
      const percentageScore = Math.round((score / totalPoints) * 100)
  
      await tx.quizAttempt.update({
        where: { id: attempt.id },
        data: {
          score: percentageScore,
          completedAt: new Date()
        }
      })
  
      return {
        attemptId: attempt.id,
        score: percentageScore,
        questionAttempts
      }
    })
  }