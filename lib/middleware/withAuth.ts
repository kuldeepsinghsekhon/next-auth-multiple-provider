import { auth } from "@/auth"
import { AuthError, AUTH_ERRORS } from "@/lib/errors/auth-errors"
import type { Permission } from "@/types/role-permissions"

export async function withAuth<T>(
  requiredPermission: string | string[],
  callback: () => Promise<T>
): Promise<T> {
  const session = await auth()
  
  if (!session?.user) {
    throw new AuthError(AUTH_ERRORS.UNAUTHORIZED)
  }

  const userPermissions = session.user?.permissions || []
  const required = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission]

  const hasPermission = required.every(perm => 
    userPermissions.includes(perm)
  )

  if (!hasPermission) {
    throw new AuthError(AUTH_ERRORS.FORBIDDEN)
  }

  return callback()
}