'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
//import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Editor } from '@/components/editor'
import { ImageUpload } from '@/components/image-upload'
import { createBlogPost, updateBlogPost } from '@/actions/blog'
import { BlogFormSchema } from '@/lib/blog/validation'
import type { BlogPost } from '@prisma/client'
import { getCategories } from '@/actions/category'
import type { Category,Tag } from '@prisma/client'
import { getTags } from '@/actions/tag'
import { MultiSelect } from '@/components/ui/multi-select'
import { toast } from '@/components/ui/use-toast'
import Select from 'react-select'
import { EditorSwitch } from './editor-switch'
import { TiptapEditor } from './tiptap-editor'
import { MarkdownEditor } from './markdown-editor'


interface BlogFormProps {
  post?: BlogPost
}

export function BlogForm({ post }: BlogFormProps) {
  const [isMarkdown, setIsMarkdown] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [mounted, setMounted] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('edit')
  const router = useRouter()
  const categoryOptions = categories.map(category => ({
    value: category.id,
    label: category.name
  }))

  const tagOptions = tags.map(tag => ({
    value: tag.id,
    label: tag.name
  }))
  const form = useForm({
    resolver: zodResolver(BlogFormSchema),
    defaultValues: {
      title: post?.title || '',
      content: post?.content || '',
      excerpt: post?.excerpt || '',
      coverImage: post?.coverImage || '',
      videoUrl: post?.videoUrl || '',
      published: post?.published || false,
      categoryIds: post?.categories?.map(c => c.id) || [],
      tagIds: post?.tags?.map(t => t.id) || []
    }
  })
  useEffect(() => {
    async function fetchData() {
    
      const [categoriesData, tagsData] = await Promise.all([
        getCategories(),
        getTags()
      ])
      setCategories(categoriesData)
      setTags(tagsData)
      setIsLoading(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const onSubmit = async (data: z.infer<typeof BlogFormSchema>) => {
    try {
      setIsSubmitting(true)
      if (post) {
        await updateBlogPost(post.id, data)
        toast({
          title: "Success",
          description: "Blog post updated successfully",
        })
      } else {
        await createBlogPost(data)
        toast({
          title: "Success",
          description: "Blog post created successfully",
        })
      }
      router.push('/dashboard/blog')
      router.refresh()
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save blog post",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
<Select
            className="react-select"
            classNamePrefix="react-select"
            options={categoryOptions}
            isDisabled={isLoading}
            placeholder="Select category"
            onChange={(option) => {
              form.setValue('categoryIds', [option?.value || ''])
            }}
            value={categoryOptions.find(
              option => option.value === form.watch('categoryIds')[0]
            )}
          />
          
          <Select
            isMulti
            className="react-select"
            classNamePrefix="react-select"
            options={tagOptions}
            isDisabled={isLoading}
            placeholder="Select tags"
            onChange={(options) => {
              form.setValue(
                'tagIds',
                options?.map(option => option.value) || []
              )
            }}
            value={tagOptions.filter(option => 
              form.watch('tagIds').includes(option.value)
            )}
          />
          <ImageUpload
            value={form.watch('coverImage')}
            onChange={(url) => form.setValue('coverImage', url)}
          />
          {/* <Editor
            content={form.watch('content')}
            onChange={(content) => form.setValue('content', content)}
          /> */}
           <EditorSwitch onChange={setIsMarkdown} />
        </TabsContent>
        {isMarkdown ? (
        <MarkdownEditor
          content={form.watch('content')}
          onChange={(content) => form.setValue('content', content)}
        />
      ) : (
        <TiptapEditor
          content={form.watch('content')}
          onChange={(content) => form.setValue('content', content)}
        />
      )}
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