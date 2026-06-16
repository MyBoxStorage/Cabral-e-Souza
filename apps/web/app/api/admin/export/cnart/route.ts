import { type NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@cabral-souza/db'
import { getAdminUser } from '../../../../../lib/supabase/server'

function escapeCSV(value: unknown): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function toRow(cols: unknown[]): string {
  return cols.map(escapeCSV).join(',')
}

export async function GET(request: NextRequest) {
  const user = await getAdminUser()
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const period = searchParams.get('period') ?? 'semester'
  const filter = searchParams.get('filter')

  const now = new Date()
  let startDate: Date

  if (period === 'semester') {
    const month = now.getMonth()
    if (month < 6) {
      startDate = new Date(now.getFullYear(), 0, 1) // Jan 1
    } else {
      startDate = new Date(now.getFullYear(), 6, 1) // Jul 1
    }
  } else {
    startDate = new Date(now.getFullYear(), 0, 1) // Jan 1
  }

  const supabase = createAdminClient()

  let query = supabase
    .from('pieces')
    .select(`
      id, title_pt, slug, category, technique_pt,
      year_created, height_cm, width_cm, depth_cm,
      price_brl, status, iphan_restricted,
      provenance_pt, created_at, updated_at,
      artists(name, nationality, birth_year, death_year)
    `)
    .order('updated_at', { ascending: false })

  if (filter === 'alerts') {
    query = query.or('iphan_restricted.eq.true,price_brl.gte.30000')
  } else {
    query = query
      .in('status', ['vendido', 'reservado', 'publico'])
      .gte('updated_at', startDate.toISOString())
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const headers = [
    'ID', 'Título', 'Artista', 'Nacionalidade do Artista',
    'Ano Nascimento Artista', 'Ano Falecimento Artista',
    'Categoria', 'Técnica',
    'Ano de Criação', 'Altura (cm)', 'Largura (cm)', 'Profundidade (cm)',
    'Preço (BRL)', 'Status',
    'Restrição IPHAN', 'Proveniência', 'Data de Cadastro', 'Última Atualização',
  ]

  const rows = (data ?? []).map((piece) => {
    const artist = Array.isArray(piece.artists) ? piece.artists[0] : piece.artists

    return toRow([
      piece.id,
      piece.title_pt,
      artist?.name,
      artist?.nationality,
      artist?.birth_year,
      artist?.death_year,
      piece.category,
      piece.technique_pt,
      piece.year_created,
      piece.height_cm,
      piece.width_cm,
      piece.depth_cm,
      piece.price_brl,
      piece.status,
      piece.iphan_restricted ? 'Sim' : 'Não',
      piece.provenance_pt,
      piece.created_at,
      piece.updated_at,
    ])
  })

  const bom = '\uFEFF' // BOM para Excel reconhecer UTF-8
  const csv = bom + [toRow(headers), ...rows].join('\r\n')

  const year = now.getFullYear()
  const sem = now.getMonth() < 6 ? '1' : '2'
  const filename = filter === 'alerts'
    ? `cnart-alertas-${year}.csv`
    : `cnart-${year}-${period === 'semester' ? `${sem}sem` : 'anual'}.csv`

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
