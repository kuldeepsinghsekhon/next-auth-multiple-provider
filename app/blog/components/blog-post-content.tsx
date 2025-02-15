'use client'

import { MDXRemote } from 'next-mdx-remote/rsc'
import { useMDXComponents } from '@/lib/blog/mdx-components'
import { formatDistanceToNow } from 'date-fns'
import { Clock, Eye } from 'lucide-react'
import type { BlogPost, User, Category } from '@prisma/client'
import { TableOfContents } from './table-of-contents'
import { ShareButtons } from './share-buttons'
import { CommentSection } from './comment-section'
import { ReactionButtons } from './reaction-buttons'


interface BlogPostWithRelations extends BlogPost {
  author: User
  categories: Category[]
}
function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}
export function BlogPostContent({ post }: { post: BlogPostWithRelations }) {
    const components = useMDXComponents()
    const readTime = calculateReadTime(post.content)

      return (
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-8">
            <TableOfContents content={post.content} />
          </div>
        </aside>
        <article>
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full aspect-video object-cover rounded-lg"
        />
      )}
      
      <header className="mb-8">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {readTime} min read
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {post.views || 0} views
            </div>
            <div>
              Published {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </div>
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

   

        
        <ShareButtons 
          url={`/blog/${post.slug}`}
          title={post.title}
          description={post.excerpt || ''}
        />
        
        <CommentSection
          postId={post.id}
          comments={post.comments}
        />
        </footer>
      </article>
    </div>
  )
}