import Image from 'next/image'
import Link from 'next/link'
import type { CollectionListItem } from '../../lib/queries/collections'

interface CollectionCardProps {
  collection: CollectionListItem
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const href = `/acervo?colecao=${collection.slug}`
  const countLabel = `${collection.piece_count} ${collection.piece_count === 1 ? 'obra' : 'obras'}`

  return (
    <article className="group h-full">
      <Link
        href={href}
        className="flex flex-col h-full border border-cream-200 bg-cream-50 overflow-hidden hover:border-bronze-500 hover:shadow-lg transition-[border-color,box-shadow,transform] duration-base ease-smooth hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze-300"
      >
        <div className="relative aspect-[4/3] bg-cream-200 overflow-hidden">
          {collection.cover_image_url ? (
            <Image
              src={collection.cover_image_url}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-slow group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-cream-100 via-cream-200 to-bronze-300/25" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/50 via-transparent to-transparent" />
        </div>

        <div className="flex flex-col flex-1 p-6">
          <p className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-2">
            Coleção
          </p>
          <h3 className="font-display font-medium text-title-sm text-ink-800 mb-3 group-hover:text-bronze-500 transition-colors">
            {collection.title_pt}
          </h3>
          <p className="font-body text-body-sm text-ink-700 line-clamp-2 mb-4 flex-1 leading-relaxed">
            {collection.description_pt}
          </p>
          <div className="flex items-center justify-between gap-4 mt-auto">
            <span className="font-body font-medium text-caption text-bronze-500">{countLabel}</span>
            <span className="font-body text-body-sm font-medium text-bronze-500 group-hover:underline group-hover:underline-offset-4">
              Explorar →
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
