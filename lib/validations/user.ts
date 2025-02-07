import { z } from "zod"

export const userEditSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  roleId: z.string().min(1, "Role is required"),
  active: z.boolean().optional()
})

export type UserFormData = z.infer<typeof userEditSchema>