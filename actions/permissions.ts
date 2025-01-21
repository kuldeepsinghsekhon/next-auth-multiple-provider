'use server'

import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

export async function getPermissions() {
  const session = await auth()
  // if (!session?.user?.permissions?.includes('view:roles')) {
  //   throw new Error('Unauthorized')
  // }

  return prisma.permission.findMany()
}

export async function createPermission(name: string) {
  const session = await auth()
  // if (!session?.user?.permissions?.includes('manage:roles')) {
  //   throw new Error('Unauthorized')
  // }

  const permission = await prisma.permission.create({
    data: { name }
  })

  revalidatePath('/dashboard/roles')
  return permission
}