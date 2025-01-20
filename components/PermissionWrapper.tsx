'use client'

import { usePermission } from "@/hooks/use-permissions"

interface PermissionWrapperProps {
  permission: string
  children: React.ReactNode
}

export const PermissionWrapper = ({ permission, children }: PermissionWrapperProps) => {
  const { hasPermission } = usePermission()
console.log(permission)
  if (!hasPermission(permission)) return null

  return <>{children}</>
}