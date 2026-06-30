-- ============================================================================
-- CABRAL & SOUZA — MIGRATION 0002: Páginas institucionais
-- ============================================================================

CREATE TABLE IF NOT EXISTS site_pages (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                TEXT UNIQUE NOT NULL,
  title_pt            TEXT NOT NULL,
  title_en            TEXT,
  title_fr            TEXT,
  content_pt          TEXT NOT NULL,
  content_en          TEXT,
  content_fr          TEXT,
  seo_title_pt        TEXT,
  seo_description_pt  TEXT,
  is_published        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_pages_slug ON site_pages(slug);
CREATE INDEX IF NOT EXISTS idx_site_pages_published ON site_pages(is_published) WHERE is_published = TRUE;

ALTER TABLE site_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_pages_public_read" ON site_pages;
CREATE POLICY "site_pages_public_read" ON site_pages FOR SELECT USING (is_published = TRUE);

DROP POLICY IF EXISTS "site_pages_authenticated_all" ON site_pages;
CREATE POLICY "site_pages_authenticated_all" ON site_pages FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
