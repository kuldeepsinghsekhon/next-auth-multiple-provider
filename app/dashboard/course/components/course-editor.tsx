'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ModuleEditor } from './module-editor'
import { QuizEditor } from './quiz-editor'
import { AssignmentEditor } from '../../../course/components/assignment-editor'
import { ScormUploader } from './scorm-uploader'

export function CourseEditor() {
  const [activeTab, setActiveTab] = useState('content')

  return (
    <div className="container mx-auto py-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="scorm">SCORM</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <ModuleEditor />
        </TabsContent>

        <TabsContent value="quizzes">
          <QuizEditor />
        </TabsContent>

        <TabsContent value="assignments">
          <AssignmentEditor />
        </TabsContent>

        <TabsContent value="scorm">
          <ScormUploader />
        </TabsContent>
      </Tabs>
    </div>
  )
}