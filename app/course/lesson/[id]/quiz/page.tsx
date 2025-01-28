import { getLessonById } from '@/actions/course'
import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { QuizAttempt } from '@/app/course/components/quiz-attempt'

export default async function QuizPage({ params }: { params: { id: string }}) {
 const {id}=await params
  const session = await auth()
  if (!session?.user) redirect('/auth/signin')

  const lesson = await getLessonById(id)
  if (!lesson || !lesson.quiz) notFound()

  return (
    <div className="container py-6">
      <QuizAttempt 
        quiz={lesson.quiz} 
        lessonId={lesson.id} 
        userId={session.user.id}
      />
    </div>
  )
}