'use client'

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateUserRole } from "@/actions/users"
import { useToast } from "@/components/admin/ui/use-toast"
import { formatDistanceToNow } from "date-fns"

export function UsersTable({ users, roles, pageCount, searchParams }) {
  const { toast } = useToast()
  const [loading, setLoading] = useState<string | null>(null)

  const handleRoleChange = async (userId: string, roleId: string) => {
    try {
      setLoading(userId)
      await updateUserRole(userId, roleId)
      toast({ title: "Role updated successfully" })
    } catch (error) {
      toast({ 
        title: "Error updating role",
        variant: "destructive"
      })
    } finally {
      setLoading(null)
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Select
                value={user.roleId}
                onValueChange={(value) => handleRoleChange(user.id, value)}
                disabled={loading === user.id}
              >
                <SelectTrigger>
                  <SelectValue>{user.role?.name}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}