'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { uploadToVercelBlob } from '@/lib/storage/vercel-blob'
import { Loader2 } from 'lucide-react'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  name?: string
}

export function AvtarImageUpload({ value, onChange, name }: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0]
      if (!file) return

      setIsLoading(true)
      const url = await uploadToVercelBlob(file)
      onChange(url)
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={value} alt={name || "Profile"} />
        <AvatarFallback>
          {name?.charAt(0) || "A"}
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={() => document.getElementById('imageInput')?.click()}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Uploading...
            </>
          ) : (
            'Change Image'
          )}
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            disabled={isLoading}
            onClick={() => onChange('')}
          >
            Remove
          </Button>
        )}
      </div>
      <input
        id="imageInput"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />
    </div>
  )
}