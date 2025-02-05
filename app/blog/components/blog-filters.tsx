'use client'

import { useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

interface FilterParams {
  q?: string
  category?: string
  tag?: string
  sort?: string
  order?: 'asc' | 'desc'
}

interface BlogFiltersProps {
  categories: Category[]
  tags: Tag[]
  initialParams: FilterParams
}

export function BlogFilters({ categories, tags, initialParams }: BlogFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback((updates: FilterParams) => {
    const params = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    return params.toString()
  }, [searchParams])

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <Input
        placeholder="Search posts..."
        defaultValue={initialParams.q}
        onChange={(e) => {
          router.push(`${pathname}?${createQueryString({ q: e.target.value })}`)
        }}
        className="max-w-xs"
      />

      <Select
        defaultValue={initialParams.category}
        onValueChange={(value) => {
          router.push(`${pathname}?${createQueryString({ category: value })}`)
        }}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={initialParams.sort}
        onValueChange={(value) => {
          router.push(`${pathname}?${createQueryString({ sort: value })}`)
        }}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt">Most Recent</SelectItem>
          <SelectItem value="views">Most Viewed</SelectItem>
          <SelectItem value="comments">Most Comments</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}