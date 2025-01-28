'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { submitQuizAttempt } from '@/actions/quiz'

interface QuizAttemptProps {
  quiz: any
  lessonId: string
  userId: string
}

export function QuizAttempt({ quiz, lessonId, userId }: QuizAttemptProps) {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      await submitQuizAttempt({
        quizId: quiz.id,
        userId,
        answers
      })
      router.push(`/course/lesson/${lessonId}/results`)
    } catch (error) {
      console.error('Failed to submit quiz:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{quiz.title}</h1>
      {quiz.questions.map((question: any) => (
        <div key={question.id} className="p-4 border rounded-lg">
          <p className="font-medium mb-4">{question.text}</p>
          <div className="space-y-2">
            {JSON.parse(question.options).map((option: string, index: number) => (
              <label key={index} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={question.id}
                  value={index.toString()}
                  onChange={(e) => setAnswers(prev => ({
                    ...prev,
                    [question.id]: e.target.value
                  }))}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Submitting..." : "Submit Quiz"}
      </Button>
    </div>
  )
}