import { validateSearchParams, type SearchParamsType } from "@/lib/utils/search-params"
import { Suspense } from 'react'
import { getUsers } from "@/actions/users"
import { getRoles } from "@/actions/roles"
import { UsersClient } from "./users-client"
import { unstable_noStore as noStore } from "next/cache"

async function fetchData(params: SearchParamsType) {
  noStore()
  
  const validatedParams = validateSearchParams(params)
  
  const [{ users, total }, roles] = await Promise.all([
    getUsers(validatedParams),
    getRoles()
  ])

  return {
    users,
    roles,
    total,
    pageCount: Math.ceil(total / validatedParams.perPage),
    currentPage: validatedParams.page,
    validatedParams
  }
}

export default async function UsersPage({
  searchParams
}: {
  searchParams: SearchParamsType
}) {
  const data = await fetchData({
    page: searchParams.page,
    perPage: searchParams.perPage,
    sort: searchParams.sort,
    search: searchParams.search,
    role: searchParams.role
  })

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UsersClient 
        initialData={data}
        baseUrl="/dashboard/admin/users"
        searchParams={searchParams}
      />
    </Suspense>
  )
}