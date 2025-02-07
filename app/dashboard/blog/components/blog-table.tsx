'use client'
import React from 'react'
import { useState, useCallback, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MoreHorizontal, ArrowUpDown, Download, Check, ChevronDown, Settings2 } from 'lucide-react'
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
import Link from 'next/link'
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
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useSearch } from '@/hooks/use-search'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { deleteBlogPost } from "@/actions/blog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getCategories } from '@/actions/category'
import { getTags } from '@/actions/tag'
import { getBlogPosts } from '@/actions/blog'
import { useLocalStorage } from "@/hooks/use-local-storage"
import { ItemsSearch } from '@/components/Items-search'
import { cn } from '@/lib/utils'
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
  const [visibleColumns, setVisibleColumns] = useLocalStorage(
    'blog-table-columns',
    COLUMNS.reduce((acc, col) => ({ ...acc, [col.key]: col.defaultVisible }), {})
  )
console.log('categories',categories)
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const handleSearch = useCallback(
    (term: string) => {
      setValue(term)
      startTransition(() => {
        const params = new URLSearchParams(searchParams)
        params.set('q', term)
        params.set('page', '1') // Reset to first page on search
        router.push(`${pathname}?${params.toString()}`)
      })
    },
    [pathname, router, searchParams]
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
  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(page))
    router.push(`${pathname}?${params.toString()}`)
  }, [pathname, searchParams, router])

  const handlePageSizeChange = useCallback((size: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('limit', String(size))
    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
  }, [pathname, searchParams, router])

  const { sortField, sortOrder } = useSearch()


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

  return (
    <Card>
      <CardHeader>

        <CardTitle>Blogs</CardTitle>
        <CardDescription>
          Manage your products and view their sales performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
    <ItemsSearch/>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Search posts..."
              className="max-w-xs"
              value={value}
              onChange={(e) => handleSearch(e.target.value)}
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
 
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  Categories
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search categories..." />
                  <CommandEmpty>No categories found.</CommandEmpty>
                  <CommandGroup>
                 
                    {categories.map((category) => (
                    
                      <CommandItem
                        key={category.id}
                        onSelect={() => {
                          const newSelection = selectedCategories.includes(category.id)
                            ? selectedCategories.filter(id => id !== category.id)
                            : [...selectedCategories, category.id]
                          setSelectedCategories(newSelection)
                          updateFilters('categories', newSelection)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedCategories.includes(category.id) 
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {category.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  Tags
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search tags..." />
                  <CommandEmpty>No tags found.</CommandEmpty>
                  <CommandGroup>
                    {tags.map((tag) => (
                      <CommandItem
                        key={tag.id}
                        onSelect={() => {
                          const newSelection = selectedTags.includes(tag.id)
                            ? selectedTags.filter(id => id !== tag.id)
                            : [...selectedTags, tag.id]
                          setSelectedTags(newSelection)
                          updateFilters('tags', newSelection)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedTags.includes(tag.id) 
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {tag.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
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
          {(selectedCategories.length > 0 || selectedTags.length > 0) && (
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
          )}
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
                    <TableRow key={post.id}>
                      {visibleColumns.title && (
                        <TableCell>{post.title}</TableCell>
                      )}
                                            {visibleColumns.title && (
                        <TableCell>{post.slug}</TableCell>
                      )}
                      {visibleColumns.status && (
                        <TableCell>
                          <Badge variant={post.published ? "success" : "warning"}>
                            {post.published ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                      )}
                      {visibleColumns.categories && (
                        <TableCell>
                          <div className="flex gap-1">
                            {post.categories.map(cat => (
                              <Badge key={cat.id} variant="outline">
                                {cat.name}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.tags && (
                        <TableCell>
                          <div className="flex gap-1">
                            {post.tags.map(tag => (
                              <Badge key={tag.id} variant="secondary">
                                {tag.name}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.views && (
                        <TableCell>{post.views}</TableCell>
                      )}
                      {visibleColumns.comments && (
                        <TableCell>{post._count?.comments || 0}</TableCell>
                      )}
                      {visibleColumns.reactions && (
                        <TableCell>{post._count?.reactions || 0}</TableCell>
                      )}
                      {visibleColumns.createdAt && (
                        <TableCell>{formatDate(post.createdAt, 'PP')}</TableCell>
                      )}
                      {visibleColumns.actions && (
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/dashboard/blog/edit/${post.id}`)}>
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setPostToDelete(post.id)}
                                className="text-red-600"
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
        <AlertDialog open={!!postToDelete} onOpenChange={() => setPostToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the blog post
                and all its associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => postToDelete && handleDelete(postToDelete)}
                className="bg-red-600 hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {posts.length} of {totalItems} posts
          </p>
         <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
        </div>
      </CardFooter>
    </Card>
  )
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const page = Number(searchParams.page) || 1
  const limit = Number(searchParams.limit) || 25
  
  const [posts, categories, tags] = await Promise.all([
    getBlogPosts(
      searchParams.q || '',
      page,
      limit,
      searchParams.status,
      searchParams.sort as SortField,
      searchParams.order as SortOrder
    ),
    getCategories(),
    getTags()
  ])

  return (
    <div className="container py-6">
    
      <BlogTable
        posts={posts.posts}
        categories={categories}
        tags={tags}
        currentPage={posts.currentPage}
        totalPages={posts.totalPages}
        totalItems={posts.total}
        pageSize={limit}
      />
    </div>
  )
}