'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import type { BlogPost, User, Category, Tag } from "@prisma/client"

interface BlogPostWithRelations extends BlogPost {
  author: User
  categories: Category[]
  tags: Tag[]
}

interface BlogListProps {
  posts: BlogPostWithRelations[]
}

export function BlogList({ posts }: BlogListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Card key={post.id}>
          {post.coverImage && (
            <img 
              src={post.coverImage} 
              alt={post.title}
              className="w-full h-48 object-cover"
            />
          )}
          <CardHeader>
            <CardTitle>
              <Link href={`/blog/${post.slug}`}>
                {post.title}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{post.excerpt}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              By {post.author.name}
            </div>
            <div className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}