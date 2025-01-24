import { Suspense } from 'react'
import { BlogList } from '@/app/blog/components/blog-list'
import { getBlogPosts } from '@/actions/blog'
import { ErrorBoundary } from 'react-error-boundary'

export default async function BlogPage() {
  const posts = await getBlogPosts()
  
  return (
    <div className="container py-6">
      <ErrorBoundary fallback={<div>Error loading blog posts</div>}>
        <Suspense fallback={<div>Loading posts...</div>}>
          <BlogList posts={posts} />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}