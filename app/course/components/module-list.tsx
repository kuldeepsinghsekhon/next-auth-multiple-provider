'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Check } from 'lucide-react'
import Link from 'next/link'
import type { Module, Lesson, LessonCompletion } from '@prisma/client'
import { cn } from '@/lib/utils'

interface ModuleListProps {
  modules: (Module & {
    lessons: (Lesson & {
      completions: LessonCompletion[]
    })[]
  })[]
}

export function ModuleList({ modules }: ModuleListProps) {
  return (
    <Accordion type="single" collapsible className="space-y-4">
      {modules.map((module) => (
        <AccordionItem key={module.id} value={module.id}>
          <AccordionTrigger>{module.title}</AccordionTrigger>
          <AccordionContent>
            <div className="pl-4 space-y-2">
              {module.lessons.map((lesson) => {
                const isCompleted = lesson.completions?.length > 0
                return (
                  <Link 
                    key={lesson.id}
                    href={`/course/lesson/${lesson.id}`}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg hover:bg-muted",
                      isCompleted && "text-green-500"
                    )}
                  >
                    <Check className={cn(
                      "w-4 h-4",
                      isCompleted ? "opacity-100" : "opacity-0"
                    )} />
                    <span>{lesson.title}</span>
                  </Link>
                )
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}