'use client'

import { useState } from 'react'
import { ThumbsUp, Heart, Star, Smile } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { addReaction } from '@/actions/blog'
import { useSession } from 'next-auth/react'

const REACTIONS = [
  { type: 'LIKE', icon: ThumbsUp, label: 'Like' },
  { type: 'LOVE', icon: Heart, label: 'Love' },
  { type: 'STAR', icon: Star, label: 'Star' },
  { type: 'SMILE', icon: Smile, label: 'Smile' }
]

export function ReactionButtons({ postId, initialCounts = {} }) {
  const { data: session } = useSession()
  const [counts, setCounts] = useState<Record<string, number>>(
    typeof initialCounts === 'string' ? JSON.parse(initialCounts) : initialCounts
  )
  const [userReactions, setUserReactions] = useState(new Set())

  const handleReaction = async (type: string) => {
    if (!session) return
    
    const isAdding = !userReactions.has(type)
    const newCounts = { ...counts }
    
    newCounts[type] = (newCounts[type] || 0) + (isAdding ? 1 : -1)
    setCounts(newCounts)
    
    const newUserReactions = new Set(userReactions)
    isAdding ? newUserReactions.add(type) : newUserReactions.delete(type)
    setUserReactions(newUserReactions)
    
    await addReaction(postId, type, isAdding)
  }

  return (
    <div className="flex gap-2">
      {REACTIONS.map(({ type, icon: Icon, label }) => (
        <Button
          key={type}
          variant={userReactions.has(type) ? "default" : "outline"}
          size="sm"
          onClick={() => handleReaction(type)}
          className="flex items-center gap-1"
        >
          <Icon className="h-4 w-4" />
          <span>{counts[type] || 0}</span>
          <span className="sr-only">{label}</span>
        </Button>
      ))}
    </div>
  )
}