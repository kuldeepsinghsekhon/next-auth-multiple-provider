'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { addComment } from '@/actions/blog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Comment, User } from '@prisma/client'

interface CommentWithAuthor extends Comment {
  author: User
  replies: CommentWithAuthor[]
}

interface CommentSectionProps {
  postId: string
  comments: CommentWithAuthor[]
}

export function CommentSection({ postId, comments }: CommentSectionProps) {
  const { data: session } = useSession()
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!session || !content.trim()) return
    
    setIsSubmitting(true)
    await addComment(postId, content)
    setContent('')
    setIsSubmitting(false)
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Comments</h3>
      
      {session ? (
        <div className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
          />
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Please sign in to leave a comment.
        </p>
      )}

      <div className="space-y-6">
        {comments?.map((comment) => (
          <div key={comment.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={comment.author.image || undefined} />
                <AvatarFallback>{comment.author.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{comment.author.name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className="pl-10">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}