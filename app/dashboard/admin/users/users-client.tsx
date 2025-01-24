'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UsersTable } from './users-table'
import { DataTableToolbar } from './data-table-toolbar'
import type { User, Role } from '@prisma/client'

interface UsersClientProps {
  initialData: {
    users: User[]
    roles: Role[]
    total: number
    pageCount: number
    currentPage: number
  }
  baseUrl: string
  searchParams: Record<string, string | undefined>
}

export function UsersClient({ initialData, baseUrl, searchParams }: UsersClientProps) {
  return (
    <Tabs defaultValue="all">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="blocked">Blocked</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="h-8 gap-1"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">Add User</span>
          </Button>
        </div>
      </div>

      <TabsContent value="all" className="mt-4">
        <DataTableToolbar roles={initialData.roles} baseUrl={baseUrl} />
        <UsersTable 
          users={initialData.users}
          roles={initialData.roles}
          currentPage={initialData.currentPage}
          pageCount={initialData.pageCount}
          baseUrl={baseUrl}
          searchParams={searchParams}
        />
      </TabsContent>
    </Tabs>
  )
}