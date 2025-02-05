'use client'

import { Twitter, Facebook, Link, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'

interface ShareButtonsProps {
  url: string
  title: string
  description: string
}

export function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const fullUrl = `${process.env.NEXT_PUBLIC_APP_URL}/blog/${url}`
  const encodedUrl = encodeURIComponent(fullUrl)
  const encodedTitle = encodeURIComponent(title)
  const encodedDesc = encodeURIComponent(description)
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      toast({
        title: "Success",
        description: "Link copied to clipboard!"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`)}
      >
        <Twitter className="h-4 w-4" />
        <span className="sr-only">Share on Twitter</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`)}
      >
        <Facebook className="h-4 w-4" />
        <span className="sr-only">Share on Facebook</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open(`mailto:?subject=${encodedTitle}&body=${encodedDesc}%0A%0A${encodedUrl}`)}
      >
        <Mail className="h-4 w-4" />
        <span className="sr-only">Share via Email</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
      >
        <Link className="h-4 w-4" />
        <span className="sr-only">Copy link</span>
      </Button>
    </div>
  )
}