'use client'

import { CourseCard } from './course-card'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import type { CourseWithProgress } from '@/types/course'

interface CourseListProps {
  courses: CourseWithProgress[]
}

export function CourseList({ courses }: CourseListProps) {
  const [search, setSearch] = useState('')
  
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <Input
        placeholder="Search courses..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}