import { ReadonlyURLSearchParams } from 'next/navigation'
import { BlogSearchParams } from '../blog/types'
export function createQueryString(
    params: Record<string, string | null>,
    searchParams: URLSearchParams
  ) {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newSearchParams.delete(key)
      } else {
        newSearchParams.set(key, value)
      }
    })
  
    return newSearchParams.toString()
  }
  export type SearchParamsType = {
    page?: string
    perPage?: string
    sort?: string
    search?: string
    role?: string
  }
  
  export type ValidatedParams = {
    page: number
    perPage: number
    sort: string
    search: string
    role: string
  }
  

  export function getValidatedSearchParams(searchParams: Record<string, string | string[] | undefined>): BlogSearchParams {
    return {
      q: String(searchParams?.q || ''),
      page: Number(searchParams?.page || 1),
      category: String(searchParams?.category || ''),
      tag: String(searchParams?.tag || ''),
      sort: (searchParams?.sort as BlogSearchParams['sort']) || 'createdAt',
      order: (searchParams?.order as 'asc' | 'desc') || 'desc',
      status: (searchParams?.status as BlogSearchParams['status']) || 'published'
    }
  }