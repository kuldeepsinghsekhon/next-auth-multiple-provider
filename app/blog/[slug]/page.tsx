import { Suspense } from 'react'
import { getBlogPost } from '@/actions/blog'
import { notFound } from 'next/navigation'
import { BlogPostContent } from '../components/blog-post-content'
import type { Metadata } from 'next'
import { AuthorShortProfile } from '../components/author-short-profile'
import { getAuthorProfile } from '@/actions/author'
import { ReactionButtons } from '../components/reaction-buttons'
interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params
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
  const { slug } = params
  const post = await getBlogPost(slug).catch(() => null)

  if (!post) {
    notFound()
  }

  const authorProfile = await getAuthorProfile(post.authorId)

  return (
    <article className="container py-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
      <div>
        <Suspense fallback={<div>Loading post...</div>}>
          <BlogPostContent post={post} />
        </Suspense>
      </div>
      <aside className="space-y-6">
        {authorProfile && (
          <AuthorShortProfile profile={authorProfile} />
        )}
        <ReactionButtons postId={post.id} />
      </aside>
    </article>
  )
}