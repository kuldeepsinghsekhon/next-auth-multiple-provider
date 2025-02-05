'use client'
import { BlogCard } from './blog-card'
import { Button } from '@/components/ui/button'
interface BlogListProps {
  posts: any[]
  hasMore: boolean
  total: number
  page: number
  totalPages: number
}
import { useCallback } from 'react';
import { useRouter,usePathname,useSearchParams } from 'next/navigation';

export function BlogList({ posts,page,totalPages,total }: BlogListProps) {
   const searchParams = useSearchParams()
   const router = useRouter()
   const createQueryString = useCallback(
     (name: string, value: string) => {
       const params = new URLSearchParams(searchParams)
       params.set(name, value)
       return params.toString()
     },
     [searchParams]
   )
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
              <div className="flex w-full items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {posts.length} of {total} products
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => 
                router.push(
                  `${pathname}?${createQueryString('page', String(currentPage - 1))}`
                )
              }
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => 
                router.push(
                  `${pathname}?${createQueryString('page', String(currentPage + 1))}`
                )
              }
            >
              Next
            </Button>
          </div>
        </div>
    </div>
  )
}