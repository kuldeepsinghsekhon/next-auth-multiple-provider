import { Suspense } from 'react'
import { getBlogPosts } from '@/actions/blog'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import  {BlogTable}  from './components/blog-table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
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
  
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

   const {posts,currentPage,totalPages,total} = await getBlogPosts(
     search,
     page,
     limit,
    status,
     sort,
     order
  //
   )

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Button asChild>
          <Link href="/dashboard/blog/create">Create Post</Link>
        </Button>
      </div>

      <Suspense fallback={<div>Loading posts...</div>}>
      <BlogTable  posts={posts}     />
      </Suspense>
    </div>
  )
}

export const metadata = {
  title: 'Blog Posts',
  description: 'Manage your blog posts'
}