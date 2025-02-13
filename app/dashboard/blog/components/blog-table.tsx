'use client'
import React from 'react'
import { useState, useCallback, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {  Download, Settings2, X } from 'lucide-react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Pagination } from '@/components/pagination'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import { BlogPost, Category, Tag } from '@prisma/client'
import { formatDate } from '@/lib/utils'
import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Table
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useSearch } from '@/hooks/use-search'
import { toast } from "@/components/ui/use-toast"
import { deleteBlogPost } from "@/actions/blog"
import { useLocalStorage } from "@/hooks/use-local-storage"

import MultiSelect from 'react-select'
import { BlogTableRow } from './blog-table-row'
import { DeleteDialog } from './delete-dialog'

const SORT_OPTIONS = [
  { label: 'Title', value: 'title' },
  { label: 'Most Recent', value: 'createdAt' },
  { label: 'Most Viewed', value: 'views' },
  { label: 'Most Commented', value: 'comments' },
  { label: 'Most Reactions', value: 'reactions' }
]

const COLUMNS = [
  { key: 'title', label: 'Title', defaultVisible: true },
  { key: 'slug', label: 'slug', defaultVisible: true },
  { key: 'status', label: 'Status', defaultVisible: true },
  { key: 'categories', label: 'Categories', defaultVisible: true },
  { key: 'tags', label: 'Tags', defaultVisible: false },
  { key: 'views', label: 'Views', defaultVisible: false },
  { key: 'comments', label: 'Comments', defaultVisible: false },
  { key: 'reactions', label: 'Reactions', defaultVisible: false },
  { key: 'createdAt', label: 'Created At', defaultVisible: true },
  { key: 'actions', label: 'Actions', defaultVisible: true }
]

interface BlogTableProps {
  posts: BlogPost[]
  categories: Category[]
  tags: Tag[]
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
}
import Link from 'next/link'

export function BlogTable({
  posts,
  categories = [],
  tags = [],
  currentPage,
  totalPages,
  totalItems,
  pageSize
}: BlogTableProps) {
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
  const [visibleColumns, setVisibleColumns] = useLocalStorage(
    'blog-table-columns',
    COLUMNS.reduce((acc, col) => ({ ...acc, [col.key]: col.defaultVisible }), {})
  )

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true)
      await deleteBlogPost(id)
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setPostToDelete(null)
    }
  }


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
    <Card>
      <CardHeader>
        <CardTitle>        
                <div className="flex justify-between items-center mb-1">
                Blogs
                  <Button asChild>
                    <Link href="/dashboard/blog/create">Create Post</Link>
                  </Button>
                </div>
          </CardTitle>        

        <CardDescription>
          Manage your products and view their sales performance.
        </CardDescription>
      </CardHeader>
      <CardContent>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Search posts..."
              className="max-w-xs"
              value={value}
              onChange={(e) => handleSearch(e?.target?.value)}
            />
            <Select
              defaultValue={searchParams.get('status') ?? 'all'}
              onValueChange={(value) => {
                router.push(`${pathname}?${createQueryString('status', value)}`)
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Posts</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Drafts</SelectItem>
              </SelectContent>
            </Select>

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
        disabled={isPending}
      >
        <SelectTrigger className="w-[110px]">
          <SelectValue placeholder="# per page" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10 per page</SelectItem>
          <SelectItem value="20">20 per page</SelectItem>
          <SelectItem value="50">50 per page</SelectItem>
          <SelectItem value="100">100 per page</SelectItem>
        </SelectContent>
      </Select>
            <Button
              variant="outline"
              onClick={() => handleExport()}
              className="ml-auto"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings2 className="h-4 w-4 mr-2" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {COLUMNS.map(column => (
                  <DropdownMenuCheckboxItem
                    key={column.key}
                    checked={visibleColumns[column.key]}
                    onCheckedChange={(checked) => {
                      setVisibleColumns(prev => ({
                        ...prev,
                        [column.key]: checked
                      }))
                    }}
                  >
                    {column.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* {(selectedCategories.length > 0 || selectedTags.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map(id => {
                const category = categories.find(c => c.id === id)
                return category ? (
                  <Badge
                    key={id}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {category.name}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => {
                        const newSelection = selectedCategories.filter(cid => cid !== id)
                        setSelectedCategories(newSelection)
                        updateFilters('categories', newSelection)
                      }}
                    />
                  </Badge>
                ) : null
              })}
              {selectedTags.map(id => {
                const tag = tags.find(t => t.id === id)
                return tag ? (
                  <Badge
                    key={id}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag.name}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => {
                        const newSelection = selectedTags.filter(tid => tid !== id)
                        setSelectedTags(newSelection)
                        updateFilters('tags', newSelection)
                      }}
                    />
                  </Badge>
                ) : null
              })}
            </div>
          )} */}
          {isPending ? (
            <div>Loading...</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {COLUMNS.map(column =>
                      visibleColumns[column.key] && (
                        <TableHead key={column.key}>
                          {column.label}
                        </TableHead>
                      )
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <BlogTableRow
                      key={post.id}
                      post={post}
                      visibleColumns={visibleColumns}
                      onDelete={setPostToDelete}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
        <DeleteDialog
          open={!!postToDelete}
          onClose={() => setPostToDelete(null)}
          onConfirm={() => postToDelete && handleDelete(postToDelete)}
          isDeleting={isDeleting}
        />
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {posts.length} of {totalItems} posts
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            // pageSize={pageSize}
            // onPageChange={handlePageChange}
            // onPageSizeChange={handlePageSizeChange}
    
         />
        </div>
      </CardFooter>
    </Card>
  )
}