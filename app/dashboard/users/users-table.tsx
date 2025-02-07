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
import { ItemsSearch } from '@/components/Items-search'
import { SortHeader } from "@/components/sort-header"
import { MoreHorizontal, ArrowUpDown, Download, Check, ChevronDown, Settings2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
const COLUMNS = [
  { key: 'name', label: 'Name',field:'name', defaultVisible: true },
  { key: 'email', label: 'Email',field:'email',  defaultVisible: true },
  { key: 'role', label: 'Role', field:'', defaultVisible: true },
  { key: 'createdAt', label: 'Created At',field:'createdAt',  defaultVisible: true },
  { key: 'actions', label: 'Actions',field:'',  defaultVisible: true }
]
import { useLocalStorage } from "@/hooks/use-local-storage"
export function UsersTable({ 
  users,
  roles,
  currentPage,
  pageCount,
 
  total
}: { 
  users: UserType[]
  roles: Role[]
  currentPage: number
  pageCount: number
  baseUrl: string
  total:number
  searchParams: Record<string, string | undefined>
}) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [visibleColumns, setVisibleColumns] = useLocalStorage(
    'users-table-columns',
    COLUMNS.reduce((acc, col) => ({ ...acc, [col.key]: col.defaultVisible }), {})
  )
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const newParams = new URLSearchParams(params.toString())
      newParams.set(name, value)
      return newParams.toString()
    },
    [params]
  )
users.map((user) => (
console.log(user?.role?.id)           
 ))
  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>Manage user accounts and roles</CardDescription>
      </CardHeader>
      <CardContent>
      <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings2 className="h-4 w-4 mr-2" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {COLUMNS.map(column => (
                  <DropdownMenuCheckboxItem
                    key={column.key}
                    checked={visibleColumns[column.key]}
                    onCheckedChange={(checked) => {
                      setVisibleColumns(prev => ({
                        ...prev,
                        [column.key]: checked
                      }))
                    }}
                  >
                    {column.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
        <Table>
          <TableHeader>
           
                              <TableRow>
                                {COLUMNS.map(column => 
                                  visibleColumns[column.key] && (
                                    <SortHeader field={column.field} key={column.key}>
                                      {column.label}
                                    </SortHeader>
                                  )
                                )}
                              </TableRow>
          </TableHeader>
          
          <TableBody>
            {users.map((user) => (
              <User key={user.id} visibleColumns={visibleColumns} user={user} roles={roles} />
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