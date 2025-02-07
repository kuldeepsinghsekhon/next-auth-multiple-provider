import { getRoles } from "@/actions/roles"
import { getPermissions } from "@/actions/permissions"
import { RolesTable } from "../roles-table"
import { PermissionsTable } from "../permission-table"
import { CreateRoleButton } from "../create-role-button"
import type { Role, Permission } from "@/types/role-permissions"
import { ResetPermissionsButton } from "../reset-permission-button"

export default async function RolesPage() {
  const [rolesResponse, permissionsResponse] = await Promise.all([
    getRoles(),
    getPermissions()
  ]);

 // const roles = rolesResponse.data as Role[];
  const permissions = permissionsResponse.permissions as Permission[];

  return (
    <div className="p-6 space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold">Permissions</h2>
      <ResetPermissionsButton />
    </div>
    <PermissionsTable permissions={permissions} />
  </div>
  )
}