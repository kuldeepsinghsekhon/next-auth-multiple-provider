'use server'
import { prisma } from '@/lib/prisma'

export async function getComments(
  postId: string,
  page: number = 1,
  limit: number = 5
) {
  const skip = (page - 1) * limit

  const [comments, total] = await prisma.$transaction([
    prisma.comment.findMany({
      where: {
        postId,
        parentId: null // Only fetch top-level comments
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            replies: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    }),
    prisma.comment.count({
      where: {
        postId,
        parentId: null
      }
    })
  ])
  // console.log( "Fgfdgfdgfdg", {
  //   comments,
  //   pagination: {
  //     page,
  //     limit,
  //     total,
  //     hasMore: skip + limit < total
  //   }
  // })
  return {
    comments,
    pagination: {
      page,
      limit,
      total,
      hasMore: skip + limit < total
    }
  }
}