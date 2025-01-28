import { PrismaClient } from '@prisma/client'
import { BLOG_CATEGORIES, BLOG_TAGS, SAMPLE_POSTS } from './blog-data'

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

  // Create posts
  for (const post of SAMPLE_POSTS) {
    await prisma.blogPost.upsert({
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
  }
}