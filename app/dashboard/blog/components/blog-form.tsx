'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Editor } from '@/components/editor'
import { ImageUpload } from '@/components/image-upload'
import { createBlogPost, updateBlogPost } from '@/actions/blog'
import { BlogFormSchema } from '@/lib/blog/validation'
import type { BlogPost } from '@prisma/client'

interface BlogFormProps {
  post?: BlogPost
}

export function BlogForm({ post }: BlogFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('edit')
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(BlogFormSchema),
    defaultValues: {
      title: post?.title || '',
      content: post?.content || '',
      excerpt: post?.excerpt || '',
      coverImage: post?.coverImage || '',
      published: post?.published || false
    }
  })

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true)
      if (post) {
        await updateBlogPost(post.id, data)
      } else {
        await createBlogPost(data)
      }
      router.push('/dashboard/blog')
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="outline"
            >
              Save Draft
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={() => form.setValue('published', true)}
            >
              Publish
            </Button>
          </div>
        </div>

        <TabsContent value="edit" className="space-y-4">
          <Input
            placeholder="Post title"
            {...form.register('title')}
          />
          <ImageUpload
            value={form.watch('coverImage')}
            onChange={(url) => form.setValue('coverImage', url)}
          />
          <Editor
            content={form.watch('content')}
            onChange={(content) => form.setValue('content', content)}
          />
        </TabsContent>

        <TabsContent value="preview">
          <div className="prose dark:prose-invert max-w-none">
            <h1>{form.watch('title')}</h1>
            <div dangerouslySetInnerHTML={{ __html: form.watch('content') }} />
          </div>
        </TabsContent>
      </Tabs>
    </form>
  )
}