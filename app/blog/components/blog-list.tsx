'use client'

import { useState, useCallback, useTransition } from 'react'

import { BlogCard } from './blog-card'
import { Button } from '@/components/ui/button'
import { getBlogPosts } from '@/actions/blog'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import MultiSelect from 'react-select'
import { useSearch } from '@/hooks/use-search'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BlogPost, Category, Tag } from '@prisma/client'

interface BlogListProps {
  posts: BlogPost[]
  categories: Category[]
  tags: Tag[]
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
}
const SORT_OPTIONS = [
  { label: 'Title', value: 'title' },
  { label: 'Most Recent', value: 'createdAt' },
  { label: 'Most Viewed', value: 'views' },
  { label: 'Most Commented', value: 'comments' },
  { label: 'Most Reactions', value: 'reactions' }
]

export function BlogList({
  posts,
  categories = [],
  tags = [],
  currentPage,
  totalPages,
  totalItems,
  pageSize
   }: BlogListProps) {
  const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()
   const [isPending, startTransition] = useTransition()
   const [value, setValue] = useState(searchParams.get('q') ?? '')
   const [isDeleting, setIsDeleting] = useState(false)
   const [postToDelete, setPostToDelete] = useState<string | null>(null)
   const [selectedCategories, setSelectedCategories] = useState<string[]>(
     searchParams.get('categories')?.split(',').filter(Boolean) || []
   )
   const [selectedTags, setSelectedTags] = useState<string[]>(
     searchParams.get('tags')?.split(',').filter(Boolean) || []
   )
   
   const { sortField, sortOrder ,currentLimit,handleSearch,handleLimit} = useSearch()
  
  // const loadMorePosts = useCallback(async () => {
  //   setLoading(true)
  //   const nextPage = page + 1
  //   const { posts: newPosts } = await getBlogPosts({
  //     search: searchParams.q || '',
  //     page: nextPage,
  //     limit: Number(searchParams.limit) || 6,
  //     status: searchParams.status,
  //     sort: searchParams.sort || 'updatedAt',
  //     order: searchParams.order || 'desc',
  //     categories: selectedCategories,
  //     tags: selectedTags
  //   })

  //   setPosts((prevPosts) => [...prevPosts, ...newPosts])
  //   setPage(nextPage)
  //   setLoading(false)
  // }, [page, searchParams, selectedCategories, selectedTags])

  const updateFilters = useCallback((type: 'categories' | 'tags', values: string[]) => {
    const params = new URLSearchParams(searchParams)
    if (values.length) {
      params.set(type, values.join(','))
    } else {
      params.delete(type)
    }
    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
  }, [pathname, searchParams, router])
  const categoryOptions = categories.map(category => ({
    value: category.name,
    label: category.name
  }))

  const tagOptions = tags.map(tag => ({
    value: tag.name,
    label: tag.name
  }))
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
           <Input
              placeholder="Search posts..."
              className="max-w-xs"
              value={value}
              onChange={(e) => handleSearch(e?.target?.value)}
            />
        <MultiSelect
              isMulti
              options={categoryOptions}
              value={categoryOptions.filter(option => selectedCategories.includes(option.value))}
              onChange={(options) => {
                const values = options.map(option => option.value)
                setSelectedCategories(values)
                updateFilters('categories', values)
              }}
              placeholder="Select Categories"
            />

            <MultiSelect
              isMulti
              options={tagOptions}
              value={tagOptions.filter(option => selectedTags.includes(option.value))}
              onChange={(options) => {
                const values = options.map(option => option.value)
                setSelectedTags(values)
                updateFilters('tags', values)
              }}
              placeholder="Select Tags"
            />

            <Select
              value={searchParams.get('sort') || 'createdAt'}
              onValueChange={(value) => {
                const params = new URLSearchParams(searchParams)
                params.set('sort', value)
                router.push(`${pathname}?${params.toString()}`)
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

        <Select
          value={currentLimit}
          onValueChange={handleLimit}
        >
          <SelectTrigger className="w-[110px]">
            <SelectValue placeholder="# per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6">6 per page</SelectItem>
            <SelectItem value="12">12 per page</SelectItem>
            <SelectItem value="24">24 per page</SelectItem>
            <SelectItem value="48">48 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      {/* {page < totalPages && (
        <div className="flex justify-center w-full mt-6">
          <Button onClick={loadMorePosts} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )} */}

      <Pagination
 currentPage={currentPage}
 totalPages={totalPages}
        // onPageChange={(newPage) => {
        //   setPage(newPage)
        //   router.push(`${pathname}?${searchParams.toString()}`)
        // }}
      />
    </div>
  )
}