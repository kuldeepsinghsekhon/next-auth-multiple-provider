'use client'

import { MDXRemote } from 'next-mdx-remote/rsc'
import { useMDXComponents } from '@/lib/blog/mdx-components'

interface MDXProviderProps {
  content: string
}

export function MDXProvider({ content }: MDXProviderProps) {
  const components = useMDXComponents()

  return (
    <MDXRemote 
      source={content} 
      components={components}
    />
  )
}