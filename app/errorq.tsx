'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string; code?: string; status?: number }
  reset: () => void
}) {
  const router = useRouter()
  
  useEffect(() => {
    console.error(error)
  }, [error])

  if (error.name === 'AuthError') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="max-w-md text-center space-y-4 p-6">
          <h2 className="text-2xl font-bold">{error.code === 'UNAUTHORIZED' ? 'Access Denied' : 'Permission Required'}</h2>
          <p className="text-muted-foreground">{error.message}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => router.push('/dashboard')}>
              Go to Dashboard
            </Button>
            <Button variant="outline" onClick={() => reset()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  )
}