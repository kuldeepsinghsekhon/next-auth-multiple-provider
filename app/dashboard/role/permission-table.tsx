'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDistanceToNow } from "date-fns"
import type { Permission } from "@/types/role-permissions"
import { ItemsSearch } from "@/components/Items-search"
export function PermissionsTable({ permissions }: { permissions: Permission[] }) {
  return (
    <div className="rounded-md border">
           <ItemsSearch/>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Permission Name</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions.map((permission) => (
            <TableRow key={permission.id}>
              <TableCell>{permission.name}</TableCell>
              <TableCell>{permission.createdBy?.name ?? 'System'}</TableCell>
              <TableCell>{formatDistanceToNow(new Date(permission.createdAt), { addSuffix: true })}</TableCell>
              <TableCell>{formatDistanceToNow(new Date(permission.updatedAt), { addSuffix: true })}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}