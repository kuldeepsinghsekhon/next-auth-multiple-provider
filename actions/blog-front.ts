'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { withAuth } from "@/lib/middleware/withAuth"
import slugify from "slugify"
import { z } from "zod"

import type { BlogSearchParams } from '@/lib/blog/types'

export async function getBlogPosts(params: BlogSearchParams) {
  const {
    q = '',
    page = 1,
    category,
    tag,
    sort = 'createdAt',
    order = 'desc',
    status = 'published'
  } = params

  const take = 10
  const skip = (page - 1) * take

  const where = {
    ...(q && {
      OR: [
        { title: { contains: q } },
        { content: { contains: q } }
      ]
    }),
    ...(category && {
      categories: { some: { id: category } }
    }),
    ...(tag && {
      tags: { some: { id: tag } }
    }),
    ...(status !== 'all' && { published: status === 'published' })
  }

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
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
      orderBy: { [sort]: order },
      skip,
      take
    }),
    prisma.blogPost.count({ where })
  ])

  return {
    posts,
    currentPage: page,
    totalPages: Math.ceil(total / take),
    total
  }
}