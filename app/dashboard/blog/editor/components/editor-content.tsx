'use client'

import { useState } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { cn } from '@/lib/utils'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'

export const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code || []), 'className', 'language'],
    pre: [...(defaultSchema.attributes?.pre || []), 'className', 'language']
  }
}
interface EditorProps {
  content: string
  onChange: (value: string) => void
  className?: string
}

export function BlogEditor({ content, onChange, className }: EditorProps) {
  const [preview, setPreview] = useState<'edit' | 'preview'>('edit')

  return (
    <div className={cn('w-full', className)} data-color-mode="dark">
      <div className="border rounded-lg overflow-hidden">
        <MDEditor
          value={content}
          onChange={(val) => onChange(val || '')}
          preview={preview}
          height={500}
          visibleDragbar={false}
          enableScroll={true}
          textareaProps={{
            placeholder: 'Write your content here...'
          }}
          previewOptions={{
            rehypePlugins: [[rehypeSanitize]],
            components: {
              code: ({inline, children, className}) => {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <pre className={className}>
                    <code className={className}>{children}</code>
                  </pre>
                ) : (
                  <code className={className}>{children}</code>
                )
              }
            }
          }}
        />
      </div>
    </div>
  )
}