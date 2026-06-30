export function PieceGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[4/5] bg-[--color-paper-muted] mb-4" />
          <div className="h-3 w-1/3 bg-[--color-paper-muted] mb-2" />
          <div className="h-4 w-2/3 bg-[--color-paper-muted] mb-2" />
          <div className="h-3 w-1/2 bg-[--color-paper-muted]" />
        </div>
      ))}
    </div>
  )
}

export function PieceDetailSkeleton() {
  return (
    <div className="container-default py-12 md:py-16 animate-pulse">
      <div className="h-3 w-32 bg-[--color-paper-muted] mb-10" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-[4/5] bg-[--color-paper-muted]" />
        <div className="flex flex-col gap-6">
          <div className="h-4 w-24 bg-[--color-paper-muted]" />
          <div className="h-10 w-3/4 bg-[--color-paper-muted]" />
          <div className="h-20 bg-[--color-paper-muted]" />
          <div className="h-40 bg-[--color-paper-muted]" />
        </div>
      </div>
    </div>
  )
}

export function ArtistPageSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-64 md:h-80 bg-[--color-paper-muted]" />
      <div className="container-default py-12 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-16">
        <div className="space-y-4">
          <div className="h-4 w-20 bg-[--color-paper-muted]" />
          <div className="h-4 w-full bg-[--color-paper-muted]" />
          <div className="h-4 w-full bg-[--color-paper-muted]" />
          <div className="h-4 w-2/3 bg-[--color-paper-muted]" />
        </div>
        <div className="h-48 bg-[--color-paper-muted]" />
      </div>
    </div>
  )
}
