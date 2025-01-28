'use client'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { enrollInCourse } from '@/actions/course'
import type { Course, User, Enrollment } from '@prisma/client'

interface CourseHeaderProps {
  course: Course & {
    author: User
    enrollments: Enrollment[]
  }
}

export function CourseHeader({ course }: CourseHeaderProps) {
  const enrollment = course.enrollments[0]
  
  return (
    <div className="pb-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">By {course.author.name}</p>
        </div>
        {enrollment && (
          <div className="w-64">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{Math.round(enrollment.progress)}%</span>
            </div>
            <Progress value={enrollment.progress} />
          </div>
        )}
      </div>
      {!enrollment && (
        <Button onClick={() => enrollInCourse(course.id)}>
          Start Course
        </Button>
      )}
    </div>
  )
}