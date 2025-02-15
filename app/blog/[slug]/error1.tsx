'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  const router = useRouter()

  return (
    <div className="container py-12 text-center">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <p className="text-muted-foreground mt-2 mb-4">
        {error.message}
      </p>
      <div className="flex gap-4 justify-center">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" onClick={() => router.push('/blog')}>
          Back to Blog
        </Button>
      </div>
    </div>
  )
}