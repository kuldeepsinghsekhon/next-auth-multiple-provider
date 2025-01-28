import { BlogEditor } from './components/editor-content'
import { EditorHeader } from './components/editor-header'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function BlogEditorPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/blog/editor')
  }

  return (
    <div className="min-h-screen bg-background">
      <EditorHeader />
      <main className="container mx-auto py-6">
        <BlogEditor />
      </main>
    </div>
  )
}