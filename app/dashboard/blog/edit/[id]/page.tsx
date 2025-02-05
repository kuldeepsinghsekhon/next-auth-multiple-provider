'use server'

import { getEditBlogPost } from '@/actions/blog'
import { BlogForm } from '../../components/blog-form'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'

interface EditBlogPageProps {
  params: { id: string }
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
 const {id}= await params;
  const session = await auth()
  
  if (!session?.user) {
    //redirect('/auth/signin?callbackUrl=/dashboard/blog/edit/${params.id}')
  }

  try {
    const post = await getEditBlogPost(id)

    if (!post) {
      return notFound()
    }

    // Check if user has permission to edit this post
    if (post.authorId !== session.user.id) {
      console.log(session)
      //redirect('/dashboard/blog')
    }

    return (
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Edit Blog Post</h1>
          <p className="text-muted-foreground">
            Make changes to your blog post here.
          </p>
        </div>
        <BlogForm post={post} />
      </div>
    )
  } catch (error) {
    console.error('Error loading blog post:', error)
    redirect('/dashboard/blog')
  }
}

export async function generateMetadata({ params }: EditBlogPageProps) {
  const {id}= await params;
  const post = await getEditBlogPost(id)
  
  return {
    title: `Edit - ${post?.title || 'Blog Post'}`,
    description: 'Edit your blog post'
  }
}