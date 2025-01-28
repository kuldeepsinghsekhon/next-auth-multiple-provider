import { Suspense } from 'react'
import { getCourses } from '@/actions/course'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { CourseList } from './components/course-list'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function CoursePage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  const courses = await getCourses()

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Courses</h1>
        {session.user.role === 'ADMIN' && (
          <Button asChild>
            <Link href="/course/create">Create Course</Link>
          </Button>
        )}
      </div>

      <Suspense fallback={<div>Loading courses...</div>}>
        <CourseList courses={courses} />
      </Suspense>
    </div>
  )
}