import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container py-12 text-center">
      <h2 className="text-2xl font-bold">Blog Post Not Found</h2>
      <p className="text-muted-foreground mt-2 mb-4">
        The blog post you're looking for doesn't exist.
      </p>
      <Button asChild>
        <Link href="/blog">Back to Blog</Link>
      </Button>
    </div>
  )
}