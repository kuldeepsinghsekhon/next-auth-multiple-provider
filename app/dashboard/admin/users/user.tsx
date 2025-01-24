'use client'

import { useState } from 'react'
import { TableCell, TableRow } from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { updateUserRole } from "@/actions/users"
import { useToast } from "@/components/admin/ui/use-toast"
import type { User as UserType, Role } from '@prisma/client'

interface UserProps {
  user: UserType & { 
    role?: Role | null 
  }
  roles: Role[]
  onRoleChange?: (userId: string, roleId: string) => void
}

export function User({ user, roles, onRoleChange }: UserProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [currentRole, setCurrentRole] = useState(user.role.id)

  const handleRoleChange = async (roleId: string) => {
    try {
      setLoading(true)
      // Optimistic update
      setCurrentRole(roleId)
      
      await updateUserRole(user.id, roleId)
      onRoleChange?.(user.id, roleId)
      
      toast({ 
        title: "Role updated",
        description: `Updated role for ${user.name || user.email}`
      })
    } catch (error) {
      // Revert on error
      setCurrentRole(user.role?.id)
      toast({ 
        title: "Failed to update role",
        description: "Please try again",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <TableRow>
      <TableCell>{user.name || 'N/A'}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <Select
          value={currentRole}
          onValueChange={handleRoleChange}
          disabled={loading}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue>
              {currentRole}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem 
                key={role.id} 
                value={role.id}
              >
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        {user.createdAt
          ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })
          : 'N/A'
        }
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}