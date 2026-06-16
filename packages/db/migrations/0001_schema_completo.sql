-- ============================================================================
-- CABRAL & SOUZA — MIGRATION 0001: Schema completo + buckets + seed
-- Gerado automaticamente a partir de docs/02_SCHEMA_SUPABASE.sql
-- Aplicar via: supabase db execute --file packages/db/migrations/0001_schema_completo.sql
-- ============================================================================

-- ----------------------------------------------------------------------------
-- EXTENSIONS
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ----------------------------------------------------------------------------
-- ENUMS
-- ----------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE piece_status AS ENUM (
    'rascunho', 'privado', 'publico', 'reservado', 'vendido', 'arquivado'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE piece_origin AS ENUM ('propria', 'consignada', 'parceria');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE piece_category AS ENUM (
    'pintura', 'escultura', 'desenho', 'gravura', 'fotografia', 'objeto', 'antiguidade'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE lead_source AS ENUM (
    'site_formulario', 'whatsapp', 'instagram', 'google_meu_negocio',
    'indicacao', 'newsletter', 'viewing_room', 'sourcing_form', 'outro'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE lead_status AS ENUM (
    'novo', 'qualificado', 'em_negociacao', 'ganho', 'perdido', 'descartado'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE buyer_profile AS ENUM (
    'colecionador', 'investidor', 'decorador', 'arquiteto',
    'curioso', 'instituicao', 'nao_informado'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE sale_status AS ENUM (
    'sinal_pendente', 'sinal_pago', 'kyc_pendente', 'em_transito',
    'em_aprovacao', 'pagamento_final_pendente', 'concluida', 'cancelada', 'devolvida'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE language_code AS ENUM ('pt-BR', 'en-US', 'fr-FR');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE attribution_role AS ENUM (
    'autoria_confirmada', 'atribuida', 'circulo_de', 'escola_de', 'apocrifa'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ----------------------------------------------------------------------------
-- ARTISTAS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS artists (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                TEXT UNIQUE NOT NULL,
  name                TEXT NOT NULL,
  birth_year          INT,
  death_year          INT,
  birth_place         TEXT,
  nationality         TEXT,
  schools             TEXT[],
  bio_pt              TEXT,
  bio_en              TEXT,
  bio_fr              TEXT,
  market_notes_pt     TEXT,
  hero_image_url      TEXT,
  signatures          JSONB,
  external_refs       JSONB,
  is_published        BOOLEAN NOT NULL DEFAULT FALSE,
  needs_retranslation BOOLEAN NOT NULL DEFAULT FALSE,
  content_hash        TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_artists_slug ON artists(slug);
CREATE INDEX IF NOT EXISTS idx_artists_published ON artists(is_published) WHERE is_published = TRUE;
CREATE INDEX IF NOT EXISTS idx_artists_name_trgm ON artists USING gin (name gin_trgm_ops);

-- ----------------------------------------------------------------------------
-- PEÇAS (ACERVO)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pieces (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  internal_code         TEXT UNIQUE NOT NULL,
  slug                  TEXT UNIQUE NOT NULL,
  artist_id             UUID REFERENCES artists(id) ON DELETE RESTRICT,
  attribution           attribution_role NOT NULL DEFAULT 'autoria_confirmada',
  title_pt              TEXT NOT NULL,
  title_en              TEXT,
  title_fr              TEXT,
  category              piece_category NOT NULL,
  technique_pt          TEXT,
  technique_en          TEXT,
  technique_fr          TEXT,
  height_cm             NUMERIC(10,2),
  width_cm              NUMERIC(10,2),
  depth_cm              NUMERIC(10,2),
  weight_kg             NUMERIC(10,3),
  year_created          INT,
  year_created_circa    BOOLEAN DEFAULT FALSE,
  period_label          TEXT,
  is_signed             BOOLEAN,
  signature_location    TEXT,
  is_dated_on_piece     BOOLEAN,
  condition_pt          TEXT,
  condition_notes_pt    TEXT,
  has_restoration       BOOLEAN DEFAULT FALSE,
  restoration_notes_pt  TEXT,
  description_pt        TEXT,
  description_en        TEXT,
  description_fr        TEXT,
  curator_notes_pt      TEXT,
  provenance_pt         TEXT,
  provenance_en         TEXT,
  provenance_fr         TEXT,
  exhibition_history_pt TEXT,
  bibliography_pt       TEXT,
  price_brl             NUMERIC(15,2),
  price_visibility      TEXT NOT NULL DEFAULT 'sob_consulta'
                        CHECK (price_visibility IN ('publico', 'sob_consulta', 'oculto')),
  origin                piece_origin NOT NULL,
  consignor_name        TEXT,
  consignor_contact     TEXT,
  consignor_commission  NUMERIC(5,2),
  consignor_confidential BOOLEAN DEFAULT FALSE,
  status                piece_status NOT NULL DEFAULT 'rascunho',
  featured              BOOLEAN NOT NULL DEFAULT FALSE,
  acquisition_date      DATE,
  acquired_from         TEXT,
  iphan_restricted      BOOLEAN DEFAULT FALSE,
  iphan_notes           TEXT,
  cnart_reported_at     DATE,
  seo_title_pt          TEXT,
  seo_description_pt    TEXT,
  needs_retranslation   BOOLEAN NOT NULL DEFAULT FALSE,
  content_hash          TEXT,
  embedding             vector(1536),
  view_count            INT NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at          TIMESTAMPTZ,
  sold_at               TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_pieces_slug ON pieces(slug);
CREATE INDEX IF NOT EXISTS idx_pieces_artist ON pieces(artist_id);
CREATE INDEX IF NOT EXISTS idx_pieces_status ON pieces(status);
CREATE INDEX IF NOT EXISTS idx_pieces_featured ON pieces(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_pieces_category ON pieces(category);
CREATE INDEX IF NOT EXISTS idx_pieces_embedding ON pieces USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_pieces_title_trgm ON pieces USING gin (title_pt gin_trgm_ops);

-- ----------------------------------------------------------------------------
-- IMAGENS DAS PEÇAS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS piece_images (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  piece_id      UUID NOT NULL REFERENCES pieces(id) ON DELETE CASCADE,
  storage_path  TEXT NOT NULL,
  url_original  TEXT NOT NULL,
  url_large     TEXT,
  url_medium    TEXT,
  url_thumbnail TEXT,
  alt_text_pt   TEXT,
  caption_pt    TEXT,
  is_primary    BOOLEAN NOT NULL DEFAULT FALSE,
  image_type    TEXT NOT NULL DEFAULT 'principal'
                CHECK (image_type IN ('principal','detalhe','assinatura','verso','moldura','ambiente','certificado')),
  sort_order    INT NOT NULL DEFAULT 0,
  width_px      INT,
  height_px     INT,
  bytes         INT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_piece_images_piece ON piece_images(piece_id);
CREATE INDEX IF NOT EXISTS idx_piece_images_primary ON piece_images(piece_id, is_primary) WHERE is_primary = TRUE;

-- ----------------------------------------------------------------------------
-- DOCUMENTOS (COA, LAUDOS, KYC)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS piece_documents (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  piece_id     UUID REFERENCES pieces(id) ON DELETE CASCADE,
  doc_type     TEXT NOT NULL CHECK (doc_type IN (
                  'coa','laudo','recibo_origem','inventario',
                  'foto_assinatura','parecer_iphan','historico_leilao','outro'
               )),
  title        TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  url          TEXT NOT NULL,
  is_public    BOOLEAN NOT NULL DEFAULT FALSE,
  issued_by    TEXT,
  issued_at    DATE,
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_piece_documents_piece ON piece_documents(piece_id);

-- ----------------------------------------------------------------------------
-- COMPARÁVEIS DE LEILÃO
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS auction_comparables (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id       UUID REFERENCES artists(id) ON DELETE CASCADE,
  auction_house   TEXT NOT NULL,
  auction_date    DATE NOT NULL,
  lot_number      TEXT,
  work_title      TEXT,
  work_year       INT,
  technique       TEXT,
  height_cm       NUMERIC(10,2),
  width_cm        NUMERIC(10,2),
  estimate_low    NUMERIC(15,2),
  estimate_high   NUMERIC(15,2),
  hammer_price    NUMERIC(15,2),
  currency        TEXT NOT NULL DEFAULT 'BRL',
  currency_at_brl NUMERIC(15,2),
  image_url       TEXT,
  source_url      TEXT,
  notes           TEXT,
  scraped_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auction_comparables_artist ON auction_comparables(artist_id, auction_date DESC);
CREATE INDEX IF NOT EXISTS idx_auction_comparables_date ON auction_comparables(auction_date DESC);

-- ----------------------------------------------------------------------------
-- TRADUÇÕES — CACHE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS translations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_hash    TEXT NOT NULL,
  source_table    TEXT NOT NULL,
  source_id       UUID NOT NULL,
  source_field    TEXT NOT NULL,
  language        language_code NOT NULL,
  translated_text TEXT NOT NULL,
  tokens_used     INT,
  cost_usd        NUMERIC(10,6),
  translated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (content_hash, language)
);

CREATE INDEX IF NOT EXISTS idx_translations_hash ON translations(content_hash, language);
CREATE INDEX IF NOT EXISTS idx_translations_source ON translations(source_table, source_id);

-- ----------------------------------------------------------------------------
-- LEADS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS leads (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name              TEXT NOT NULL,
  email             TEXT,
  phone             TEXT,
  buyer_profile     buyer_profile DEFAULT 'nao_informado',
  source            lead_source NOT NULL,
  status            lead_status NOT NULL DEFAULT 'novo',
  piece_id          UUID REFERENCES pieces(id),
  viewing_room_id   UUID,
  utm_source        TEXT,
  utm_medium        TEXT,
  utm_campaign      TEXT,
  utm_content       TEXT,
  utm_term          TEXT,
  referrer          TEXT,
  landing_page      TEXT,
  first_touch_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_touch_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  assigned_to       TEXT,
  notes_internal    TEXT,
  tags              TEXT[],
  consent_marketing BOOLEAN NOT NULL DEFAULT FALSE,
  consent_at        TIMESTAMPTZ,
  consent_ip        TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_piece ON leads(piece_id);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- ----------------------------------------------------------------------------
-- LEAD EVENTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lead_events (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id     UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  event_type  TEXT NOT NULL,
  piece_id    UUID REFERENCES pieces(id),
  metadata    JSONB,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_events_lead ON lead_events(lead_id, occurred_at DESC);

-- ----------------------------------------------------------------------------
-- VIEWING ROOMS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS viewing_rooms (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token          TEXT UNIQUE NOT NULL,
  client_name    TEXT NOT NULL,
  client_email   TEXT,
  message_pt     TEXT,
  message_en     TEXT,
  message_fr     TEXT,
  expires_at     TIMESTAMPTZ NOT NULL,
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_by     TEXT NOT NULL,
  notes_internal TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_viewing_rooms_token ON viewing_rooms(token);
CREATE INDEX IF NOT EXISTS idx_viewing_rooms_active ON viewing_rooms(is_active, expires_at);

CREATE TABLE IF NOT EXISTS viewing_room_pieces (
  viewing_room_id UUID NOT NULL REFERENCES viewing_rooms(id) ON DELETE CASCADE,
  piece_id        UUID NOT NULL REFERENCES pieces(id) ON DELETE CASCADE,
  sort_order      INT NOT NULL DEFAULT 0,
  curator_note_pt TEXT,
  PRIMARY KEY (viewing_room_id, piece_id)
);

CREATE TABLE IF NOT EXISTS viewing_room_events (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  viewing_room_id UUID NOT NULL REFERENCES viewing_rooms(id) ON DELETE CASCADE,
  event_type      TEXT NOT NULL,
  piece_id        UUID REFERENCES pieces(id),
  duration_seconds INT,
  metadata        JSONB,
  occurred_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  client_ip       INET,
  user_agent      TEXT
);

CREATE INDEX IF NOT EXISTS idx_vr_events_room ON viewing_room_events(viewing_room_id, occurred_at DESC);

-- ----------------------------------------------------------------------------
-- VENDAS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sales (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  piece_id                  UUID NOT NULL REFERENCES pieces(id),
  lead_id                   UUID REFERENCES leads(id),
  buyer_name                TEXT NOT NULL,
  buyer_email               TEXT,
  buyer_phone               TEXT,
  buyer_cpf_cnpj            TEXT,
  buyer_address             JSONB,
  agreed_price_brl          NUMERIC(15,2) NOT NULL,
  signal_amount_brl         NUMERIC(15,2),
  final_amount_brl          NUMERIC(15,2),
  payment_method            TEXT,
  status                    sale_status NOT NULL DEFAULT 'sinal_pendente',
  kyc_document_url          TEXT,
  kyc_proof_residence_url   TEXT,
  kyc_selfie_url            TEXT,
  kyc_validated_at          TIMESTAMPTZ,
  kyc_validated_by          TEXT,
  signal_paid_at            TIMESTAMPTZ,
  final_payment_at          TIMESTAMPTZ,
  shipping_carrier          TEXT,
  shipping_tracking         TEXT,
  shipping_insurance_brl    NUMERIC(15,2),
  shipped_at                TIMESTAMPTZ,
  delivered_at              TIMESTAMPTZ,
  approval_deadline         TIMESTAMPTZ,
  unboxing_video_url        TEXT,
  approved_at               TIMESTAMPTZ,
  contract_url              TEXT,
  invoice_url               TEXT,
  certificate_url           TEXT,
  digital_attributed        BOOLEAN NOT NULL DEFAULT FALSE,
  digital_attribution_notes TEXT,
  executor_commission_pct   NUMERIC(5,2),
  executor_commission_brl   NUMERIC(15,2),
  cnart_reported            BOOLEAN NOT NULL DEFAULT FALSE,
  coaf_communication        BOOLEAN NOT NULL DEFAULT FALSE,
  coaf_communication_at     TIMESTAMPTZ,
  iphan_export_consult      BOOLEAN,
  iphan_consult_protocol    TEXT,
  notes_internal            TEXT,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_at                 TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_sales_piece ON sales(piece_id);
CREATE INDEX IF NOT EXISTS idx_sales_status ON sales(status);
CREATE INDEX IF NOT EXISTS idx_sales_lead ON sales(lead_id);

-- ----------------------------------------------------------------------------
-- SOURCING LEADS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sourcing_leads (
  id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_name              TEXT NOT NULL,
  seller_email             TEXT,
  seller_phone             TEXT,
  seller_city              TEXT,
  seller_state             TEXT,
  artist_claimed           TEXT,
  technique_claimed        TEXT,
  dimensions_claimed       TEXT,
  year_claimed             TEXT,
  acquisition_history      TEXT,
  expected_value_brl       NUMERIC(15,2),
  has_documents            BOOLEAN,
  documents_description    TEXT,
  photos                   JSONB,
  status                   TEXT NOT NULL DEFAULT 'aguardando_analise'
                           CHECK (status IN (
                             'aguardando_analise','em_pesquisa','proposta_enviada',
                             'aceita','recusada','inviavel','arquivado'
                           )),
  provenance_report_url    TEXT,
  preliminary_estimate_brl NUMERIC(15,2),
  proposal_amount_brl      NUMERIC(15,2),
  proposal_type            TEXT CHECK (proposal_type IN ('compra_a_vista','consignacao','misto')),
  executor_captured        BOOLEAN NOT NULL DEFAULT TRUE,
  resulted_in_piece_id     UUID REFERENCES pieces(id),
  utm_source               TEXT,
  utm_medium               TEXT,
  utm_campaign             TEXT,
  consent_data             BOOLEAN NOT NULL DEFAULT FALSE,
  consent_at               TIMESTAMPTZ,
  assigned_to              TEXT,
  notes_internal           TEXT,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sourcing_status ON sourcing_leads(status);

-- ----------------------------------------------------------------------------
-- PROVENANCE AGENT LOG
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS provenance_executions (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  executed_by      TEXT NOT NULL,
  source_type      TEXT NOT NULL CHECK (source_type IN ('sourcing_lead','manual','piece_review')),
  sourcing_lead_id UUID REFERENCES sourcing_leads(id),
  piece_id         UUID REFERENCES pieces(id),
  inputs           JSONB NOT NULL,
  output_report    JSONB,
  output_pdf_url   TEXT,
  confidence_score INT CHECK (confidence_score >= 0 AND confidence_score <= 100),
  tokens_input     INT,
  tokens_output    INT,
  cost_usd         NUMERIC(10,4),
  duration_ms      INT,
  status           TEXT NOT NULL DEFAULT 'em_execucao'
                   CHECK (status IN ('em_execucao','concluida','falha','cancelada')),
  error_message    TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at     TIMESTAMPTZ
);

-- ----------------------------------------------------------------------------
-- WHATSAPP
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS whatsapp_conversations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone           TEXT NOT NULL,
  contact_name    TEXT,
  lead_id         UUID REFERENCES leads(id),
  bot_active      BOOLEAN NOT NULL DEFAULT TRUE,
  handed_off_at   TIMESTAMPTZ,
  handoff_reason  TEXT,
  last_message_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wpp_phone ON whatsapp_conversations(phone);

CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id   UUID NOT NULL REFERENCES whatsapp_conversations(id) ON DELETE CASCADE,
  direction         TEXT NOT NULL CHECK (direction IN ('inbound','outbound')),
  sender_type       TEXT NOT NULL CHECK (sender_type IN ('client','bot','human')),
  content           TEXT NOT NULL,
  media_url         TEXT,
  classified_intent TEXT,
  rag_pieces_used   UUID[],
  tokens_used       INT,
  occurred_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wpp_messages_conv ON whatsapp_messages(conversation_id, occurred_at);

-- ----------------------------------------------------------------------------
-- BOLETIM
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS boletim_posts (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                TEXT UNIQUE NOT NULL,
  category            TEXT NOT NULL CHECK (category IN (
                        'analise_leilao','verbete_artista','mercado','editorial','noticia'
                      )),
  title_pt            TEXT NOT NULL,
  title_en            TEXT,
  title_fr            TEXT,
  excerpt_pt          TEXT,
  excerpt_en          TEXT,
  excerpt_fr          TEXT,
  content_pt          TEXT NOT NULL,
  content_en          TEXT,
  content_fr          TEXT,
  hero_image_url      TEXT,
  related_artists     UUID[],
  related_pieces      UUID[],
  author              TEXT,
  published_at        TIMESTAMPTZ,
  is_published        BOOLEAN NOT NULL DEFAULT FALSE,
  seo_title           TEXT,
  seo_description     TEXT,
  needs_retranslation BOOLEAN NOT NULL DEFAULT FALSE,
  content_hash        TEXT,
  view_count          INT NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_boletim_slug ON boletim_posts(slug);
CREATE INDEX IF NOT EXISTS idx_boletim_published ON boletim_posts(is_published, published_at DESC) WHERE is_published = TRUE;
CREATE INDEX IF NOT EXISTS idx_boletim_category ON boletim_posts(category);

-- ----------------------------------------------------------------------------
-- NEWSLETTER
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email           TEXT UNIQUE NOT NULL,
  name            TEXT,
  language        language_code NOT NULL DEFAULT 'pt-BR',
  source          lead_source,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  confirmed_at    TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  consent_ip      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- COMPLIANCE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cnart_reports (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  period_start          DATE NOT NULL,
  period_end            DATE NOT NULL,
  pieces_count          INT NOT NULL,
  export_url            TEXT,
  submitted_to_iphan_at TIMESTAMPTZ,
  submitted_by          TEXT,
  notes                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coaf_communications (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id            UUID REFERENCES sales(id),
  communication_type TEXT NOT NULL CHECK (communication_type IN (
                       'cash_above_10k','suspicious','annual_non_occurrence'
                     )),
  amount_brl         NUMERIC(15,2),
  description        TEXT,
  submitted_at       TIMESTAMPTZ,
  protocol_number    TEXT,
  notes              TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- TRIGGER: AUTO-UPDATE updated_at
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN
    SELECT table_name FROM information_schema.columns
    WHERE column_name = 'updated_at' AND table_schema = 'public'
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trg_set_updated_at ON %I;
       CREATE TRIGGER trg_set_updated_at BEFORE UPDATE ON %I
       FOR EACH ROW EXECUTE FUNCTION set_updated_at();', t, t
    );
  END LOOP;
END $$;

-- ----------------------------------------------------------------------------
-- TRIGGER: MARCAR RETRADUÇÃO
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION flag_retranslation_pieces()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.description_pt IS DISTINCT FROM OLD.description_pt
     OR NEW.provenance_pt IS DISTINCT FROM OLD.provenance_pt
     OR NEW.title_pt IS DISTINCT FROM OLD.title_pt THEN
    NEW.needs_retranslation := TRUE;
    NEW.content_hash := encode(digest(
      COALESCE(NEW.title_pt,'') || COALESCE(NEW.description_pt,'') || COALESCE(NEW.provenance_pt,''),
      'sha256'
    ), 'hex');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_flag_retranslation_pieces ON pieces;
CREATE TRIGGER trg_flag_retranslation_pieces
BEFORE UPDATE ON pieces
FOR EACH ROW EXECUTE FUNCTION flag_retranslation_pieces();

-- ----------------------------------------------------------------------------
-- FUNÇÃO RPC: BUSCA VETORIAL (RAG)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION match_pieces(
  query_embedding vector(1536),
  match_threshold FLOAT DEFAULT 0.78,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID, internal_code TEXT, title_pt TEXT, description_pt TEXT, similarity FLOAT
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.internal_code, p.title_pt, p.description_pt,
         1 - (p.embedding <=> query_embedding) AS similarity
  FROM pieces p
  WHERE p.status IN ('publico','reservado')
    AND p.embedding IS NOT NULL
    AND 1 - (p.embedding <=> query_embedding) > match_threshold
  ORDER BY p.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ----------------------------------------------------------------------------
ALTER TABLE artists             ENABLE ROW LEVEL SECURITY;
ALTER TABLE pieces              ENABLE ROW LEVEL SECURITY;
ALTER TABLE piece_images        ENABLE ROW LEVEL SECURITY;
ALTER TABLE piece_documents     ENABLE ROW LEVEL SECURITY;
ALTER TABLE boletim_posts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads               ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales               ENABLE ROW LEVEL SECURITY;
ALTER TABLE viewing_rooms       ENABLE ROW LEVEL SECURITY;
ALTER TABLE viewing_room_pieces ENABLE ROW LEVEL SECURITY;
ALTER TABLE sourcing_leads      ENABLE ROW LEVEL SECURITY;

-- Artists
DROP POLICY IF EXISTS "artists_public_read" ON artists;
CREATE POLICY "artists_public_read" ON artists FOR SELECT USING (is_published = TRUE);
DROP POLICY IF EXISTS "artists_authenticated_all" ON artists;
CREATE POLICY "artists_authenticated_all" ON artists FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Pieces
DROP POLICY IF EXISTS "pieces_public_read" ON pieces;
CREATE POLICY "pieces_public_read" ON pieces FOR SELECT USING (status = 'publico');
DROP POLICY IF EXISTS "pieces_authenticated_all" ON pieces;
CREATE POLICY "pieces_authenticated_all" ON pieces FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Piece images
DROP POLICY IF EXISTS "piece_images_public_read" ON piece_images;
CREATE POLICY "piece_images_public_read" ON piece_images FOR SELECT
  USING (EXISTS (SELECT 1 FROM pieces WHERE pieces.id = piece_images.piece_id AND pieces.status = 'publico'));
DROP POLICY IF EXISTS "piece_images_authenticated_all" ON piece_images;
CREATE POLICY "piece_images_authenticated_all" ON piece_images FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Piece documents
DROP POLICY IF EXISTS "piece_documents_public_read" ON piece_documents;
CREATE POLICY "piece_documents_public_read" ON piece_documents FOR SELECT
  USING (is_public = TRUE AND EXISTS (
    SELECT 1 FROM pieces WHERE pieces.id = piece_documents.piece_id AND pieces.status = 'publico'
  ));
DROP POLICY IF EXISTS "piece_documents_authenticated_all" ON piece_documents;
CREATE POLICY "piece_documents_authenticated_all" ON piece_documents FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Boletim
DROP POLICY IF EXISTS "boletim_public_read" ON boletim_posts;
CREATE POLICY "boletim_public_read" ON boletim_posts FOR SELECT USING (is_published = TRUE);
DROP POLICY IF EXISTS "boletim_authenticated_all" ON boletim_posts;
CREATE POLICY "boletim_authenticated_all" ON boletim_posts FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Leads
DROP POLICY IF EXISTS "leads_authenticated_all" ON leads;
CREATE POLICY "leads_authenticated_all" ON leads FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "leads_anon_insert" ON leads;
CREATE POLICY "leads_anon_insert" ON leads FOR INSERT
  WITH CHECK (auth.role() = 'anon' OR auth.role() = 'authenticated');

-- Sales
DROP POLICY IF EXISTS "sales_authenticated_all" ON sales;
CREATE POLICY "sales_authenticated_all" ON sales FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Viewing rooms
DROP POLICY IF EXISTS "viewing_rooms_anon_read" ON viewing_rooms;
CREATE POLICY "viewing_rooms_anon_read" ON viewing_rooms FOR SELECT
  USING (is_active = TRUE AND expires_at > NOW());
DROP POLICY IF EXISTS "viewing_rooms_authenticated_all" ON viewing_rooms;
CREATE POLICY "viewing_rooms_authenticated_all" ON viewing_rooms FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "viewing_room_pieces_anon_read" ON viewing_room_pieces;
CREATE POLICY "viewing_room_pieces_anon_read" ON viewing_room_pieces FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM viewing_rooms
    WHERE viewing_rooms.id = viewing_room_pieces.viewing_room_id
      AND viewing_rooms.is_active = TRUE AND viewing_rooms.expires_at > NOW()
  ));
DROP POLICY IF EXISTS "viewing_room_pieces_authenticated_all" ON viewing_room_pieces;
CREATE POLICY "viewing_room_pieces_authenticated_all" ON viewing_room_pieces FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Sourcing leads
DROP POLICY IF EXISTS "sourcing_anon_insert" ON sourcing_leads;
CREATE POLICY "sourcing_anon_insert" ON sourcing_leads FOR INSERT
  WITH CHECK (auth.role() = 'anon' OR auth.role() = 'authenticated');
DROP POLICY IF EXISTS "sourcing_authenticated_all" ON sourcing_leads;
CREATE POLICY "sourcing_authenticated_all" ON sourcing_leads FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- ----------------------------------------------------------------------------
-- STORAGE BUCKETS
-- (INSERT idempotente — não falha se o bucket já existir)
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('piece-images',           'piece-images',           TRUE,  52428800,  ARRAY['image/jpeg','image/png','image/webp','image/avif']),
  ('piece-documents-public', 'piece-documents-public', TRUE,  10485760,  ARRAY['application/pdf','image/jpeg','image/png']),
  ('piece-documents-private','piece-documents-private',FALSE, 10485760,  ARRAY['application/pdf','image/jpeg','image/png']),
  ('kyc-documents',          'kyc-documents',          FALSE, 10485760,  ARRAY['application/pdf','image/jpeg','image/png']),
  ('viewing-room-assets',    'viewing-room-assets',    TRUE,  52428800,  ARRAY['image/jpeg','image/png','image/webp','image/avif']),
  ('dossier-pdfs',           'dossier-pdfs',           FALSE, 10485760,  ARRAY['application/pdf']),
  ('provenance-reports',     'provenance-reports',     FALSE, 10485760,  ARRAY['application/pdf','application/json'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies para piece-images (público — leitura anon)
DROP POLICY IF EXISTS "piece-images public read" ON storage.objects;
CREATE POLICY "piece-images public read" ON storage.objects FOR SELECT
  USING (bucket_id = 'piece-images');

DROP POLICY IF EXISTS "piece-images authenticated write" ON storage.objects;
CREATE POLICY "piece-images authenticated write" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'piece-images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "piece-images authenticated delete" ON storage.objects;
CREATE POLICY "piece-images authenticated delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'piece-images' AND auth.role() = 'authenticated');

-- kyc-documents — NUNCA público
DROP POLICY IF EXISTS "kyc-documents authenticated only" ON storage.objects;
CREATE POLICY "kyc-documents authenticated only" ON storage.objects FOR ALL
  USING (bucket_id = 'kyc-documents' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'kyc-documents' AND auth.role() = 'authenticated');

-- ----------------------------------------------------------------------------
-- SEED — 5 ARTISTAS-ÂNCORA
-- ----------------------------------------------------------------------------
INSERT INTO artists (slug, name, birth_year, death_year, birth_place, nationality, schools, bio_pt, is_published)
VALUES
  (
    'di-cavalcanti',
    'Emiliano Di Cavalcanti',
    1897, 1976,
    'Rio de Janeiro, Brasil',
    'Brasileira',
    ARRAY['Modernismo Brasileiro', 'Semana de Arte Moderna de 1922'],
    E'## Emiliano Di Cavalcanti\n\nPintor brasileiro fundamental do Modernismo, Emiliano Di Cavalcanti nasceu no Rio de Janeiro em 1897. Foi um dos organizadores da Semana de Arte Moderna de 1922, marco da modernidade no Brasil.\n\nSua obra é reconhecida pela representação vibrante da cultura afro-brasileira, mulatas, samba, carnaval e cenas do cotidiano popular do Rio de Janeiro. Trabalhou com óleo sobre tela, desenho, gravura e murais.\n\n*(Verbete inicial — expandir com pesquisa em catálogo raisonné e revisão curatorial antes de publicar.)*',
    FALSE
  ),
  (
    'pedro-americo',
    'Pedro Américo de Figueiredo e Melo',
    1843, 1905,
    'Areia, Paraíba, Brasil',
    'Brasileira',
    ARRAY['Academicismo', 'Pintura Histórica'],
    E'## Pedro Américo\n\nPintor, escritor e político brasileiro, Pedro Américo nasceu em Areia, na Paraíba, em 1843. É considerado um dos maiores expoentes da pintura histórica brasileira do século XIX.\n\nSua obra mais conhecida é *Independência ou Morte* (1888), conhecida popularmente como "O Grito do Ipiranga". Estudou em Paris na École des Beaux-Arts.\n\n**ATENÇÃO COMPLIANCE:** obras produzidas antes de 1889 estão sujeitas à Lei do Período Monárquico (Lei 4.845/1965) — não podem ser exportadas do Brasil.\n\n*(Verbete inicial — expandir antes de publicar.)*',
    FALSE
  ),
  (
    'djanira',
    'Djanira da Motta e Silva',
    1914, 1979,
    'Avaré, São Paulo, Brasil',
    'Brasileira',
    ARRAY['Modernismo Brasileiro', 'Pintura Naïf', 'Arte Popular'],
    E'## Djanira da Motta e Silva\n\nPintora brasileira, Djanira nasceu em Avaré (SP) em 1914. Sua obra capturou cenas do cotidiano brasileiro com forte presença popular, religiosa e do trabalho.\n\nDocumentou a vida em Minas Gerais, na Bahia e no Rio de Janeiro com paleta vibrante e composições marcantemente narrativas.\n\n*(Verbete inicial — expandir antes de publicar.)*',
    FALSE
  ),
  (
    'alfredo-volpi',
    'Alfredo Volpi',
    1896, 1988,
    'Lucca, Itália',
    'Ítalo-Brasileira',
    ARRAY['Modernismo Brasileiro', 'Concretismo', 'Pós-Modernismo'],
    E'## Alfredo Volpi\n\nNascido em Lucca, Itália, em 1896, Volpi chegou ao Brasil ainda criança. Foi um dos artistas mais importantes da segunda geração do modernismo brasileiro.\n\nReconhecido mundialmente pelas suas "Bandeirinhas" — composições geométricas inspiradas em festas juninas que se tornaram ícone visual da arte brasileira. Trabalhou predominantemente com têmpera sobre tela.\n\n*(Verbete inicial — expandir antes de publicar.)*',
    FALSE
  ),
  (
    'sergio-camargo',
    'Sergio de Camargo',
    1930, 1990,
    'Rio de Janeiro, Brasil',
    'Brasileira',
    ARRAY['Construtivismo', 'Arte Cinética', 'Neoconcretismo'],
    E'## Sergio de Camargo\n\nEscultor brasileiro nascido no Rio de Janeiro em 1930. Estudou em Buenos Aires sob Lucio Fontana e Emilio Pettoruti, e em Paris na Sorbonne.\n\nSua obra é reconhecida pelos relevos brancos em madeira — composições construtivistas que jogam com luz e sombra através da disposição de elementos cilíndricos. Recebeu o Prêmio Internacional de Escultura na Bienal de Paris.\n\nTem alto valor de mercado no segmento de escultura brasileira moderna.\n\n*(Verbete inicial — expandir antes de publicar.)*',
    FALSE
  )
ON CONFLICT (slug) DO NOTHING;
