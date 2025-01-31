'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Toolbar } from './toolbar'

export function TiptapEditor({ content, onChange }: { content: string; onChange: (content: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    }
  })

  return (
    <div className="border rounded-md">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="prose dark:prose-invert max-w-none p-4" />
    </div>
  )
}