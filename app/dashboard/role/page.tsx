'use server'
import { getRoles } from "@/actions/roles"
import { getPermissions } from "@/actions/permissions"
import { RolesTable } from "./roles-table"
import { CreateRoleButton } from "./create-role-button"
import type { Role, Permission } from "@/types/role-permissions"
import { PermissionsTable } from "./permission-table"
import { tr } from "date-fns/locale"

export default async function RolesPage({
  searchParams,
}: {
  searchParams: { 
    q?: string
    page?: string
   // status?: string
    limit?: string
    sort?: string
    order?: string 
  }
}) {
  const searchParam = await searchParams;
  const search = searchParam.q ?? ''
  const page = Math.max(1, Number(searchParam.page) || 1)
  const limit = Number(searchParam.limit) || 10
  //const status = searchParam.status
  const sort = searchParam.sort || 'createdAt'
  const order = (searchParam.order as 'asc' | 'desc') || 'desc'
  const [rolesResponse, permissionsResponse] = await Promise.all([
    getRoles(
      search,
      page,
      limit,
     // status,
      sort,
      order  
    ),
    getPermissions()
  ]);


  const  { roles, code, message, status,total,totalPages } = rolesResponse ;
  const {permissions }= permissionsResponse;
  const permissions_status = permissionsResponse.status;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Roles & Permissions</h1>
        { <CreateRoleButton permissions={permissions} />}
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Roles</h2>
        <RolesTable roles={roles} permissions={permissions}  currentPage={page} totalPages={totalPages} total={total} />
      </div>
    </div>
  )
}
