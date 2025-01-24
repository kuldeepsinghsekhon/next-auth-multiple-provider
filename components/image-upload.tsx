'use client'

import { useState } from 'react'
import { Upload, Loader2 } from 'lucide-react'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'

type StorageProvider = 'vercel' | 's3' | 'cloudflare' | 'gcs'

interface ImageUploadProps {
  onChange: (url: string) => void
  value?: string
}

export function ImageUpload({ onChange, value }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [provider, setProvider] = useState<StorageProvider>('vercel')

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true)
      const file = e.target.files?.[0]
      if (!file) return

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const { url } = await response.json()
      onChange(url)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Select
        value={provider}
        onValueChange={(value) => setProvider(value as StorageProvider)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select storage provider" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="vercel">Vercel Blob</SelectItem>
          <SelectItem value="s3" disabled>AWS S3 (Coming soon)</SelectItem>
          <SelectItem value="cloudflare" disabled>Cloudflare Images (Coming soon)</SelectItem>
          <SelectItem value="gcs" disabled>Google Cloud Storage (Coming soon)</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <>
                <Upload className="h-8 w-8 mb-4" />
                <p className="mb-2 text-sm">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF up to 10MB
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={onUpload}
            disabled={isUploading}
          />
        </label>
      </div>

      {value && (
        <div className="relative aspect-video mt-4">
          <img
            src={value}
            alt="Uploaded"
            className="rounded-lg object-cover"
          />
        </div>
      )}
    </div>
  )
}