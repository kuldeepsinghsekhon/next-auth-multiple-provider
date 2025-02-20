'use client'

import { useState, useEffect } from 'react'
import { ReactionButtons } from './reaction-buttons'

interface ClientReactionButtonsProps {
  postId: string
  initialCounts: Record<string, number>
}

export function ClientReactionButtons({ postId, initialCounts }: ClientReactionButtonsProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-10 bg-muted animate-pulse rounded" />
    )
  }

  return (
    <ReactionButtons 
      postId={postId} 
      initialCounts={initialCounts}
    />
  )
}