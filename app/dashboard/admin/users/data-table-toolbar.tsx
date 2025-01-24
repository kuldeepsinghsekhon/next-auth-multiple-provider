'use client'

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createQueryString } from "@/lib/utils/search-params"
import type { Role } from "@prisma/client"

interface DataTableToolbarProps {
  roles: Role[]
  baseUrl: string
}

export async function  DataTableToolbar({ roles, baseUrl }: DataTableToolbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams =await useSearchParams()
  const handleSearch = (value: string) => {
    const query = createQueryString(
      { search: value || null },
      searchParams
    )
    router.push(`${baseUrl}?${query}`)
  }

  const handleRoleFilter = (value: string) => {
    const query = createQueryString(
      { role: value || null },
      searchParams
    )
    router.push(`${baseUrl}?${query}`)
  }
  {roles?.roles?.map((role) => (
     console.log(role?.name)
  ))}
  return (
    <div className="flex items-center justify-between mb-4">
      <Input
        placeholder="Search users..."
        className="max-w-sm"
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <Select
        value={searchParams.get("role") ?? ""}
        onValueChange={handleRoleFilter}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All roles</SelectItem>
          {roles?.roles?.map((role) => (
            <SelectItem key={role.id} value={role.id}>
              {role?.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}