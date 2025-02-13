'use client'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { BlogPost, User, Category, Tag } from '@prisma/client'
import { MessageSquare, ThumbsUp } from 'lucide-react'

interface BlogCardProps {
  post: BlogPost & {
    author: User
    categories: Category[]
    tags: Tag[]
    _count: {
      comments: number
      reactions: number
    }
  }
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
        {post?.coverImage && (
          <div className="aspect-video w-full overflow-hidden">
            <img 
              src={post.coverImage} 
              alt={post.title}
              className="object-cover w-full h-full" 
            />
          </div>
        )}
        <CardHeader>
          <div className="flex gap-2">
            {post.categories.map(category => (
              <span 
                key={category.id}
                className="text-xs bg-muted px-2 py-1 rounded-full"
              >
                {category.name}
              </span>
            ))}
          </div>
          <CardTitle className="line-clamp-2">{post.title}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {post?.author?.image && (
              <img 
                src={post.author.image}
                alt={post.author.name ?? ''}
                className="w-6 h-6 rounded-full"
              />
            )}
            <span>{post?.author?.name}</span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              {post._count.comments}
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" />
              {post._count.reactions}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}