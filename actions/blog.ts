'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { withAuth } from "@/lib/middleware/withAuth"
import slugify from "slugify"

export async function getBlogPost(slug: string) {
  return withAuth(
    'view:blog',
    async () => {
      const post = await prisma.blogPost.findUnique({
        where: { slug },
        include: {
          author: true,
          categories: true,
          tags: true
        }
      })

      if (!post) {
        throw new Error('Post not found')
      }

      return post
    }
  )
}
export async function createBlogPost(data: {
  title: string
  content: string
  excerpt?: string
  coverImage?: string
  videoUrl?: string
  categoryIds: string[]
  tagIds: string[]
  published?: boolean
}) {
  return withAuth(
    'create:blog',
    async () => {
      const session = await auth()
      
      const { categoryIds, tagIds, ...postData } = data

      const post = await prisma.blogPost.create({
        data: {
          ...postData,
          slug: slugify(data.title, { lower: true }),
          authorId: session!.user.id,
          categories: {
            connect: categoryIds.map(id => ({ id }))
          },
          tags: {
            connect: tagIds.map(id => ({ id }))
          }
        }
      })

      revalidatePath('/dashboard/blog')
      return post
    }
  )
}
export async function getBlogPosts() {
  return withAuth(
    'view:blog',
    async () => {
      return prisma.blogPost.findMany({
        include: {
          author: true,
          categories: true,
          tags: true
        },
        orderBy: { createdAt: 'desc' }
      })
    }
  )
}
export async function updateBlogPost(id: string, data: any) {
  const session = await auth()
  
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      ...data,
      slug: slugify(data.title, { lower: true })
    }
  })

  revalidatePath('/dashboard/blog')
  return post
}