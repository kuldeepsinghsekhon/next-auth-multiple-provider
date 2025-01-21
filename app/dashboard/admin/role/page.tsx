import { getRoles } from "@/actions/roles"
import { getPermissions } from "@/actions/permissions"
import { RolesTable } from "./roles-table"
import { CreateRoleButton } from "./create-role-button"
import type { Role, Permission } from "@/types/role-permissions"
import { PermissionsTable } from "./permission-table"

export default async function RolesPage() {
  const [roles, permissions] = await Promise.all([
    getRoles(),
    getPermissions()
  ]) as [Role[], Permission[]]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Roles & Permissions</h1>
        <CreateRoleButton permissions={permissions} />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Roles</h2>
        <RolesTable roles={roles} permissions={permissions} />
      </div>
    </div>
  )
}