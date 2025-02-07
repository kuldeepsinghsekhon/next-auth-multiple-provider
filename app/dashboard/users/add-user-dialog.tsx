'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { createUser } from "@/actions/users"

const UserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().optional(),
  password: z.number().min(0, "Price must be positive"),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
})

type UserFormValues = z.infer<typeof UserSchema>

export function AddUserDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState(false)
  const form = useForm<UserFormValues>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      status: "draft",
    }
  })

  const onSubmit = async (data: UserFormValues) => {
    setLoading(true)
    try {
      await createUser(data)
      toast.success("User created successfully")
      form.reset()
      onClose()
    } catch (error) {
      toast.error("Failed to create User")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

           

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Price</label>
                <Input 
                  type="email" 
                  step="0.01" 
                  {...form.register("email", { valueAsNumber: true })} 
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Stock</label>
                <Input 
                  type="password" 
                  {...form.register("password", { valueAsNumber: true })} 
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500">{form.formState.errors.stock.message}</p>
                )}
              </div>
            </div>

           

            <div>
              <label className="text-sm font-medium">Status</label>
              <Select 
                value={form.watch("status")} 
                onValueChange={(value) => form.setValue("status", value as "draft" | "published" | "archived")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}