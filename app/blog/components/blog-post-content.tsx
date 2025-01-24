'use client'

import { MDXRemote } from 'next-mdx-remote/rsc'
import { useMDXComponents } from '@/lib/blog/mdx-components'
import { formatDistanceToNow } from 'date-fns'
import type { BlogPost, User, Category } from '@prisma/client'

interface BlogPostWithRelations extends BlogPost {
  author: User
  categories: Category[]
}

export function BlogPostContent({ post }: { post: BlogPostWithRelations }) {
    const components = useMDXComponents()
      return (
    <>
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full aspect-video object-cover rounded-lg"
        />
      )}
      
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <div className="text-sm text-muted-foreground mt-2">
          By {post.author.name} • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </div>
      </header>

      <div className="prose prose-zinc dark:prose-invert max-w-none">
      <MDXRemote source={post.content} components={components} />
    </div>

      <footer className="mt-8 pt-4 border-t">
        <div className="flex gap-2">
          {post.categories.map(category => (
            <span key={category.id} className="text-sm bg-muted px-2 py-1 rounded">
              {category.name}
            </span>
          ))}
        </div>
      </footer>
    </>
  )
}