export default function Loading() {
    return (
      <div className="container py-6 max-w-4xl mx-auto animate-pulse">
        <div className="w-full h-[400px] bg-muted rounded-lg mb-8" />
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        </div>
      </div>
    )
  }