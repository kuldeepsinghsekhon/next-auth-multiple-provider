'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from 'next/cache'
import { stringify } from 'csv-stringify/sync'
import { z } from "zod"

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
    prisma.user.count({ where })
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
export async function  createUser(data: {
  name: string
  email: number
  password?: string
  status?: string
}) {
  const user = await prisma.user.create({ data })
  revalidatePath('/dashboard/users')
  return user
}
export async function exportUsers(filters: {
  search?: string
  status?: string
  sort?: string
  order?: 'asc' | 'desc'
}) {
  try {
    const where = {
      AND: [
        filters.search ? {
          OR: [
            { name: { contains: filters.search } }
          ]
        } : {},
        filters.status && filters.status !== 'all' ? { status: filters.status } : {}
      ]
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { [filters.sort || 'createdAt']: filters.order || 'desc' }
    })
console.log(users)
    const data = users.map(user => ({
      ID: user.id,
      Name: user.name,
      email: user.email || '',
      image: user.image,
      roleId: user.roleId,
      'Created At': new Date(user.createdAt).toLocaleDateString()
    }))

    const csv = stringify(data, {
      header: true,
      columns: ['ID', 'Name', 'Email', 'Image', 'Role', 'Created At']
    })

    return csv
  } catch (error) {
    console.error('Export error:', error)
    throw new Error('Failed to export Users')
  }
}

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().optional(),
  roleId: z.string()
})

export async function deleteUser(userId: string) {

  const session = await auth()
  
  if (!session?.user?.permissions?.includes('delete:user')) {
    return {
      error: 'You do not have permission to delete users',
      status: 403
    }
  }

  try {
    await prisma.user.delete({
      where: { id: userId }
    })
    
    revalidatePath('/dashboard/users')
    return {
      message: 'User deleted successfully',
      status: 200
    }
  } catch (error) {
    return {
      error: 'Failed to delete user',
      status: 500
    }
  }
}

export async function updateUser(userId: string, data: z.infer<typeof userSchema>) {
  const session = await auth()

  if (!session?.user?.permissions?.includes('edit:user')) {
    return {
      error: 'You do not have permission to update users',
      status: 403
    }
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
      include: {
        role: true
      }
    })

    revalidatePath('/dashboard/users')
    return {
      data: updatedUser,
      message: 'User updated successfully',
      status: 200
    }
  } catch (error) {
    return {
      error: 'Failed to update user',
      status: 500 
    }
  }
}

// const userEditSchema = z.object({
//   name: z.string().min(2, "Name must be at least 2 characters"),
//   email: z.string().email("Invalid email address"),
//   roleId: z.string().min(1, "Role is required"),
//   active: z.boolean().optional()
// })

// export async function updateUser(userId: string, data: z.infer<typeof userEditSchema>) {
//   try {
//     const validated = userEditSchema.parse(data)
    
//     const updatedUser = await prisma.user.update({
//       where: { id: userId },
//       data: validated,
//       include: {
//         role: true
//       }
//     })

//     revalidatePath('/dashboard/users')
    
//     return {
//       data: updatedUser,
//       success: true,
//       message: 'User updated successfully'
//     }
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return {
//         success: false,
//         message: 'Validation failed',
//         errors: error.errors
//       }
//     }

//     return {
//       success: false,
//       message: 'Failed to update user'
//     }
//   }
// }