'use client'

import { useEffect, useState } from 'react'
import { Link } from 'lucide-react'

interface TOCItem {
  id: string
  title: string
  level: number
}

export function TableOfContents({ content }: { content: string }) {
  const [items, setItems] = useState<TOCItem[]>([])

  useEffect(() => {
    const doc = new DOMParser().parseFromString(content, 'text/html')
    const headings = Array.from(doc.querySelectorAll('h2, h3, h4'))
    
    setItems(headings.map(heading => ({
      id: heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, '-') || '',
      title: heading.textContent || '',
      level: parseInt(heading.tagName[1])
    })))
  }, [content])

  return (
    <nav className="space-y-2 mb-8">
      <h3 className="font-semibold flex items-center gap-2">
        <Link className="h-4 w-4" />
        Table of Contents
      </h3>
      <ul className="space-y-1">
        {items.map(item => (
          <li 
            key={item.id}
            style={{ paddingLeft: `${(item.level - 2) * 1}rem` }}
          >
            <a 
              href={`#${item.id}`}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}