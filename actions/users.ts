'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function getUsers(
  search = '',
  page = 1,
  limit = 10,
  status?: string,
    sort = 'availableAt',
  order: 'asc' | 'desc' = 'desc'
) {
  const skip = Math.max(0, (page - 1) * limit)
  
  const where = {
    AND: [
      search ? {
        OR: [
          { name: { contains: search } }
        ]
      } : {},
      status && status !== 'all' ? { status } : {}
    ]
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      include: { role: true },
      orderBy: { [sort]: order }
    }

  ),
    prisma.product.count({ where })
  ])

  return {
    users,
    totalPages: Math.ceil(total / limit),
    total
  }
}

export async function updateUserRole(userId: string, roleId: string) {
  const session = await auth()
  if (!session?.user?.permissions?.includes('manage:users')) {
    throw new Error('Unauthorized')
  }

  return prisma.user.update({
    where: { id: userId },
    data: { roleId },
    include: {
      role: {
        include: { permissions: true }
      }
    }
  })
}