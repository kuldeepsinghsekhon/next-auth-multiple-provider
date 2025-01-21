'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTableToolbar } from "./data-table-toolbar"
import { UsersTable } from "./users-table"

interface UsersClientProps {
  initialData: {
    users: any[]
    roles: any[]
    total: number
    pageCount: number
    currentPage: number
    validatedParams: any
  }
  baseUrl: string
  searchParams: Record<string, string | undefined>
}

export function UsersClient({
  initialData,
  baseUrl,
  searchParams
}: UsersClientProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Users Management</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTableToolbar 
          roles={initialData.roles} 
          baseUrl={baseUrl}
        />
        <UsersTable 
          users={initialData.users}
          roles={initialData.roles}
          pageCount={initialData.pageCount}
          currentPage={initialData.currentPage}
          baseUrl={baseUrl}
          searchParams={searchParams}
        />
      </CardContent>
    </Card>
  )
}