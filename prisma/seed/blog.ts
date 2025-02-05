import { PrismaClient } from '@prisma/client'
import { BLOG_CATEGORIES, BLOG_TAGS, SAMPLE_POSTS, SAMPLE_COMMENTS,  SAMPLE_REACTIONS } from './blog-data'

export async function seedBlog(prisma: PrismaClient) {
  console.log('🌱 Seeding blog data...')

  // Create categories
  const categories = await Promise.all(
    BLOG_CATEGORIES.map(category =>
      prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: category
      })
    )
  )

  // Create tags
  const tags = await Promise.all(
    BLOG_TAGS.map(tag =>
      prisma.tag.upsert({
        where: { slug: tag.slug },
        update: {},
        create: tag
      })
    )
  )
  console.log('🌱 Get default author (first admin user)')
  // Get default author (first admin user)
  const author = await prisma.user.findFirst({
    where: { role: { name: 'ADMIN' } },
    include: {
      role: true
    }
  })

  if (!author) throw new Error('No admin user found')

  const users = await prisma.user.findMany({
    where: {
      role: {
        name: {
          in: ['USER', 'ADMIN', 'MANAGER']
        }
      }
    }
  })

  // Create posts
  for (const post of SAMPLE_POSTS) {
    const blogPost = await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        ...post,
        authorId: author.id,
        categories: {
          connect: post.categories.map(slug => ({
            slug
          }))
        },
        tags: {
          connect: post.tags.map(slug => ({
            slug
          }))
        }
      }
    })

    // Seed comments
    for (const commentData of SAMPLE_COMMENTS) {
      const randomUser = users[Math.floor(Math.random() * users.length)]
      
      const comment = await prisma.comment.create({
        data: {
          content: commentData.content,
          postId: blogPost.id,
          authorId: randomUser.id,
        }
      })

      // Add replies
      for (const replyData of commentData.replies) {
        const replyAuthor = users[Math.floor(Math.random() * users.length)]
        await prisma.comment.create({
          data: {
            content: replyData.content,
            postId: blogPost.id,
            authorId: replyAuthor.id,
            parentId: comment.id
          }
        })
      }
    }

    // Seed reactions
    const reactionCounts: Record<string, number> = {}
    
    for (const reactionType of SAMPLE_REACTIONS) {
      // Add 1-5 random reactions of each type
      const numReactions = Math.floor(Math.random() * 5) + 1
      
      for (let i = 0; i < numReactions; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)]
        
        try {
          await prisma.reaction.create({
            data: {
              type: reactionType.type,
              postId: blogPost.id,
              userId: randomUser.id
            }
          })
          
          reactionCounts[reactionType.type] = (reactionCounts[reactionType.type] || 0) + 1
        } catch (error) {
          // Skip if reaction already exists
          continue
        }
      }
    }

    // Update post reaction counts
    await prisma.blogPost.update({
      where: { id: blogPost.id },
      data: {
        reactionCounts: JSON.stringify(reactionCounts),
        views: Math.floor(Math.random() * 1000)
      }
    })
  }

  console.log('✅ Blog posts, comments, and reactions seeded')
}