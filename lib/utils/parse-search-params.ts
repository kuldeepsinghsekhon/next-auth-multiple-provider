import type { BlogSearchParams } from '../blog/types'

export function validateSearchParams(params: Record<string, string | string[] | undefined>): BlogSearchParams {
  const validatedParams: BlogSearchParams = {
    q: typeof params.q === 'string' ? params.q : '',
    page: Number(params.page) || 1,
    category: typeof params.category === 'string' ? params.category : '',
    tag: typeof params.tag === 'string' ? params.tag : '',
    sort: (params.sort as BlogSearchParams['sort']) || 'createdAt',
    order: (params.order as 'asc' | 'desc') || 'desc',
    status: (params.status as BlogSearchParams['status']) || 'published'
  }
  return validatedParams
}