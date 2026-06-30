import { PieceGridSkeleton } from '../../../../components/artwork/PageSkeletons'

export default function AcervoLoading() {
  return (
    <div className="py-12 md:py-16">
      <div className="container-default">
        <div className="h-4 w-24 bg-[--color-paper-muted] animate-pulse mb-8" />
        <PieceGridSkeleton count={8} />
      </div>
    </div>
  )
}
