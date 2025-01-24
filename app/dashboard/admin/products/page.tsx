import { ProductsClient } from './products-client'
import { getProducts } from '@/actions/product'

export default async function ProductsPage({
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
  const searchParam = await searchParams;
  const search = searchParam.q ?? ''
  const page = Math.max(1, Number(searchParam.page) || 1)
  const limit = Number(searchParam.limit) || 10
  const status = searchParam.status
  const sort = searchParam.sort || 'availableAt'
  const order = (searchParam.order as 'asc' | 'desc') || 'desc'

  const { products, totalPages, total } = await getProducts(
    search,
    page,
    limit,
    status,
    sort,
    order
  )

  return (
    <ProductsClient
      products={products}
      currentPage={page}
      totalPages={totalPages}
      totalItems={total}
      searchParams={searchParam}
    />
  )
}