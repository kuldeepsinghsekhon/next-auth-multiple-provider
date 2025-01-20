export function getPermissions(permissionsString: string): string[] {
  return permissionsString ? permissionsString.split(',') : [];
}

export function setPermissions(permissions: string[]): string {
  return permissions.join(',');
}

export const ROLES = {
  ADMIN: ['create:product', 'edit:product', 'delete:product', 'view:users', 'manage:users'],
  USER: ['view:products']
} as const;