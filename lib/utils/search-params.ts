import { ReadonlyURLSearchParams } from 'next/navigation'

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
  
  export function validateSearchParams(params: SearchParamsType): ValidatedParams {
    return {
      page: Math.max(1, Number(params?.page) || 1),
      perPage: Math.max(1, Number(params?.perPage) || 10),
      sort: params?.sort || 'createdAt:desc',
      search: params?.search || '',
      role: params?.role || ''
    }
  }