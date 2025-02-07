'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userEditSchema, type UserFormData } from '@/lib/validations/user'
import { toast } from '@/components/ui/use-toast'
import { Edit2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// type UserFormValues = z.infer<typeof userEditSchema>
interface EditUserDialogProps {
  user: {
    id: string
    name: string | null
    email: string
    roleId: string
    active: boolean
  }
  roles: {
    id: string
    name: string
  }[]
  onUpdate: (userId: string, data: UserFormData) => Promise<void>
  open: boolean
  onClose: () => void
  onConfirm: (data: UserFormData) => Promise<void>
}

export function EditUserDialog({ user, roles, onUpdate, open,
    onClose,
    onConfirm }: EditUserDialogProps) {
 // const [open, setOpen] = useState(false)
  //const { toast } = useToast()
  
  const form = useForm<UserFormData>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      name: user.name || '',
      email: user.email,
      roleId: user.roleId,
      active: user.active
    }
  })

  async function onSubmit(data: UserFormData) {
    try {
      await onUpdate(user.id, data)
      setOpen(false)
      toast({
        title: "Success",
        description: "User updated successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive"
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}