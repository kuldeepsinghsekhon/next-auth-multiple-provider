'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { withAuth } from "@/lib/middleware/withAuth"
import slugify from "slugify"
import { z } from "zod"
import { BlogFormSchema } from "@/lib/blog/validation"
import { stringify } from 'csv-stringify/sync'

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
export async function createBlogPost(data: z.infer<typeof BlogFormSchema>) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Unauthorized: No valid session found")
  }


  try {
    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug: slugify(data.title),
        content: data.content,
        excerpt: data.excerpt,
        coverImage: data.coverImage,
        videoUrl: data.videoUrl,
        published: data.published,
        authorId: session.user.id,
        categories: {
          connect: data.categoryIds.map(id => ({ id }))
        },
        tags: {
          connect: data.tagIds.map(id => ({ id }))
        }
      },
      include: {
        author: true,
        categories: true,
        tags: true
      }
    })

    revalidatePath('/blog')
    revalidatePath('/dashboard/blog')
    return post

  } catch (error) {
    console.error('Blog creation error:', error)
    throw new Error(error instanceof Error ? error.message : "Failed to create blog post")
  }
}
export type SortField = 'title' | 'createdAt' | 'updatedAt' | 'published'
export type SortOrder = 'asc' | 'desc'

 export async function getBlogPosts(
  search = '',
  page = 1,
  limit = 10,
  status?: string,
  sort: SortField = 'createdAt',
  order: SortOrder = 'desc'
) {
  const skip = (page - 1) * limit

  const where = {
    AND: [
      search ? {
        OR: [
          { title: { contains: search } },
          { content: { contains: search } }
        ]
      } : {},
      status === 'published' ? { published: true } : 
      status === 'draft' ? { published: false } : {}
    ]
  }

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      skip,
      take: limit,
      include: {
        author: true,
        categories: true,
        tags: true,
        _count: {
          select: {
            comments: true,
            reactions: true
          }
        }
      },
      orderBy: {
        [sort]: order
      }
    }),
    prisma.blogPost.count({ where })
  ])

  return {
    posts,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    total
  }
}
export async function getEditBlogPost(id: string) {
  return withAuth(
    'edit:blog',
    async () => {
      const post = await prisma.blogPost.findUnique({
        where: { id },
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
export async function updateBlogPost(
  id: string,
  data: z.infer<typeof BlogFormSchema>
) {
  return withAuth('edit:blog', async () => {
    try {
      const post = await prisma.blogPost.update({
        where: { id },
        data: {
          title: data.title,
          content: data.content,
          excerpt: data.excerpt,
          coverImage: data.coverImage,
          videoUrl: data.videoUrl,
          published: data.published,
          categories: {
            connect: data.categoryIds.map(id => ({ id }))
          },
          tags: {
            connect: data.tagIds.map(id => ({ id }))
          }
        },
        include: {
          categories: true,
          tags: true,
          author: true
        }
      })

      revalidatePath('/blog')
      revalidatePath('/dashboard/blog')
      return post
      
    } catch (error) {
      console.error('Failed to update blog post:', error)
      throw new Error('Failed to update blog post')
    }
  })
}
export async function deleteBlogPost(id: string) {
  const session = await auth()
  return withAuth('delete:blog', async () => {
    const session = await auth()
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    try {
      // Start a transaction
      await prisma.$transaction(async (tx) => {
        // Delete all comments
        await tx.comment.deleteMany({
          where: { postId: id }
        })

        // Delete all reactions
        await tx.reaction.deleteMany({
          where: { postId: id }
        })

        // Disconnect all categories
        await tx.blogPost.update({
          where: { id },
          data: {
            categories: {
              set: [] // Remove all category connections
            },
            tags: {
              set: [] // Remove all tag connections
            }
          }
        })

        // Finally delete the blog post
        await tx.blogPost.delete({
          where: { id }
        })
      })

      revalidatePath('/blog')
      revalidatePath('/dashboard/blog')

      return { success: true }
    } catch (error) {
      console.error('Failed to delete blog post:', error)
      throw new Error('Failed to delete blog post')
    }
  })
}
export async function addComment(postId: string, content: string, parentId?: string) {
  return withAuth(
    'create:comment',
    async () => {
      const session = await auth()
      
      const comment = await prisma.comment.create({
        data: {
          content,
          postId,
          authorId: session!.user.id,
          parentId
        }
      })

      revalidatePath(`/blog/[slug]`)
      return comment
    }
  )
}

export async function addReaction(postId: string, type: string, add: boolean) {
  return withAuth(
    'react:blog',
    async () => {
      const session = await auth()
      
      if (add) {
        await prisma.reaction.create({
          data: {
            type,
            postId,
            userId: session!.user.id
          }
        })
      } else {
        await prisma.reaction.delete({
          where: {
            postId_userId_type: {
              postId,
              userId: session!.user.id,
              type
            }
          }
        })
      }

      const reactions = await prisma.reaction.groupBy({
        by: ['type'],
        where: { postId },
        _count: true
      })

      const counts = reactions.reduce((acc, { type, _count }) => {
        acc[type] = _count
        return acc
      }, {})

      await prisma.blogPost.update({
        where: { id: postId },
        data: { reactionCounts: counts }
      })

      return counts
    }
  )
}
export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' }
  })
}
export async function getTags() {
  return prisma.tag.findMany({
    orderBy: { name: 'asc' }
  })
}
export async function getAuthors() {
  return prisma.user.findMany({
    where: {
      posts: {
        some: {}
      }
    },
    select: {
      id: true,
      name: true,
      image: true,
      _count: {
        select: {
          posts: true
        }
      }
    },
    orderBy: {
      posts: {
        _count: 'desc'
      }
    }
  })
}