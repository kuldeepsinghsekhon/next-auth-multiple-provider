import type { Permission } from '@prisma/client'

export type PermissionObject = Permission & {
  id: string
  name: string
  category: string
  description?: string
  createdAt: Date
  updatedAt: Date
}
export function getPermissions(permissionsString: string): string[] {
  return permissionsString ? permissionsString.split(',') : [];
}
export function getPermissionNames(permissions: PermissionObject[]): string[] {
  return permissions.map(permission => permission.name)
}
export function setPermissions(permissions: string[]): string {
  return permissions.join(',');
}

export const ROLES = {
  ADMIN: ['create:product', 'edit:product', 'delete:product', 'view:users', 'manage:users'],
  USER: ['view:products']
} as const;