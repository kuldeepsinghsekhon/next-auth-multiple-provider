'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { enrollInCourse } from '@/actions/course'
import { useRouter } from 'next/navigation'

interface EnrollButtonProps {
  courseId: string
 // isEnrolled: boolean
}

export function EnrollButton({ courseId, isEnrolled }: EnrollButtonProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleEnroll = async () => {
    try {
      setIsLoading(true)
      await enrollInCourse(courseId)
      
      toast({
        title: "Success!",
        description: "Successfully enrolled in course",
      })
      
      router.refresh()
    } catch (error) {
      console.error('Enrollment error:', error)
      toast({
        title: "Error",
        description: "Failed to enroll in course",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleEnroll}
      disabled={isLoading || isEnrolled}
      className="w-full"
    >
      {isLoading ? "Enrolling..." : (isEnrolled ? "Enrolled" : "Start Course")}
    </Button>
  )
}