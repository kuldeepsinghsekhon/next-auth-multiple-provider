'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import type { Course, User, Module, Lesson, Enrollment,LessonCompletion } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import type { 
  CourseWithRelations,
  LessonWithRelations,
  ModuleWithLessons,
  LessonWithCompletions 
} from '@/types/course'


export async function getCourses() {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  return prisma.course.findMany({
    include: {
      author: true,
      modules: {
        include: { lessons: true },
        orderBy: { order: 'asc' }
      },
      enrollments: {
        where: { userId: session.user.id }
      }
    }
  })
}

export async function getCourseBySlug(slug: string): Promise<CourseWithRelations> {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      author: true,
      modules: {
        include: {
          lessons: true
        },
        orderBy: {
          order: 'asc'
        }
      },
      enrollments: {
        where: {
          userId: session.user.id
        }
      }
    }
  })

  if (!course) throw new Error('Course not found')
  return course
}

export async function enrollInCourse(courseId: string) {
  try {
    const session = await auth()
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId: session.user.id,
        courseId: courseId,
        status: 'in-progress',
        progress: 0
      }
    })

    revalidatePath('/course')
    return { success: true, enrollment }
    
  } catch (error) {
    console.error('Enrollment error:', error)
    return { success: false, error: 'Failed to enroll' }
  }
}


export async function getLessonNavigation(courseId: string, currentLessonId: string) {
 // const session = await auth()
 // if (!session?.user) throw new Error('Unauthorized')

  try {
    const allLessons = await prisma.lesson.findMany({
      where: {
        module: {
          courseId: courseId
        }
      },
      include: {
        module: true
      },
      orderBy: [
        {
          module: {
            order: 'asc'
          }
        },
        {
          order: 'asc'
        }
      ]
    })

    const currentIndex = allLessons.findIndex(lesson => lesson.id === currentLessonId)
    if (currentIndex === -1) throw new Error('Lesson not found')

    return {
      prev: currentIndex > 0 ? allLessons[currentIndex - 1].id : null,
      next: currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1].id : null
    }
  } catch (error) {
    console.error('Navigation error:', error)
    return { prev: null, next: null }
  }
}

  
  export async function getLessonById(id: string): Promise<LessonWithRelations> {
    const session = await auth()
    if (!session?.user) throw new Error('Unauthorized')
  
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        module: {
          include: {
            course: {
              include: {
                author: true,
                modules: {
                  include: {
                    lessons: {
                      include: {
                        completions: {
                          where: { userId: session.user.id }
                        },
                        quizzes:true
                      }
                    }
                  }
                }
              }
            }
          }
        },
        completions: {
          where: { userId: session.user.id }
        }
      }
    })
  
    if (!lesson) throw new Error('Lesson not found')
    return lesson
  }
  export async function markLessonComplete(lessonId: string) {
    const session = await auth()
    if (!session?.user) throw new Error('Unauthorized')
  console.log(session.user.id)
    try {
      const result = await prisma.$transaction(async (tx) => {
        // First verify lesson exists
        const lesson = await tx.lesson.findUnique({
          where: { id: lessonId },
          include: {
            module: {
              include: {
                course: true,
              }
            }
          }
        })
  
        if (!lesson) {
          throw new Error('Lesson not found')
        }
  
        // Verify enrollment exists
        const enrollment = await tx.enrollment.findUnique({
          where: {
            userId_courseId: {
              userId: session.user.id,
              courseId: lesson.module.course.id
            }
          }
        })
  
        if (!enrollment) {
          throw new Error('User not enrolled in this course')
        }
  
        // Create completion record
        const completion = await tx.lessonCompletion.create({
          data: {
            lessonId,
            userId: session.user.id
          }
        })
  
        // Calculate new progress
        const totalLessons = await tx.lesson.count({
          where: {
            module: {
              courseId: lesson.module.course.id
            }
          }
        })
  
        const completedLessons = await tx.lessonCompletion.count({
          where: {
            userId: session.user.id,
            lesson: {
              module: {
                courseId: lesson.module.course.id
              }
            }
          }
        })
  
        const progress = Math.round((completedLessons / totalLessons) * 100)
  
        // Update enrollment
        await tx.enrollment.update({
          where: {
            userId_courseId: {
              userId: session.user.id,
              courseId: lesson.module.course.id
            }
          },
          data: {
            progress,
            status: progress === 100 ? 'completed' : 'in-progress'
          }
        })
  
        return { completion, progress }
      })
  
      return result
  
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error marking lesson complete:', error.message)
        throw new Error(`Failed to mark lesson as complete: ${error.message}`)
      }
      throw new Error('Failed to mark lesson as complete')
    }
  }


