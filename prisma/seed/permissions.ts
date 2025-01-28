import { PrismaClient } from '@prisma/client'
import type { PermissionCategory } from '@/types/role-permissions'

const PERMISSIONS_BY_CATEGORY: Record<PermissionCategory, string[]> = {
  dashboard: ['view:dashboard'],
  products: [
    'view:products',
    'create:product',
    'edit:product',
    'delete:product',
    'edit:own:product',
    'delete:own:product'
    
  ],
  roles: [
    'view:roles',
    'create:role',
    'edit:role',
    'delete:role',
    'edit:own:role',
    'delete:own:role'
  ],
  users: [
    'view:users',
    'edit:user',
    'delete:user',
    'edit:own:user',
    'delete:own:user'
  ],
  permissions: [
    'view:permissions',
    'create:permission',
    'edit:permission',
    'manage:permission',
    'delete:permission',
    'edit:own:permission',
    'delete:own:permission'
  ],
  blog: [
    'view:blog',
    'create:blog',
    'edit:blog',
    'delete:blog',
    'edit:own:blog',
    'delete:own:blog',
    'publish:blog',
    'unpublish:blog',
    'manage:categories',
    'manage:tags'
  ],
  courses: [
    'view:course',
    'create:course',
    'edit:course',
    'delete:course',
    'edit:own:course',
    'delete:own:course',
    'publish:course',
    'unpublish:course'
  ]
}

export async function seedPermissions(prisma: PrismaClient) {
  console.log('🌱 Seeding permissions...')
  
  for (const [category, permissions] of Object.entries(PERMISSIONS_BY_CATEGORY)) {
    for (const permission of permissions) {
      await prisma.permission.upsert({
        where: { name: permission },
        update: { category },
        create: { 
          name: permission,
          category,
          description: `Permission to ${permission.replace(':', ' ')}`
        }
      })
    }
  }
}
export { PERMISSIONS_BY_CATEGORY }