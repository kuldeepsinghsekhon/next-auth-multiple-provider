'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { ThumbsUp, Heart, Star, Smile } from 'lucide-react'
import { addReaction, getUserReaction } from '@/actions/blog'
import { toast } from '@/components/ui/use-toast'

const REACTIONS = [
  { type: 'LIKE', icon: ThumbsUp, label: 'Like', value: 2 },
  { type: 'HEART', icon: Heart, label: 'Love', value: 3 },
  { type: 'STAR', icon: Star, label: 'Star', value: 4 },
  { type: 'SMILE', icon: Smile, label: 'Smile', value: 1 }
] as const

interface ReactionButtonsProps {
  postId: string
  initialCounts: Record<string, number>
}

export function ReactionButtons({ postId, initialCounts }: ReactionButtonsProps) {
  const { data: session } = useSession()
  const [counts, setCounts] = useState(initialCounts)
  const [activeReaction, setActiveReaction] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function fetchUserReaction() {
      if (session?.user) {
        try {
          const userReaction = await getUserReaction(postId)
          if (userReaction) {
            setActiveReaction(userReaction.type)
          }
        } catch (error) {
          console.error('Error fetching user reaction:', error)
        }
      }
    }
    fetchUserReaction()
  }, [postId, session])

  const handleReaction = async (type: string) => {
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to react to posts",
        variant: "destructive"
      })
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
      toast({
        title: "Error",
        description: "Failed to update reaction",
        variant: "destructive"
      })
      // Revert optimistic update
      setCounts(initialCounts)
      setActiveReaction(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {REACTIONS.map(({ type, icon: Icon, label }) => {
        const isActive = activeReaction === type
        const count = counts[type] || 0

        return (
          <Button
            key={type}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => handleReaction(type)}
            disabled={isLoading}
            className={`flex items-center gap-1.5 transition-all ${
              isActive ? "bg-primary text-primary-foreground" : ""
            }`}
          >
            <Icon className={`h-4 w-4 ${isActive ? "text-primary-foreground" : ""}`} />
            <span>{count}</span>
            <span className="sr-only">{label}</span>
          </Button>
        )
      })}
    </div>
  )
}