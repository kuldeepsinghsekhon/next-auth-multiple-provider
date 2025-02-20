'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { addComment, editComment, deleteComment } from '@/actions/blog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { MessageSquare, Edit2, Trash2, Reply, X, Loader2 } from 'lucide-react'
import { getComments } from '@/actions/comments'
import { toast } from '@/components/ui/use-toast'

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
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  
  const isAuthor = session?.user?.id === comment.authorId

  const handleEditSubmit = async () => {
    try {
      await onEdit(comment)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to edit comment:', error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <Avatar>
          <AvatarImage src={comment.author.image || undefined} alt={comment.author.name || ''} />
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
            {isAuthor && !isEditing && (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onDelete(comment.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            )}
          </div> 
          
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleEditSubmit}>
                  Save Changes
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setIsEditing(false)
                    setEditContent(comment.content)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p>{comment.content}</p>
          )}

          {!isEditing && (
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
                  {`${comment._count.replies} ${comment._count.replies === 1 ? 'reply' : 'replies'}`}
                </Button>
              )}
            </div>
          )}
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

interface CommentSectionProps {
  postId: string
  initialComments: CommentWithAuthor[]
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

export default function CommentSection({ 
  postId, 
  initialComments,
  pagination: initialPagination 
}: CommentSectionProps) {
  const { data: session } = useSession()
  const [content, setContent] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [editingComment, setEditingComment] = useState<CommentWithAuthor | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [comments, setComments] = useState<CommentWithAuthor[]>(initialComments)
  const [pagination, setPagination] = useState(initialPagination)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const handleSubmit = async () => {
    if (!session || !content.trim()) return
    
    try {
      setIsSubmitting(true)
      const newComment = await addComment(postId, content, replyTo || undefined)
      setComments(prev => [newComment, ...prev])
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
      setComments(prev => prev.map(c => c.id === editingComment.id ? { ...c, content } : c))
      setContent('')
      setEditingComment(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      await deleteComment(commentId)
      setComments(prev => prev.filter(c => c.id !== commentId))
    }
  }

  const loadMoreComments = async () => {
    if (isLoadingMore || !pagination.hasMore) return

    try {
      setIsLoadingMore(true)
      const nextPage = pagination.page + 1
      const data = await getComments(postId, nextPage, pagination.limit)
      
      setComments(prev => [...prev, ...data.comments])
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error loading more comments:', error)
      toast({
        title: "Error",
        description: "Failed to load more comments",
        variant: "destructive"
      })
    } finally {
      setIsLoadingMore(false)
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        Comments ({pagination.total})
      </h3>

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
        {comments.map((comment) => (
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
        
        {pagination.hasMore && (
          <Button
            variant="outline"
            className="w-full"
            onClick={loadMoreComments}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Load More Comments
          </Button>
        )}
      </div>
    </div>
  )
}