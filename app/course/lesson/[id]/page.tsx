import { getLessonById,getLessonNavigation } from '@/actions/course'

import { auth } from '@/auth'
import { notFound, redirect } from 'next/navigation'
import { LessonViewer } from '../../components/lesson-viewer'
import { LessonNavigation } from '../../components/lesson-navigation'
import { Suspense } from 'react'
import { ModuleList } from '../../components/module-list'


interface PageProps {
  params: { id: string }
}

function LessonContent({ lesson ,nav }: { lesson: any ,nav:any}) {
  return (
    <div className="container py-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>

          <LessonViewer lesson={lesson} />
          <LessonNavigation 
            nav={nav}
            courseId={lesson.module.course.id}
            currentLessonId={lesson.id}
          />
        </div>
        <ModuleList modules={lesson.module.course.modules} />
      </div>
    </div>
  )
}

export default async function LessonPage({ params }: PageProps) {
  const session = await auth()
  const {id}= await params
  if (!session?.user) {
    redirect('/auth/signin')
  }

  const lesson = await getLessonById(id)
  const nav = await getLessonNavigation(lesson.module.course.id, lesson.id)

  if (!lesson) {
    notFound()
  }

  return (
    <Suspense fallback={<div>Loading lesson...</div>}>
      <LessonContent lesson={lesson} nav={nav} />
    </Suspense>
  )
}
// export async function generateMetadata({ params }: PageProps) {
//   const { id } = await params
//   const lesson = await getLessonById(id).catch(() => null)
  
//   if (!lesson) {
//     return { title: 'Lesson Not Found' }
//   }

//   return {
//     title: `${lesson.title} - ${lesson.module.course.title}`,
//     description: lesson.content.slice(0, 160)
//   }
// }