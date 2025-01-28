import type { 
  Course, 
  User, 
  Module, 
  Lesson, 
  Enrollment, 
  LessonCompletion 
} from '@prisma/client'
import type { Quiz, Question, QuizAttempt, QuestionAttempt } from '@prisma/client'

export interface QuizWithQuestions extends Quiz {
  questions: Question[]
}

export interface AttemptWithAnswers extends QuizAttempt {
  questions: QuestionAttempt[]
}
interface CourseWithAuthor extends Course {
  author: User
}

interface ModuleWithLessons extends Module {
  lessons: (LessonWithCompletions)[]
  //course: CourseWithAuthor
}

interface LessonWithCompletions extends Lesson {
  completions: LessonCompletion[]
 // module: ModuleWithCourse
}

interface ModuleWithCourse extends Module {
  course: CourseWithAuthor
}

interface CourseWithRelations extends Course {
  author: User
  modules: ModuleWithLessons[]
  enrollments: Enrollment[]
}

interface LessonWithRelations extends Lesson {
  module: ModuleWithCourse
  completions: LessonCompletion[]
}

export type { 
  CourseWithRelations,
  LessonWithRelations,
  ModuleWithLessons,
  LessonWithCompletions 
}
export interface CourseWithProgress extends Course {
  author: User
  modules: Module[]
  enrollments: Enrollment[]
  // _count: {
  //   enrollments: number
  // }
  progress?: number
}




