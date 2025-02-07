'use server'

import { auth } from "@/auth"
import { PERMISSIONS_BY_CATEGORY } from "@/prisma/seed/permissions"
import { revalidatePath } from "next/cache"
import { withAuth } from "@/lib/middleware/withAuth"
import { prisma } from "@/lib/prisma"
import{RESPONSE_FORMATS} from "@/lib/response-constants"
import { stringify } from 'csv-stringify/sync'

export async function getPermissions() {
  const session = await auth()
  if (session?.user?.permissions?.includes('view:permissions')) {
      const permissions= await prisma.permission.findMany()
   return {...RESPONSE_FORMATS.RETRIVED,  permissions}
    }else{
        return {...RESPONSE_FORMATS.UNAUTHORIZED, permissions: []}
    }
}

export async function createPermission(name: string) {
  const session = await auth()
  if (!session?.user?.permissions?.includes('manage:roles')) {
    throw new Error('Unauthorized')
  }

  const permission = await prisma.permission.create({
    data: { name }
  })

  revalidatePath('/dashboard/roles')
  return permission
}
export async function reInitializePermissions() {
  return withAuth(
    'manage:permission',
    async () => {
      // Delete all existing permissions
      await prisma.permission.deleteMany()
      
      // Re-create permissions from seed data
      const permissions = []
      for (const [category, permissionNames] of Object.entries(PERMISSIONS_BY_CATEGORY)) {
        for (const name of permissionNames) {
          permissions.push({
            name,
            category,
            description: `Permission to ${name.replace(':', ' ')}`
          })
        }
      }

      // Bulk create permissions
      await prisma.permission.createMany({
        data: permissions,
        skipDuplicates: true
      })

      // Update default roles with new permissions
      const allPermissions = await prisma.permission.findMany()
      
      // Update Super Admin role
      await prisma.role.update({
        where: { name: 'SUPER_ADMIN' },
        data: {
          permissions: {
            connect: allPermissions.map(p => ({ id: p.id }))
          }
        }
      })

      revalidatePath('/dashboard/admin/permissions')
      return { success: true, message: 'Permissions reinitialized' }
    }
  )
}