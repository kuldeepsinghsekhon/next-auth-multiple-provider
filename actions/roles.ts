'use server'

import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import{RESPONSE_FORMATS} from "@/lib/response-constants"
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

export async function getRoles() {
  const session = await await auth()
  if (session?.user?.permissions?.includes('view:roles')) {
    const roles= await prisma.role.findMany({
      include: { permissions: true }
    })
    return {...RESPONSE_FORMATS.RETRIVED,roles}
  }else{
    return  {...RESPONSE_FORMATS.UNAUTHORIZED,roles:[]}
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