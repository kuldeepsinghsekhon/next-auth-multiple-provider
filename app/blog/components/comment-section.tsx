'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { addComment, editComment, deleteComment } from '@/actions/blog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { MessageSquare, Edit2, Trash2, Reply, X } from 'lucide-react'
import type { Comment, User } from '@prisma/client'

interface CommentWithAuthor extends Comment {
  author: User
  replies: CommentWithAuthor[]
  _count?: {
    replies: number
  }
}

interface CommentProps {
  comment: CommentWithAuthor
  onReply: (parentId: string) => void
  onEdit: (comment: CommentWithAuthor) => void
  onDelete: (commentId: string) => void
}

function CommentItem({ comment, onReply, onEdit, onDelete }: CommentProps) {
  const { data: session } = useSession()
  const [showReplies, setShowReplies] = useState(false)
  
  const isAuthor = session?.user?.id === comment.authorId

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <Avatar>
          <AvatarImage src={comment.author.image || undefined} />
          <AvatarFallback>{comment.author.name?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{comment.author.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </p>
            </div>
            {isAuthor && (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onEdit(comment)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onDelete(comment.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <p>{comment.content}</p>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReply(comment.id)}
            >
              <Reply className="h-4 w-4 mr-2" />
              Reply
            </Button>
            {comment._count?.replies > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplies(!showReplies)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                {comment._count.replies} {comment._count.replies === 1 ? 'reply' : 'replies'}
              </Button>
            )}
          </div>
        </div>
      </div>
      {showReplies && comment.replies?.length > 0 && (
        <div className="pl-12 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function CommentSection({ postId, comments }: { postId: string, comments: CommentWithAuthor[] }) {
  const { data: session } = useSession()
  const [content, setContent] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [editingComment, setEditingComment] = useState<CommentWithAuthor | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!session || !content.trim()) return
    
    try {
      setIsSubmitting(true)
      await addComment(postId, content, replyTo || undefined)
      setContent('')
      setReplyTo(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async () => {
    if (!editingComment || !content.trim()) return

    try {
      setIsSubmitting(true)
      await editComment(editingComment.id, content)
      setContent('')
      setEditingComment(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      await deleteComment(commentId)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Comments ({comments?.length || 0})
        </h3>
      </div>
      
      {session ? (
        <div className="space-y-4">
          {(replyTo || editingComment) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                {replyTo ? 'Replying to comment' : 'Editing comment'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setReplyTo(null)
                  setEditingComment(null)
                  setContent('')
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              replyTo ? "Write a reply..." : 
              editingComment ? "Edit your comment..." :
              "Write a comment..."
            }
          />
          <Button 
            onClick={editingComment ? handleEdit : handleSubmit}
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? 'Posting...' : 
             editingComment ? 'Save Changes' :
             replyTo ? 'Post Reply' : 'Post Comment'}
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Please sign in to leave a comment.
        </p>
      )}

      <div className="space-y-6">
        {comments?.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={setReplyTo}
            onEdit={(comment) => {
              setEditingComment(comment)
              setContent(comment.content)
            }}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  )
}