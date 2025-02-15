'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
const REACTION_VALUES = {
    'SMILE': 1,
    'LIKE': 2,
    'HEART': 3,
    'STAR': 4
  }
  
  export async function getUserReactions(userId: string) {
    return prisma.reaction.findMany({
      where: { userId },
      include: {
        post: {
          include: {
            author: {
              include: {
                authorProfile: true
              }
            },
            categories: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }
  
  export async function addReactionWithScore(postId: string, type: string, add: boolean) {
    return withAuth(
      'react:blog',
      async () => {
        const session = await auth()
        const value = REACTION_VALUES[type] || 1
        
        if (add) {
          await prisma.$transaction(async (tx) => {
            // Create reaction
            await tx.reaction.create({
              data: {
                type,
                value,
                postId,
                userId: session!.user.id
              }
            })
  
            // Update author's score
            const post = await tx.blogPost.findUnique({
              where: { id: postId },
              include: { author: true }
            })
  
            if (post?.author.authorProfile) {
              await tx.authorProfile.update({
                where: { userId: post.authorId },
                data: {
                  reactionScore: { increment: value }
                }
              })
            }
          })
        } else {
          // Similar transaction for removing reaction
          // ... implement removal logic
        }
  
        // Return updated counts
        const reactions = await prisma.reaction.groupBy({
          by: ['type'],
          where: { postId },
          _count: true
        })
  
        return reactions
      }
    )
  }