'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

interface GetUsersParams {
  page: number
  perPage: number
  sort: string
  search?: string
  role?: string
}

export async function getUsers({
  page,
  perPage,
  sort,
  search,
  role
}: GetUsersParams) {
  const [sortField, sortOrder] = sort.split(':')
  
  const where = {
    AND: [
      search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      } : {},
      role ? { roleId: role } : {}
    ]
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        role: {
          include: { 
            permissions: true 
          }
        }
      },
      orderBy: { [sortField]: sortOrder.toLowerCase() },
      skip: (page - 1) * perPage,
      take: perPage
    }),
    prisma.user.count({ where })
  ])

  return { users, total }
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