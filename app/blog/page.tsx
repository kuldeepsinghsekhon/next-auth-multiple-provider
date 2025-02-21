import { Suspense } from 'react'
import { BlogList } from './components/blog-list'
import { getBlogPosts, getCategories, getTags } from '@/actions/blog'

// export interface BlogSearchParams {
//   q: string
//   page: number
//   category: string
//   tag: string
//   sort: string
//   order: 'asc' | 'desc'
// }

// export interface ParsedSearchParams extends BlogSearchParams {
//   limit: number
// }

export default async function BlogPage({
  searchParams,
}: {
  searchParams: {
    q?: string
    page?: string
    status?: string
    limit?: string
    sort?: string
    order?: string
    categories?: string
    tags?: string
  }
}) {
  const search = searchParams.q || ''
  const page = Math.max(1, Number(searchParams.page) || 1)
  const limit = Number(searchParams.limit) || 10
  const status = searchParams.status
  const sort = searchParams.sort || 'updatedAt'
  const order = (searchParams.order as 'asc' | 'desc') || 'desc'
  const categories = searchParams.categories?.split(',').filter(Boolean) || []
  const tags = searchParams.tags?.split(',').filter(Boolean) || []

  const { posts, currentPage, totalPages, total } = await getBlogPosts({
    search,
    page,
    limit,
    status,
    sort,
    order,
    categories,
    tags
  })

  const categoriesList = await getCategories()
  const tagsList = await getTags()

  const categoryOptions = categoriesList.map(category => ({
    value: category.name,
    label: category.name
  }))

  const tagOptions = tagsList.map(tag => ({
    value: tag.name,
    label: tag.name
  }))

  return (
    <div className="container py-6">
      <BlogList 
        pageSize={10}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={total}
        posts={posts}
        categories={categoriesList}
        tags={tagsList}
      />
    </div>
  )
}