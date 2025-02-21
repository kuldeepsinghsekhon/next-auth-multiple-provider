'use server'
import { Suspense } from 'react'
import { getBlogPost } from '@/actions/blog'
import { notFound } from 'next/navigation'
import { BlogPostContent } from '../components/blog-post-content'
import type { Metadata } from 'next'
import { AuthorShortProfile } from '../components/author-short-profile'
import { getAuthorProfile } from '@/actions/author'
import { CommentLoading } from '../components/comment-loading'
import { ClientCommentSection } from '../components/client-comment-section'
import { ClientReactionButtons } from '../components/client-reaction-buttons'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const {slug} = await params
  const post = await getBlogPost(slug)
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: post.coverImage ? [{ url: post.coverImage }] : []
    }
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  
  try {
    const {slug} = await params
    const post = await getBlogPost(slug)
    if (!post) {
      notFound()
    }

    const authorProfile = await getAuthorProfile(post.authorId)

    return (
      <article className="container py-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div className="space-y-6">
          <BlogPostContent post={post} />
          <Suspense fallback={<CommentLoading />}>
            <ClientCommentSection postId={post.id} />
          </Suspense>
        </div>
        <aside className="space-y-6">
          {authorProfile && (
            <AuthorShortProfile profile={authorProfile} />
          )}
          <ClientReactionButtons postId={post.id} initialCounts={post.reactionCounts || {}} />
        </aside>
      </article>
    )
  } catch (error) {
    console.error('Error loading blog post page:', error)
    throw error
  }
}