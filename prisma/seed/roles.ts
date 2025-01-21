import { PrismaClient } from '@prisma/client'
import { PERMISSIONS_BY_CATEGORY } from './permissions'

const DEFAULT_ROLES = {
  SUPER_ADMIN: {
    name: 'SUPER_ADMIN',
    description: 'Full system access with all permissions',
    permissions: Object.values(PERMISSIONS_BY_CATEGORY).flat()
  },
  ADMIN: {
    name: 'ADMIN',
    description: 'Administrative access with limited system controls',
    permissions: [
      ...PERMISSIONS_BY_CATEGORY.dashboard,
      ...PERMISSIONS_BY_CATEGORY.products,
      'view:users',
      'edit:user',
      'view:roles',
      'view:permissions'
    ]
  },
  MANAGER: {
    name: 'MANAGER',
    description: 'Product and user management access',
    permissions: [
      ...PERMISSIONS_BY_CATEGORY.dashboard,
      ...PERMISSIONS_BY_CATEGORY.products,
      'view:users'
    ]
  },
  USER: {
    name: 'USER',
    description: 'Standard user access',
    permissions: [
      'view:dashboard',
      'view:products',
      'edit:own:user',
      'edit:own:product'
    ]
  }
} as const

export async function seedRoles(prisma: PrismaClient) {
  console.log('🌱 Seeding roles...')
  
  for (const [_, role] of Object.entries(DEFAULT_ROLES)) {
    // First create permissions if they don't exist
    await Promise.all(
      role.permissions.map(async (permissionName) => {
        await prisma.permission.upsert({
          where: { name: permissionName },
          update: {},
          create: { 
            name: permissionName,
            category: permissionName.split(':')[0]
          }
        })
      })
    )

    // Then create role with permissions
    await prisma.role.upsert({
      where: { name: role.name },
      update: {
        permissions: {
          set: role.permissions.map(name => ({ name }))
        }
      },
      create: {
        name: role.name,
        description: role.description,
        permissions: {
          connect: role.permissions.map(name => ({ name }))
        }
      }
    })
  }
}