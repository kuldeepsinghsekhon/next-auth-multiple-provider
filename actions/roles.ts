'use server'

import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import{RESPONSE_FORMATS} from "@/lib/response-constants"
import { stringify } from 'csv-stringify/sync'

export async function createRole(data: {
  name: string
  permissions: string[]
}) {
  const session = await auth()
  if (!session?.user?.permissions?.includes('manage:roles')) {
    throw new Error('Unauthorized')
  }

  const role = await prisma.role.create({
    data: {
      name: data.name,
      permissions: {
        connectOrCreate: data.permissions.map(p => ({
          where: { name: p },
          create: { name: p }
        }))
      }
    },
    include: { permissions: true }
  })

  revalidatePath('/dashboard/roles')
  return role
}

export async function updateRole(id: string, data: {
  name?: string
  permissions?: string[]
}) {
  const session = await auth()
  if (!session?.user?.permissions?.includes('manage:roles')) {
    throw new Error('Unauthorized')
  }

  const role = await prisma.role.update({
    where: { id },
    data: {
      name: data.name,
      permissions: data.permissions ? {
        set: data.permissions.map(p => ({ name: p }))
      } : undefined
    },
    include: { permissions: true }
  })

  revalidatePath('/dashboard/roles')
  return role
}

export async function getRoles( search = '',
  page = 1,
  limit = 10,
 // status?: string,
  sort = 'createdAt',
  order: 'asc' | 'desc' = 'desc') {
    const skip = Math.max(0, (page - 1) * limit)
    const where = {
      AND: [
        search ? {
          OR: [
            { name: { contains: search } }
          ]
        } : {},
      //  status && status !== 'all' ? { status } : {}
      ]
    }
  
  const session = await await auth()
  if (session?.user?.permissions?.includes('view:roles')) {
    const [roles, total] = await Promise.all([
    prisma.role.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sort]: order },
      include: { permissions: true }
      
    }),
    prisma.role.count({ where })
  ])
  const totalPages= Math.ceil(total / limit)
    return {...RESPONSE_FORMATS.RETRIVED,roles,total,totalPages}
  }else{
    return  {...RESPONSE_FORMATS.UNAUTHORIZED,roles:[],total:0,totalPages:0}
  }
}

export async function deleteRole(id: string) {
  const session = await auth()
  // if (!session?.user?.permissions?.includes('manage:roles')) {
  //   throw new Error('Unauthorized')
  // }

  await prisma.role.delete({ where: { id } })
  revalidatePath('/dashboard/roles')
}
export async function exportRoles(filters: {
  search?: string
 // status?: string
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
       // filters.status && filters.status !== 'all' ? { status: filters.status } : {}
      ]
    }

    const roles = await prisma.role.findMany({
      where,
      orderBy: { [filters.sort || 'createdAt']: filters.order || 'desc' }
    })

    const data = roles.map(role => ({
      ID: role.id,
      Name: role.name,
      Description: role.description || '',
      'Available At': new Date(role.createdAt).toLocaleDateString()
    }))

    const csv = stringify(data, {
      header: true,
      columns: ['ID', 'Name', 'Description', 'Price', 'Stock', 'Status', 'Available At']
    })

    return csv
  } catch (error) {
    console.error('Export error:', error)
    throw new Error('Failed to export products')
  }
}