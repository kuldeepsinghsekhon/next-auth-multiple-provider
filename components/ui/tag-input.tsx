'use client'

import { useState } from 'react'
import { Button } from './button'
import { Input } from './input'
import { Badge } from './badge'
import { Cross2Icon } from '@radix-ui/react-icons'

interface TagInputProps {
  placeholder?: string
  tags: string[]
  setTags: (tags: string[]) => void
  className?: string
}

export function TagInput({ placeholder, tags, setTags, className }: TagInputProps) {
  const [input, setInput] = useState('')

  const addTag = () => {
    if (input.trim() && !tags.includes(input.trim())) {
      setTags([...tags, input.trim()])
      setInput('')
    }
  }

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  return (
    <div className={className}>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addTag()
            }
          }}
        />
        <Button 
          type="button" 
          variant="secondary"
          onClick={addTag}
        >
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {tags?.map((tag, index) => (
          <Badge key={index} variant="secondary">
            {tag}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 ml-2 hover:bg-transparent"
              onClick={() => removeTag(index)}
            >
              <Cross2Icon className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  )
}