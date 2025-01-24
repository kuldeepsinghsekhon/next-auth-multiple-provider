'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { User } from './user'
import type { User as UserType, Role } from '@prisma/client'

export function UsersTable({ 
  users,
  roles,
  currentPage,
  pageCount,
  baseUrl,
  searchParams
}: { 
  users: UserType[]
  roles: Role[]
  currentPage: number
  pageCount: number
  baseUrl: string
  searchParams: Record<string, string | undefined>
}) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const newParams = new URLSearchParams(params.toString())
      newParams.set(name, value)
      return newParams.toString()
    },
    [params]
  )
users.map((user) => (
console.log(user.role.id)           
 ))
  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>Manage user accounts and roles</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <User key={user.id} user={user} roles={roles} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {pageCount}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => {
                const query = createQueryString('page', String(currentPage - 1))
                router.push(`${pathname}?${query}`)
              }}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= pageCount}
              onClick={() => {
                const query = createQueryString('page', String(currentPage + 1))
                router.push(`${pathname}?${query}`)
              }}
            >
              Next
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}