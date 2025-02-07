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
import { updateUserRole, deleteUser, updateUser } from "@/actions/users"
import { toast } from "@/components/ui/use-toast"
import type { User as UserType, Role } from '@prisma/client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { EditUserDialog } from './edit-user-dialog'
interface UserProps {
  user: UserType & { 
    role?: Role | null 

  }
  roles: Role[],
  visibleColumns:  { key: 'name', label: 'Name',field:'name', defaultVisible: true },
  
  onRoleChange?: (userId: string, roleId: string) => void
}

export function User({ user, roles,visibleColumns, onRoleChange }: UserProps) {
  //const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [currentRole, setCurrentRole] = useState(user.role.id)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
const [isEditUserOpen,setEditUserOpen]=useState(false)
const handleUpdate = async (userId: string, data: UserFormData) => {
  const response = await updateUser(userId, data)
  if (!response.success) {
    throw new Error(response.message)
  }
}
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

  const handleDelete = async () => {
    try {
      setLoading(true)
      const result = await deleteUser(user.id)
      
      if (result.status === 200) {
        toast({
          title: "Success",
          description: result.message
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.log(error.Error)
      toast({
        title: "Error",
        description: error.error || "Failed to delete user",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <>
      <TableRow>
        {visibleColumns.name && (
          <TableCell>{user.name}</TableCell>
        )}
        {visibleColumns.email && (
          <TableCell>{user.email}</TableCell>
        )}
        {visibleColumns.role && (
          <TableCell>
            <Select
              value={currentRole}
              onValueChange={handleRoleChange}
              disabled={loading}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue>
                  Select Role
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
        )}
        {visibleColumns.createdAt && (
          <TableCell>
            {user.createdAt
              ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })
              : 'N/A'
            }
          </TableCell>
        )}
        {visibleColumns.actions && (
          <TableCell>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setEditUserOpen(true)}
              >
             
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        )}
      </TableRow>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user account for {user.name || user.email}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div>
      <EditUserDialog 
        user={user}
        roles={roles}
        open={isEditUserOpen}
        onUpdate={handleUpdate}
      />
    </div>
    </>
  )
}