import { getRoles } from "@/actions/roles"
import { getPermissions } from "@/actions/permissions"
import { RolesTable } from "../roles-table"
import { PermissionsTable } from "../permission-table"
import { CreateRoleButton } from "../create-role-button"
import type { Role, Permission } from "@/types/role-permissions"

export default async function RolesPage() {
  const [roles, permissions] = await Promise.all([
    getRoles(),
    getPermissions()
  ]) as [Role[], Permission[]]

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Permissions</h2>
        <PermissionsTable permissions={permissions} />
      </div>
    </div>
  )
}