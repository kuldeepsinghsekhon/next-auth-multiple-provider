'use client'

import { useState, useEffect } from 'react'
import { getComments } from '@/actions/comments'
import CommentSection from './comment-section'
import { CommentLoading } from './comment-loading'

interface ClientCommentSectionProps {
  postId: string
}

export function ClientCommentSection({ postId }: ClientCommentSectionProps) {
  const [commentsData, setCommentsData] = useState({ comments: [], pagination: { page: 1, limit: 5, total: 0, hasMore: false } })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchComments() {
      try {
        const data = await getComments(postId, 1, 5)
        setCommentsData(data)
      } catch (error) {
        console.error('Error fetching comments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [postId])

  if (loading) {
    return <CommentLoading />
  }

  return (
    <CommentSection
      postId={postId}
      initialComments={commentsData.comments}
      pagination={commentsData.pagination}
    />
  )
}