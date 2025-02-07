'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table
} from '@/components/ui/table-advance';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Product } from './product';
import { useRouter,usePathname,useSearchParams } from 'next/navigation';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCallback } from 'react';
import { SortHeader } from '@/components/sort-header';
import { useSearch } from '@/hooks/use-search'
export function ProductsTable({
  products,
  currentPage,
  totalPages,
  totalItems
}: {
  products: Product[]
  currentPage: number
  totalPages: number
  totalItems: number
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )
  const {  sortField, sortOrder } = useSearch()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>
          Manage your products and view their sales performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <SortHeader field="name">Name</SortHeader>
              <SortHeader field="status">Status</SortHeader>
              <SortHeader field="price">Price</SortHeader>
              <SortHeader field="stock">Stock</SortHeader>
              <SortHeader field="availableAt">Created At</SortHeader>       
                <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <Product key={product.id} product={product} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {products.length} of {totalItems} products
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => 
                router.push(
                  `${pathname}?${createQueryString('page', String(currentPage - 1))}`
                )
              }
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => 
                router.push(
                  `${pathname}?${createQueryString('page', String(currentPage + 1))}`
                )
              }
            >
              Next
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
