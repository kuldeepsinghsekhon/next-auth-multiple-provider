import { Suspense } from 'react'
import { getBlogPosts, getCategories, getTags } from '@/actions/blog'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { BlogTable } from './components/blog-table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/signin')
  }

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

  return (
    <div className="container py-6">
      <Suspense fallback={<div>Loading posts...</div>}>
        <BlogTable
          pageSize={10}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={total}
          posts={posts}
          categories={categoriesList}
          tags={tagsList}
        />
      </Suspense>
    </div>
  )
}

export const metadata = {
  title: 'Blog Posts',
  description: 'Manage your blog posts'
}