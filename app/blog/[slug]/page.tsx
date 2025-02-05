import { Suspense } from 'react'
import { getBlogPost } from '@/actions/blog'
import { notFound } from 'next/navigation'
import { BlogPostContent } from '../components/blog-post-content'
import type { Metadata } from 'next'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const {slug}= await params
  const post = await getBlogPost(slug)
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: post.coverImage ? [{ url: post.coverImage }] : []
    }
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const {slug}= await params
  const post = await getBlogPost(slug).catch(() => null)

  if (!post) {
    notFound()
  }

  return (
    <article className="container py-6">
      
      <Suspense fallback={<div>Loading post...</div>}>
        <BlogPostContent post={post} />
      </Suspense>
    </article>
  )
}