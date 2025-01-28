'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import type { Course, User, Module, Enrollment } from '@prisma/client'
import {EnrollButton} from '../components/enroll-button'
interface CourseWithRelations extends Course {
  author: User
  modules: Module[]
  enrollments: Enrollment[]
}

export function CourseCard({ course }: { course: CourseWithRelations }) {
  const enrollment = course.enrollments[0]
  const progress = enrollment?.progress || 0
  const isEnrolled = Boolean(enrollment)
  
  return (
    <Card className="flex flex-col">
      <CardHeader>
        {course.coverImage && (
          <div className="aspect-video rounded-md overflow-hidden">
            <img 
              src={course.coverImage} 
              alt={course.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{course.title}</h3>
            <p className="text-sm text-muted-foreground">
              By {course.author.name}
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(course.createdAt), { addSuffix: true })}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.description}
        </p>
        {isEnrolled && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}
      </CardContent>

      <CardFooter className="mt-auto">
        <Button asChild className="w-full">
          <Link href={`/course/${course.slug}`}>
            {isEnrolled ? 'Continue Learning' : 'Start Course'}
          </Link>
        </Button>
       
      </CardFooter>
    </Card>
  )
}