import { createAdminClient } from '@cabral-souza/db'

/** KPIs para o dashboard admin */
export interface AdminKPIs {
  totalPieces: number
  publishedPieces: number
  totalArtists: number
  openLeads: number
  activeViewingRooms: number
  recentLeads: {
    id: string
    name: string
    email: string | null
    piece_title: string | null
    created_at: string
  }[]
}

export async function getAdminKPIs(): Promise<AdminKPIs> {
  const supabase = createAdminClient()

  const [
    piecesResult,
    publishedResult,
    artistsResult,
    leadsResult,
    viewingRoomsResult,
    recentLeadsResult,
  ] = await Promise.all([
    supabase.from('pieces').select('id', { count: 'exact', head: true }),
    supabase.from('pieces').select('id', { count: 'exact', head: true }).eq('status', 'publico'),
    supabase.from('artists').select('id', { count: 'exact', head: true }),
    supabase.from('leads').select('id', { count: 'exact', head: true }).eq('status', 'novo'),
    supabase
      .from('viewing_rooms')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString()),
    supabase
      .from('leads')
      .select('id, name, email, piece_id, created_at, status')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  // Buscar títulos das peças para os leads recentes
  const pieceIds = (recentLeadsResult.data ?? [])
    .map((l) => l.piece_id)
    .filter(Boolean) as string[]

  let pieceTitles: Record<string, string> = {}
  if (pieceIds.length > 0) {
    const { data: pieces } = await supabase
      .from('pieces')
      .select('id, title_pt')
      .in('id', pieceIds)

    pieceTitles = Object.fromEntries((pieces ?? []).map((p) => [p.id, p.title_pt]))
  }

  return {
    totalPieces: piecesResult.count ?? 0,
    publishedPieces: publishedResult.count ?? 0,
    totalArtists: artistsResult.count ?? 0,
    openLeads: leadsResult.count ?? 0,
    activeViewingRooms: viewingRoomsResult.count ?? 0,
    recentLeads: (recentLeadsResult.data ?? []).map((l) => ({
      id: l.id,
      name: l.name,
      email: l.email,
      piece_title: l.piece_id ? (pieceTitles[l.piece_id] ?? null) : null,
      created_at: l.created_at,
    })),
  }
}

/** Lista de peças para admin (sem filtros de status) */
export async function getAdminPieces() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('pieces')
    .select(`
      id, title_pt, slug, status, category, price_brl, price_visibility,
      year_created, created_at, updated_at,
      piece_images(url_original, is_primary, sort_order),
      artists(id, name)
    `)
    .order('updated_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

/** Lista de artistas para admin */
export async function getAdminArtists() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('artists')
    .select('id, name, slug, nationality, birth_year, death_year, is_published, created_at, updated_at')
    .order('name', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}

/** Artista por ID para edição */
export async function getAdminArtistById(id: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

/** Peça por ID para edição */
export async function getAdminPieceById(id: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('pieces')
    .select('*, piece_images(*), artists(id, name, slug)')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

/** Lista de leads para admin */
export async function getAdminLeads(page = 1, pageSize = 50) {
  const supabase = createAdminClient()
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await     supabase
      .from('leads')
      .select(`
      id, name, email, phone, notes_internal, status, source, consent_marketing, created_at,
      pieces(id, title_pt, slug)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw new Error(error.message)
  return { data: data ?? [], count: count ?? 0 }
}

export interface SourcingLeadPhoto {
  path: string
  signedUrl: string
}

export interface AdminSourcingLead {
  id: string
  seller_name: string
  seller_email: string | null
  seller_phone: string | null
  seller_city: string | null
  artist_claimed: string | null
  technique_claimed: string | null
  dimensions_claimed: string | null
  acquisition_history: string | null
  expected_value_brl: number | null
  notes_internal: string | null
  status: string
  photos: SourcingLeadPhoto[]
  created_at: string
  updated_at: string
}

/** Lista de sourcing leads para admin */
export async function getAdminSourcingLeads(page = 1, pageSize = 50) {
  const supabase = createAdminClient()
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await supabase
    .from('sourcing_leads')
    .select(
      `id, seller_name, seller_email, seller_phone, seller_city, artist_claimed,
       technique_claimed, dimensions_claimed, acquisition_history, expected_value_brl,
       notes_internal, status, photos, created_at, updated_at`,
      { count: 'exact' },
    )
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw new Error(error.message)

  const leads: AdminSourcingLead[] = []
  for (const row of data ?? []) {
    const rawPhotos = (row.photos as { path?: string; url?: string }[] | null) ?? []
    const photos: SourcingLeadPhoto[] = []

    for (const photo of rawPhotos) {
      const path = photo.path
      if (!path) continue
      const { data: signed } = await supabase.storage
        .from('sourcing-uploads')
        .createSignedUrl(path, 3600)
      if (signed?.signedUrl) {
        photos.push({ path, signedUrl: signed.signedUrl })
      }
    }

    leads.push({ ...row, photos })
  }

  return { data: leads, count: count ?? 0 }
}

/** Viewing rooms para admin */
export async function getAdminViewingRooms() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('viewing_rooms')
    .select('id, token, is_active, expires_at, created_at, client_name, client_email, notes_internal')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}
