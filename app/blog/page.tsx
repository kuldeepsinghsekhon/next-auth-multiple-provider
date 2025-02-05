import { Suspense } from 'react'
import { BlogList } from './components/blog-list'
import { BlogFilters } from './components/blog-filters'
import { getBlogPosts } from '@/actions/blog'
import { getCategories, getTags } from '@/actions/blog'
//import type { BlogSearchParams } from './types'
export interface BlogSearchParams {
  q: string
  page: number
  category: string
  tag: string
  sort: string
  order: 'asc' | 'desc'
}

export interface ParsedSearchParams extends BlogSearchParams {
  limit: number
}
export default async function BlogPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const searchParam = await searchParams;
   const search = searchParam.q ?? ''
   const page = Math.max(1, Number(searchParam.page) || 1)
   const limit = Number(searchParam.limit) || 10
   const status = searchParam.status
   const sort = searchParam.sort || 'updatedAt'
   const order = (searchParam.order as 'asc' | 'desc') || 'desc'

   const {posts,currentPage,totalPages,total} = await getBlogPosts(
    search,
    page,
    limit,
   status,
    sort,
    order
  )

  const [ categories, tags] = await Promise.all([
    getCategories(),
    getTags()
  ])

  return (
    <div className="container py-6">
      <BlogFilters 
        categories={categories}
        tags={tags}
        initialParams={searchParam}
      />
      <BlogList posts={posts} page={currentPage}  totalPages={totalPages} total ={total} />
    </div>
  )
}