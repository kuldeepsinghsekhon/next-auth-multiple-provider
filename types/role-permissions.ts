export type PermissionCategory = 
  | 'dashboard'
  | 'products'
  | 'roles'
  | 'users'
  | 'permissions'
  | 'blog'

export interface Permission {
  id: string
  name: string
  category: PermissionCategory
  description?: string
  createdAt: Date
  updatedAt: Date
  createdBy?: {
    name: string
    email: string
  }
}
  
export interface Role {
  id: string
  name: string
  permissions: Permission[]
  createdAt: Date
  updatedAt: Date
  createdBy?: {
    name: string
    email: string
  }
}
export interface User {
  id: string
  name?: string
  email?: string
  roleId: string
  role?: Role
  createdAt: Date
  updatedAt: Date
}