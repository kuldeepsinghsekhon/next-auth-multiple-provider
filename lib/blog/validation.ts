import * as z from "zod"

export const BlogFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  videoUrl: z.string().optional(),
  published: z.boolean().default(false),
  categoryIds: z.array(z.string()).min(1, "At least one category is required"),
  tagIds: z.array(z.string())
})

export const searchParamsSchema = z.object({
  q: z.string().optional(),
  page: z.string().transform(Number).optional().default('1'),
  category: z.string().optional(),
  tag: z.string().optional(),
  author: z.string().optional(),
  sort: z.enum(['createdAt', 'views', 'comments']).optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc')
})

export type SearchParams = z.infer<typeof searchParamsSchema>