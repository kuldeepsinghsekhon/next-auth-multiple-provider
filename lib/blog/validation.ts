import * as z from 'zod'

export const BlogFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  published: z.boolean().default(false),
  categoryIds: z.array(z.string()).min(1, "Select at least one category"),
  tagIds: z.array(z.string())
})