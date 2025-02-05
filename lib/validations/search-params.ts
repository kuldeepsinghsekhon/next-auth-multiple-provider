import { z } from "zod"

export const searchParamsSchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(9),
  category: z.string().optional(),
  tag: z.string().optional(),
  sort: z.enum(['createdAt', 'views', 'comments']).optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc')
})
export type SearchParams = z.infer<typeof searchParamsSchema>