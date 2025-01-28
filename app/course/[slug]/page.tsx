import { Suspense } from 'react'
import { getCourseBySlug } from '@/actions/course'
import { auth } from '@/auth'
import { notFound, redirect } from 'next/navigation'
import { CourseHeader } from '../components/course-header'
import { ModuleList } from '../components/module-list'
import type { Metadata } from 'next'

interface PageProps {
  params: { slug: string }
}

async function CourseContent({ course }: { course: any }) {
  return (
    <>
      <CourseHeader course={course} />
      <ModuleList modules={course.modules} />
    </>
  )
}

export default async function CoursePage({ params }: PageProps) {
  const session = await auth()
  const { slug } = params
  
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/course/' + slug)
  }

  const course = await getCourseBySlug(slug)
  
  if (!course) {
    notFound()
  }

  return (
    <div className="container py-6">
      <Suspense fallback={<div>Loading course...</div>}>
        <CourseContent course={course} />
      </Suspense>
    </div>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const course = await getCourseBySlug(params.slug).catch(() => null)
  
  if (!course) {
    return { title: 'Course Not Found' }
  }

  return {
    title: course.title,
    description: course.description || undefined
  }
}