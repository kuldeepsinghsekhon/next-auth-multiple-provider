
'use client'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface LessonNavigationProps {
  courseId: string
  currentLessonId: string,
  nav:any
}

export async function LessonNavigation(props: LessonNavigationProps) {
   const router = useRouter()
   const [navigation, setNavigation] = useState<{ prev: string | null; next: string | null }>({ prev: props.nav.prev, next: props.nav.next })

  const handleNavigation = (lessonId: string) => {

    router.push(`/course/lesson/${lessonId}`)
  }

  return (
    <div className="flex justify-between mt-6">

      <Button
        variant="outline"
        onClick={() => navigation.prev && handleNavigation(navigation.prev)}
        disabled={!navigation.prev}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Previous Lesson
      </Button>
      
      <Button
        onClick={() => navigation.next && handleNavigation(navigation.next)}
        disabled={!navigation.next}
      >
        Next Lesson
        
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button> 
    </div>
  )
}