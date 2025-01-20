import { auth } from "@/auth"
import type { Permission } from "@/types"

export async function withAuth<T>(
  permission: Permission,
  callback: () => Promise<T>
): Promise<T> {
  const session = await auth()
  
  if (!session?.user?.permissions?.includes(permission)) {
    throw new Error('Unauthorized')
  }

  return callback()
}