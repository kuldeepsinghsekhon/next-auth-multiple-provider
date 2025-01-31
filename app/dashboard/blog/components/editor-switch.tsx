'use client'

import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface EditorSwitchProps {
  onChange: (isMarkdown: boolean) => void
}

export function EditorSwitch({ onChange }: EditorSwitchProps) {
  const [isMarkdown, setIsMarkdown] = useState(false)

  return (
    <div className="flex items-center space-x-2">
      <Label>WYSIWYG</Label>
      <Switch
        checked={isMarkdown}
        onCheckedChange={(checked) => {
          setIsMarkdown(checked)
          onChange(checked)
        }}
      />
      <Label>Markdown</Label>
    </div>
  )
}