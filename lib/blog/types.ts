export interface BlogSearchParams {
  q: string
  page: number
  category: string
  tag: string
  sort: 'createdAt' | 'views' | 'comments' | 'title'
  order: 'asc' | 'desc'
  status: 'published' | 'draft' | 'all'
}
export interface Category {
  id: string
  name: string
}

export interface Tag {
  id: string
  name: string
}

export interface BlogFiltersProps {
  categories: Category[]
  tags: Tag[]
  initialParams: BlogSearchParams
}