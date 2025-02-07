import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import{RESPONSE_FORMATS} from "@/lib/response-constants"
import { stringify } from 'csv-stringify/sync'



export async function getDashboardStats() {
  const [
    totalUsers,
    totalPosts,
    totalRoles,
    totalPermissions,
    popularPosts
  ] = await Promise.all([
    prisma.user.count(),
    prisma.blogPost.count(),
    prisma.role.count(),
    prisma.permission.count(),
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { views: 'desc' },
      take: 5,
      select: {
        title: true,
        views: true,
        _count: {
          select: {
            comments: true
          }
        }
      }
    })
  ])

  return {
    totalUsers,
    totalPosts,
    totalRoles,
    totalPermissions,
    popularPosts: popularPosts.map(post => ({
      title: post.title,
      views: post.views,
      comments: post._count.comments
    }))
  }
}