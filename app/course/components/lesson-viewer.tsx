'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { toast } from '@/components/ui/use-toast'
import { markLessonComplete } from '@/actions/course'
import type { Lesson } from '@prisma/client'

export function LessonViewer({ lesson }: { lesson: Lesson }) {
  const [isCompleting, setIsCompleting] = useState(false)

  const handleComplete = async (id:string) => {

    try {
      setIsCompleting(true)
   let asr=await markLessonComplete(id)
  
   toast({
    title: "Lesson completed!",
    description: "Your progress has been updated"
  })
    }   catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark lesson as complete",
        variant: "destructive"
      })
    }
     finally {
      setIsCompleting(false)
    }
  }

  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>
      <div className="prose dark:prose-invert max-w-none">
        {lesson.content}
      </div>
      <Button 
        onClick={ () => handleComplete(lesson.id)}
        disabled={isCompleting}
        className="mt-6"
      >
 
        {isCompleting ? "Marking as complete..." : "Mark as complete"}
        </Button>
      {JSON.stringify(lesson)}

        {//lesson.quizzes && (
        <Button asChild className="mt-6">
          <Link href={`/course/lesson/${lesson.id}/quiz`}>
            Take Quiz
          </Link>
        </Button>
   //   )
      }
    </Card>
  )
}