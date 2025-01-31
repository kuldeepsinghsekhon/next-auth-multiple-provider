'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BlogPost } from '@prisma/client'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface BlogTableProps {
  posts: BlogPost[]
}

export function BlogTable({ posts }: BlogTableProps) {
  return (
    <div className="rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="p-4 text-left font-medium">Title</th>
            <th className="p-4 text-left font-medium">Status</th>
            <th className="p-4 text-left font-medium">Categories</th>
            <th className="p-4 text-left font-medium">Created</th>
            <th className="p-4 text-left font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="border-b">
              <td className="p-4">
                <div className="font-medium">{post.title}</div>
              </td>
              <td className="p-4">
                <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {post.published ? 'Published' : 'Draft'}
                </div>
              </td>
              <td className="p-4">
                {post.categories?.map(category => category.name).join(', ')}
              </td>
              <td className="p-4">
                {formatDate(post.createdAt)}
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/blog/${post.id}`}>
                      Edit
                    </Link>
                  </Button>
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}