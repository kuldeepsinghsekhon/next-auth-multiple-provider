import React from 'react'
import { TableRow, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { BlogPost, Category, Tag } from '@prisma/client'
import { useRouter } from 'next/navigation'

interface BlogTableRowProps {
  post: BlogPost & { categories: Category[], tags: Tag[] }
  visibleColumns: Record<string, boolean>
  onDelete: (postId: string) => void
}

export function BlogTableRow({ post, visibleColumns, onDelete }: BlogTableRowProps) {
  const router = useRouter()

  return (
    <TableRow>
      {visibleColumns.title && <TableCell>{post.title}</TableCell>}
      {visibleColumns.slug && <TableCell>{post.slug}</TableCell>}
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
      {visibleColumns.views && <TableCell>{post.views}</TableCell>}
      {visibleColumns.comments && <TableCell>{post._count?.comments || 0}</TableCell>}
      {visibleColumns.reactions && <TableCell>{post._count?.reactions || 0}</TableCell>}
      {visibleColumns.createdAt && <TableCell>{formatDate(post.createdAt, 'PP')}</TableCell>}
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
              <DropdownMenuItem onClick={() => onDelete(post.id)} className="text-red-600">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      )}
    </TableRow>
  )
}