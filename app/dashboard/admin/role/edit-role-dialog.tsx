'use client'

import { useState } from "react"
import { useToast } from "@/components/admin/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { createRole, updateRole } from "@/actions/roles"
import type { Permission, Role } from "@/types/role-permissions"

interface RoleDialogProps {
  role?: Role | null
  permissions: Permission[]
}

export function RoleDialog({ role = null, permissions }: RoleDialogProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(role?.name ?? '')
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    role?.permissions?.map(p => p.name) ?? []
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!name.trim()) {
        throw new Error('Role name is required')
      }

      if (selectedPermissions.length === 0) {
        throw new Error('Select at least one permission')
      }

      if (role) {
        await updateRole(role.id, { name, permissions: selectedPermissions })
        toast({
          title: "Success",
          description: "Role updated successfully",
        })
      } else {
        await createRole({ name, permissions: selectedPermissions })
        toast({
          title: "Success",
          description: "Role created successfully",
        })
      }
      setOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={role ? "outline" : "default"}>
          {role ? "Edit" : "Create Role"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{role ? "Edit Role" : "Create Role"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Role name"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Permissions</label>
            <div className="grid grid-cols-2 gap-2">
              {permissions.map((permission) => (
                <div key={permission.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={permission.id}
                    checked={selectedPermissions.includes(permission.name)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedPermissions([...selectedPermissions, permission.name])
                      } else {
                        setSelectedPermissions(
                          selectedPermissions.filter(p => p !== permission.name)
                        )
                      }
                    }}
                    disabled={loading}
                  />
                  <label htmlFor={permission.id} className="text-sm">
                    {permission.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}