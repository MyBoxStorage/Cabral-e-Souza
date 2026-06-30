-- ============================================================================
-- CABRAL & SOUZA — MIGRATION 0004: Coleções curatoriais
-- ============================================================================

CREATE TABLE IF NOT EXISTS collections (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug              TEXT UNIQUE NOT NULL,
  title_pt          TEXT NOT NULL,
  title_en          TEXT,
  title_fr          TEXT,
  description_pt    TEXT NOT NULL,
  description_en    TEXT,
  description_fr    TEXT,
  hero_image_url    TEXT,
  sort_order        INT NOT NULL DEFAULT 0,
  is_published      BOOLEAN NOT NULL DEFAULT TRUE,
  is_dynamic        BOOLEAN NOT NULL DEFAULT FALSE,
  dynamic_kind      TEXT CHECK (dynamic_kind IN ('novidades', 'sob_consulta')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS collection_pieces (
  collection_id     UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  piece_id          UUID NOT NULL REFERENCES pieces(id) ON DELETE CASCADE,
  sort_order        INT NOT NULL DEFAULT 0,
  PRIMARY KEY (collection_id, piece_id)
);

CREATE INDEX IF NOT EXISTS idx_collections_slug ON collections(slug);
CREATE INDEX IF NOT EXISTS idx_collections_published ON collections(is_published) WHERE is_published = TRUE;
CREATE INDEX IF NOT EXISTS idx_collection_pieces_collection ON collection_pieces(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_pieces_piece ON collection_pieces(piece_id);

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_pieces ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "collections_public_read" ON collections;
CREATE POLICY "collections_public_read" ON collections FOR SELECT USING (is_published = TRUE);

DROP POLICY IF EXISTS "collections_authenticated_all" ON collections;
CREATE POLICY "collections_authenticated_all" ON collections FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "collection_pieces_public_read" ON collection_pieces;
CREATE POLICY "collection_pieces_public_read" ON collection_pieces FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM collections c
      WHERE c.id = collection_pieces.collection_id AND c.is_published = TRUE
    )
  );

DROP POLICY IF EXISTS "collection_pieces_authenticated_all" ON collection_pieces;
CREATE POLICY "collection_pieces_authenticated_all" ON collection_pieces FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
