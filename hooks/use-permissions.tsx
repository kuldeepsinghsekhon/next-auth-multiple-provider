'use client'

import { useSession } from "next-auth/react"
//import type { Permission } from "@/lib/permissions"

export function usePermission() {
  const { data: session } = useSession()
  const hasPermission = (permission: string) => {
    return session?.user?.permissions?.includes(permission) ?? false
 //isAdmin: session?.user?.role === "ADMIN",
  }
  return {
    hasPermission   
  }
}