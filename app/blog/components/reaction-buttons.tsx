'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { ThumbsUp, Heart, Star, Smile } from 'lucide-react'
import { addReaction, getUserReaction } from '@/actions/blog'
import { toast } from '@/components/ui/use-toast'
import { signIn } from 'next-auth/react'

const REACTIONS = [
  { type: 'LIKE', icon: ThumbsUp, label: 'Like', value: 2 },
  { type: 'HEART', icon: Heart, label: 'Love', value: 3 },
  { type: 'STAR', icon: Star, label: 'Star', value: 4 },
  { type: 'SMILE', icon: Smile, label: 'Smile', value: 1 }
] as const

interface ReactionButtonsProps {
  postId: string
  initialCounts:JSON | JSON[]
}

export function ReactionButtons({ postId, initialCounts }: ReactionButtonsProps) {
  const { data: session, status } = useSession()
  // Parse initialCounts if it's a string
  const [counts, setCounts] = useState<JSON | JSON[]>(() => {
    try {
      return typeof initialCounts === 'string' 
        ? JSON.parse(initialCounts) 
        : initialCounts || {}
    } catch {
      return {}
    }
  })
  const [activeReaction, setActiveReaction] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let mounted = true

    async function fetchUserReaction() {
      if (status === 'authenticated' && mounted) {
        try {
          const userReaction = await getUserReaction(postId)
          if (userReaction && mounted) {
            setActiveReaction(userReaction.type)
          }
        } catch (error) {
          console.error('Error fetching user reaction:', error)
        }
      }
    }

    fetchUserReaction()
    return () => { mounted = false }
  }, [postId, status])

  const handleReaction = async (type: string) => {
    if (status === 'unauthenticated') {
      signIn()
      return
    }

    if (status === 'loading') {
      return
    }

    try {
      setIsLoading(true)
      const isAdding = activeReaction !== type

      // Optimistic update
      const newCounts = { ...counts }
      if (activeReaction) {
        newCounts[activeReaction] = Math.max(0, (newCounts[activeReaction] || 1) - 1)
      }
      if (isAdding) {
        newCounts[type] = (newCounts[type] || 0) + 1
      }
      setCounts(newCounts)
      setActiveReaction(isAdding ? type : null)

      // Server update
      const updatedCounts = await addReaction(postId, type, isAdding)
      setCounts(updatedCounts)
    } catch (error) {
      console.error('Error updating reaction:', error)
      toast({
        title: "Error",
        description: "Failed to update reaction. Please try again.",
        variant: "destructive"
      })
      // Revert optimistic update
      setCounts(initialCounts)
      setActiveReaction(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Add logging to debug counts
  useEffect(() => {
    console.log('Initial counts:', initialCounts)
    console.log('Current counts:', counts)
  }, [initialCounts, counts])

  return (
    <div className="flex flex-wrap gap-2">
      {REACTIONS.map(({ type, icon: Icon, label }) => {
        const isActive = activeReaction === type
        const count = Number(counts[type] || 0)

        return (
          <Button
            key={type}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => handleReaction(type)}
            disabled={isLoading || status === 'loading'}
            className={`flex items-center gap-1.5 transition-all ${
              isActive ? "bg-primary text-primary-foreground" : ""
            }`}
          >
            <Icon className={`h-4 w-4 ${isActive ? "text-primary-foreground" : ""}`} />
            {count > 0 && (
              <span className="ml-1 text-sm">{count}</span>
            )}
            <span className="sr-only">{label}</span>
          </Button>
        )
      })}
    </div>
  )
}