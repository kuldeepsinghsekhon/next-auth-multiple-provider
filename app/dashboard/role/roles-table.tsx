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
import { Badge } from "@/components/ui/badge"
import {RoleDialog as EditRoleDialog } from "./edit-role-dialog"
import { ItemsSearch } from "@/components/Items-search"
import { SortHeader } from "@/components/sort-header"
import { Pagination } from "@/components/pagination"
export function RolesTable({ roles, permissions,total,totalPages,currentPage }) {
  return (
    <div>
       <ItemsSearch/>
    <Table>
      <TableHeader>
        <TableRow>
          <SortHeader field="name">Name</SortHeader>
          <TableHead>Permissions</TableHead>
          <SortHeader field="createdby">Created By</SortHeader>
          <SortHeader field="createdAt">Created</SortHeader>
          <SortHeader field="updatedAt">Last Updated</SortHeader>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {roles.map((role) => (
          <TableRow key={role.id}>
            <TableCell>{role.name}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {role.permissions.map((permission) => (
                  <Badge key={permission.id} variant="outline">
                    {permission.name}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>{role.createdBy?.name ?? 'System'}</TableCell>
            <TableCell>{formatDistanceToNow(new Date(role.createdAt), { addSuffix: true })}</TableCell>
            <TableCell>{formatDistanceToNow(new Date(role.updatedAt), { addSuffix: true })}</TableCell>
           
            <TableCell>
              <EditRoleDialog role={role} permissions={permissions} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    <Pagination totalPages={totalPages} currentPage={currentPage} />
    </div>
  )
}