import { createAdminClient } from '@cabral-souza/db'
import { ViewingRoomGenerator } from '../../../../components/admin/ViewingRoomGenerator'
import { getAdminViewingRooms } from '../../../../lib/queries/admin'

export const metadata = { title: 'Viewing Rooms' }

async function getPublishedPiecesForVR() {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('pieces')
    .select('id, title_pt, piece_images(url_original, is_primary), artists(name)')
    .in('status', ['publico', 'reservado'])
    .order('title_pt', { ascending: true })

  return (data ?? []).map((p) => ({
    id: p.id,
    title: p.title_pt,
    artist_name: (Array.isArray(p.artists) ? p.artists[0]?.name : (p.artists as { name?: string } | null)?.name) ?? null,
    thumbnail: (p.piece_images as { url_original: string; is_primary: boolean }[] | null)?.find((img) => img.is_primary)?.url_original
      ?? (p.piece_images as { url_original: string }[] | null)?.[0]?.url_original
      ?? null,
  }))
}

export default async function ViewingRoomsPage() {
  const [pieces, viewingRooms] = await Promise.all([
    getPublishedPiecesForVR(),
    getAdminViewingRooms(),
  ])

  const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'http://localhost:3000'

  return (
    <div className="max-w-[1100px]">
      <div className="mb-8">
        <h1 className="font-display text-[1.75rem] font-light text-[--color-ink]">
          Viewing Rooms
        </h1>
        <p className="font-body text-[12px] text-[--color-ink-subtle] mt-1">
          Gere links personalizados com seleções de obras para clientes específicos.
        </p>
      </div>

      <ViewingRoomGenerator
        pieces={pieces}
        viewingRooms={viewingRooms as Parameters<typeof ViewingRoomGenerator>[0]['viewingRooms']}
        siteUrl={siteUrl}
      />
    </div>
  )
}
