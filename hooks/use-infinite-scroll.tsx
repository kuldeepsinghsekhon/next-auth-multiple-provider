import { useEffect, useCallback } from 'react'
import { useInView } from 'react-intersection-observer'

export function useInfiniteScroll(
  hasMore: boolean,
  isLoading: boolean,
  loadMore: () => Promise<void>
) {
  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMore()
    }
  }, [inView, hasMore, isLoading, loadMore])

  return { ref }
}