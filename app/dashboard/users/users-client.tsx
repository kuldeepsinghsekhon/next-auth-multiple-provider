'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UsersTable } from './users-table'
import { DataTableToolbar } from './data-table-toolbar'
import type { User, Role } from '@prisma/client'
import { AddUserDialog } from './add-user-dialog'
import { ExportButton } from './export-button'
import { ItemsSearch } from '@/components/Items-search'
interface UsersClientProps {

  users: User[]
  roles: Role[]
  currentPage: number
  total: number
  pageCount: number
  searchParams: Record<string, string | undefined>
}

export function UsersClient({ roles, users, total, currentPage, pageCount, searchParams }: UsersClientProps) {
  const [addUserOpen, setAddUserOpen] = useState(false)

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="blocked">Blocked</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <ExportButton searchParams={searchParams} />
          <Button
            size="sm"
            className="h-8 gap-1"
            onClick={() => setAddUserOpen(true)}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">Add User</span>
          </Button>
        </div>
      </div>
      <AddUserDialog open={addUserOpen} onClose={() => setAddUserOpen(false)} />


      <TabsContent value="all" className="mt-4">
        {/* <DataTableToolbar roles={roles}  /> */}
        <UsersTable
          users={users}
          roles={roles}
          currentPage={currentPage}
          pageCount={pageCount}
          total={total}
        />
      </TabsContent>
    </Tabs>
  )
}