'use client'

import * as React from 'react'
import { Check, X } from 'lucide-react'
import { Badge } from './badge'
import { cn } from '@/lib/utils'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './command'
import { useClickOutside } from '@/hooks/use-click-outside'

interface MultiSelectProps {
  options: { label: string; value: string }[]
  value?: string[]
  onChange?: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder,
  disabled
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  const ref = React.useRef<HTMLDivElement>(null)

  useClickOutside(ref, () => setOpen(false))

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  )

  const handleSelect = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue]
    onChange?.(newValue)
  }

  return (
    <div className="relative" ref={ref}>
      <Command shouldFilter={false} className="overflow-visible bg-transparent">
        <div 
          className="group border rounded-md px-3 py-2 text-sm"
          onClick={() => !disabled && setOpen(true)}
        >
          <div className="flex gap-1 flex-wrap">
            {value.map(v => {
              const option = options.find(o => o.value === v)
              return option ? (
                <Badge key={v} variant="secondary">
                  {option.label}
                  <button
                    type="button"
                    className="ml-1 rounded-full hover:bg-accent"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelect(v)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ) : null
            })}
            <CommandInput 
              placeholder={placeholder}
              disabled={disabled}
              value={inputValue}
              onValueChange={setInputValue}
            />
          </div>
        </div>

        {open && !disabled && (
          <div className="absolute z-50 w-full bg-popover rounded-md border border-border mt-2 shadow-md">
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map(option => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      handleSelect(option.value)
                      setInputValue('')
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(option.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </div>
        )}
      </Command>
    </div>
  )
}