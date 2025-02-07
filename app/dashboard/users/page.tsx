
import { getUsers } from "@/actions/users"
import { getRoles } from "@/actions/roles"
import { UsersClient } from "./users-client"

export default async function UsersPage({
  searchParams,
}: {
  searchParams: { 
    q?: string
    page?: string
    status?: string
    limit?: string
    sort?: string
    order?: string 
  }
}) {
  const search = searchParams.q ?? ''
  const page = Math.max(1, Number(searchParams.page) || 1)
  const limit = Number(searchParams.limit) || 10
  const status = searchParams.status
  const sort = searchParams.sort || 'createdAt'
  const order = (searchParams.order as 'asc' | 'desc') || 'desc'

  const { users, totalPages, total } = await getUsers(
    search,
    page,
    limit,
    status,
    sort,
    order
  )
const {roles} =await getRoles();

  return (
    <UsersClient
      users={users}
      roles={roles}
      currentPage={page}
      pageCount={totalPages}
      total={total}
      searchParams={searchParams}
    />
  )
}