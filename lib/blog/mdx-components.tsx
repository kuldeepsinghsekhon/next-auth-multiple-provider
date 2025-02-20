//'use server'

import { CodeBlock } from '@/components/mdx/code-block'

export function useMDXComponents() {
  return {
    pre: ({ children }: { children: React.ReactNode }) => {
      return children
    },
    code: ({ children, className }: { children: string; className?: string }) => {
      const language = className?.replace('language-', '')
      return (
        <CodeBlock language={language} className={className}>
          {children}
        </CodeBlock>
      )
    }
  }
}