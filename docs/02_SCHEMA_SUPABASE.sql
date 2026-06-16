-- ============================================================================
-- CABRAL & SOUZA — SCHEMA SUPABASE COMPLETO
-- ============================================================================
-- Versão: 1.0.0
-- Compatível com: Postgres 15+ / Supabase
-- Ordem de execução: rodar este arquivo do início ao fim no Supabase SQL Editor
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
CREATE TYPE piece_status AS ENUM (
  'rascunho',         -- só visível no admin
  'privado',          -- visível apenas via link direto
  'publico',          -- listado publicamente
  'reservado',        -- em negociação
  'vendido',          -- venda concluída
  'arquivado'         -- removido da operação ativa
);

CREATE TYPE piece_origin AS ENUM (
  'propria',          -- estoque da galeria
  'consignada',       -- de terceiros
  'parceria'          -- joint venture
);

CREATE TYPE piece_category AS ENUM (
  'pintura',
  'escultura',
  'desenho',
  'gravura',
  'fotografia',
  'objeto',
  'antiguidade'
);

CREATE TYPE lead_source AS ENUM (
  'site_formulario',
  'whatsapp',
  'instagram',
  'google_meu_negocio',
  'indicacao',
  'newsletter',
  'viewing_room',
  'sourcing_form',
  'outro'
);

CREATE TYPE lead_status AS ENUM (
  'novo',
  'qualificado',
  'em_negociacao',
  'ganho',
  'perdido',
  'descartado'
);

CREATE TYPE buyer_profile AS ENUM (
  'colecionador',
  'investidor',
  'decorador',
  'arquiteto',
  'curioso',
  'instituicao',
  'nao_informado'
);

CREATE TYPE sale_status AS ENUM (
  'sinal_pendente',         -- 30% não pago
  'sinal_pago',
  'kyc_pendente',
  'em_transito',
  'em_aprovacao',           -- período de 5 dias
  'pagamento_final_pendente',
  'concluida',
  'cancelada',
  'devolvida'
);

CREATE TYPE language_code AS ENUM ('pt-BR', 'en-US', 'fr-FR');

CREATE TYPE attribution_role AS ENUM (
  'autoria_confirmada',     -- COA + raisonné
  'atribuida',              -- atribuição por especialista
  'circulo_de',             -- entorno do artista
  'escola_de',              -- discípulos
  'apocrifa'                -- contestada
);

-- ----------------------------------------------------------------------------
-- ARTISTAS
-- ----------------------------------------------------------------------------
CREATE TABLE artists (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  birth_year      INT,
  death_year      INT,
  birth_place     TEXT,
  nationality     TEXT,
  schools         TEXT[],              -- ex: ['Modernismo Brasileiro', 'Geração de 22']
  bio_pt          TEXT,                 -- markdown
  bio_en          TEXT,
  bio_fr          TEXT,
  market_notes_pt TEXT,                 -- análise de mercado markdown
  hero_image_url  TEXT,
  signatures      JSONB,                -- exemplos de assinaturas para vision matching
  external_refs   JSONB,                -- {wikipedia, museums, raisonne_url, etc}
  is_published    BOOLEAN NOT NULL DEFAULT FALSE,
  needs_retranslation BOOLEAN NOT NULL DEFAULT FALSE,
  content_hash    TEXT,                 -- hash do conteúdo PT para cache de tradução
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_artists_slug ON artists(slug);
CREATE INDEX idx_artists_published ON artists(is_published) WHERE is_published = TRUE;
CREATE INDEX idx_artists_name_trgm ON artists USING gin (name gin_trgm_ops);

-- ----------------------------------------------------------------------------
-- PEÇAS (ACERVO)
-- ----------------------------------------------------------------------------
CREATE TABLE pieces (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  internal_code         TEXT UNIQUE NOT NULL,       -- ex: CS-2026-0001
  slug                  TEXT UNIQUE NOT NULL,        -- ex: di-cavalcanti-mulheres-1958
  artist_id             UUID REFERENCES artists(id) ON DELETE RESTRICT,
  attribution           attribution_role NOT NULL DEFAULT 'autoria_confirmada',

  -- Identificação
  title_pt              TEXT NOT NULL,
  title_en              TEXT,
  title_fr              TEXT,
  category              piece_category NOT NULL,
  technique_pt          TEXT,           -- ex: "Óleo sobre tela"
  technique_en          TEXT,
  technique_fr          TEXT,

  -- Dimensões (cm)
  height_cm             NUMERIC(10,2),
  width_cm              NUMERIC(10,2),
  depth_cm              NUMERIC(10,2),
  weight_kg             NUMERIC(10,3),

  -- Datação
  year_created          INT,
  year_created_circa    BOOLEAN DEFAULT FALSE,        -- "ca. 1958"
  period_label          TEXT,                          -- ex: "década de 1950"

  -- Assinatura
  is_signed             BOOLEAN,
  signature_location    TEXT,                          -- ex: "CIE", "verso"
  is_dated_on_piece     BOOLEAN,

  -- Estado de conservação
  condition_pt          TEXT,                          -- "excelente", "bom", "com restauros"
  condition_notes_pt    TEXT,
  has_restoration       BOOLEAN DEFAULT FALSE,
  restoration_notes_pt  TEXT,

  -- Conteúdo curatorial
  description_pt        TEXT,                          -- markdown
  description_en        TEXT,
  description_fr        TEXT,
  curator_notes_pt      TEXT,                          -- markdown, observações de curadoria
  provenance_pt         TEXT,                          -- histórico de posse, markdown
  provenance_en         TEXT,
  provenance_fr         TEXT,
  exhibition_history_pt TEXT,                          -- exposições, markdown
  bibliography_pt       TEXT,                          -- referências bibliográficas

  -- Comercial
  price_brl             NUMERIC(15,2),                 -- preço de tabela
  price_visibility      TEXT NOT NULL DEFAULT 'sob_consulta'
                         CHECK (price_visibility IN ('publico', 'sob_consulta', 'oculto')),
  origin                piece_origin NOT NULL,
  consignor_name        TEXT,                          -- visível apenas no admin
  consignor_contact     TEXT,                          -- visível apenas no admin
  consignor_commission  NUMERIC(5,2),                  -- % para consignador
  consignor_confidential BOOLEAN DEFAULT FALSE,        -- se TRUE, peça não pode ser pública

  -- Status e visibilidade
  status                piece_status NOT NULL DEFAULT 'rascunho',
  featured              BOOLEAN NOT NULL DEFAULT FALSE,
  acquisition_date      DATE,
  acquired_from         TEXT,                          -- onde foi adquirida

  -- Compliance
  iphan_restricted      BOOLEAN DEFAULT FALSE,         -- restrição de exportação
  iphan_notes           TEXT,
  cnart_reported_at     DATE,                          -- última inclusão em relatório CNART

  -- SEO
  seo_title_pt          TEXT,
  seo_description_pt    TEXT,

  -- Cache de tradução
  needs_retranslation   BOOLEAN NOT NULL DEFAULT FALSE,
  content_hash          TEXT,

  -- Embedding para RAG (ficha técnica + descrição + verbete do artista)
  embedding             vector(1536),

  -- Auditoria
  view_count            INT NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at          TIMESTAMPTZ,
  sold_at               TIMESTAMPTZ
);

CREATE INDEX idx_pieces_slug ON pieces(slug);
CREATE INDEX idx_pieces_artist ON pieces(artist_id);
CREATE INDEX idx_pieces_status ON pieces(status);
CREATE INDEX idx_pieces_featured ON pieces(featured) WHERE featured = TRUE;
CREATE INDEX idx_pieces_category ON pieces(category);
CREATE INDEX idx_pieces_embedding ON pieces USING hnsw (embedding vector_cosine_ops);
CREATE INDEX idx_pieces_title_trgm ON pieces USING gin (title_pt gin_trgm_ops);

-- ----------------------------------------------------------------------------
-- IMAGENS DAS PEÇAS
-- ----------------------------------------------------------------------------
CREATE TABLE piece_images (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  piece_id        UUID NOT NULL REFERENCES pieces(id) ON DELETE CASCADE,
  storage_path    TEXT NOT NULL,            -- caminho no Supabase Storage
  url_original    TEXT NOT NULL,            -- alta resolução, JPEG
  url_large       TEXT,                      -- 2000px, WebP
  url_medium      TEXT,                      -- 1200px, WebP
  url_thumbnail   TEXT,                      -- 400px, WebP
  alt_text_pt     TEXT,
  caption_pt      TEXT,
  is_primary      BOOLEAN NOT NULL DEFAULT FALSE,
  image_type      TEXT NOT NULL DEFAULT 'principal'
                  CHECK (image_type IN ('principal', 'detalhe', 'assinatura', 'verso', 'moldura', 'ambiente', 'certificado')),
  sort_order      INT NOT NULL DEFAULT 0,
  width_px        INT,
  height_px       INT,
  bytes           INT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_piece_images_piece ON piece_images(piece_id);
CREATE INDEX idx_piece_images_primary ON piece_images(piece_id, is_primary) WHERE is_primary = TRUE;

-- ----------------------------------------------------------------------------
-- DOCUMENTOS (COA, LAUDOS, NF, CONTRATOS, KYC)
-- ----------------------------------------------------------------------------
CREATE TABLE piece_documents (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  piece_id        UUID REFERENCES pieces(id) ON DELETE CASCADE,
  doc_type        TEXT NOT NULL CHECK (doc_type IN (
                    'coa',                  -- certificado de autenticidade
                    'laudo',                -- laudo de especialista
                    'recibo_origem',        -- recibo de aquisição
                    'inventario',           -- inventário/espólio
                    'foto_assinatura',
                    'parecer_iphan',
                    'historico_leilao',
                    'outro'
                  )),
  title           TEXT NOT NULL,
  storage_path    TEXT NOT NULL,
  url             TEXT NOT NULL,
  is_public       BOOLEAN NOT NULL DEFAULT FALSE,  -- se exposto na ficha pública
  issued_by       TEXT,                            -- especialista, instituição
  issued_at       DATE,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_piece_documents_piece ON piece_documents(piece_id);

-- ----------------------------------------------------------------------------
-- COMPARÁVEIS DE LEILÃO (PARA DOSSIÊS E INTELIGÊNCIA DE MERCADO)
-- ----------------------------------------------------------------------------
CREATE TABLE auction_comparables (
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
  currency_at_brl NUMERIC(15,2),            -- valor convertido para BRL na data
  image_url       TEXT,
  source_url      TEXT,
  notes           TEXT,
  scraped_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_auction_comparables_artist ON auction_comparables(artist_id, auction_date DESC);
CREATE INDEX idx_auction_comparables_date ON auction_comparables(auction_date DESC);

-- ----------------------------------------------------------------------------
-- TRADUÇÕES — CACHE
-- ----------------------------------------------------------------------------
CREATE TABLE translations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_hash    TEXT NOT NULL,             -- hash sha256 do source PT
  source_table    TEXT NOT NULL,             -- 'pieces', 'artists', 'posts'
  source_id       UUID NOT NULL,
  source_field    TEXT NOT NULL,             -- 'description_pt', 'bio_pt'
  language        language_code NOT NULL,
  translated_text TEXT NOT NULL,
  tokens_used     INT,
  cost_usd        NUMERIC(10,6),
  translated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (content_hash, language)
);

CREATE INDEX idx_translations_hash ON translations(content_hash, language);
CREATE INDEX idx_translations_source ON translations(source_table, source_id);

-- ----------------------------------------------------------------------------
-- LEADS
-- ----------------------------------------------------------------------------
CREATE TABLE leads (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name              TEXT NOT NULL,
  email             TEXT,
  phone             TEXT,
  buyer_profile     buyer_profile DEFAULT 'nao_informado',
  source            lead_source NOT NULL,
  status            lead_status NOT NULL DEFAULT 'novo',

  -- Contexto de origem
  piece_id          UUID REFERENCES pieces(id),       -- peça que motivou o lead
  viewing_room_id   UUID,                              -- se veio de VR
  utm_source        TEXT,
  utm_medium        TEXT,
  utm_campaign      TEXT,
  utm_content       TEXT,
  utm_term          TEXT,
  referrer          TEXT,
  landing_page      TEXT,

  -- Atribuição
  first_touch_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_touch_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  assigned_to       TEXT,                              -- email do responsável

  -- Notas e tags
  notes_internal    TEXT,
  tags              TEXT[],

  -- Compliance LGPD
  consent_marketing BOOLEAN NOT NULL DEFAULT FALSE,
  consent_at        TIMESTAMPTZ,
  consent_ip        TEXT,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_piece ON leads(piece_id);
CREATE INDEX idx_leads_email ON leads(email);

-- ----------------------------------------------------------------------------
-- LEAD ATTRIBUTION EVENTS (TIMELINE COMPLETA POR LEAD)
-- ----------------------------------------------------------------------------
CREATE TABLE lead_events (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id         UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  event_type      TEXT NOT NULL,           -- 'pageview', 'form_submit', 'whatsapp_started', 'vr_opened', 'pdf_downloaded', 'visit_scheduled', 'sale_closed'
  piece_id        UUID REFERENCES pieces(id),
  metadata        JSONB,
  occurred_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lead_events_lead ON lead_events(lead_id, occurred_at DESC);

-- ----------------------------------------------------------------------------
-- VIEWING ROOMS PRIVADOS
-- ----------------------------------------------------------------------------
CREATE TABLE viewing_rooms (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token             TEXT UNIQUE NOT NULL,    -- token para URL pública
  client_name       TEXT NOT NULL,
  client_email      TEXT,
  message_pt        TEXT,                     -- mensagem personalizada
  message_en        TEXT,
  message_fr        TEXT,
  expires_at        TIMESTAMPTZ NOT NULL,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_by        TEXT NOT NULL,            -- email do executor
  notes_internal    TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_viewing_rooms_token ON viewing_rooms(token);
CREATE INDEX idx_viewing_rooms_active ON viewing_rooms(is_active, expires_at);

CREATE TABLE viewing_room_pieces (
  viewing_room_id   UUID NOT NULL REFERENCES viewing_rooms(id) ON DELETE CASCADE,
  piece_id          UUID NOT NULL REFERENCES pieces(id) ON DELETE CASCADE,
  sort_order        INT NOT NULL DEFAULT 0,
  curator_note_pt   TEXT,
  PRIMARY KEY (viewing_room_id, piece_id)
);

CREATE TABLE viewing_room_events (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  viewing_room_id   UUID NOT NULL REFERENCES viewing_rooms(id) ON DELETE CASCADE,
  event_type        TEXT NOT NULL,           -- 'opened', 'piece_viewed', 'pdf_downloaded', 'interest_clicked', 'whatsapp_clicked', 'shared'
  piece_id          UUID REFERENCES pieces(id),
  duration_seconds  INT,                      -- para piece_viewed
  metadata          JSONB,
  occurred_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  client_ip         INET,
  user_agent        TEXT
);

CREATE INDEX idx_vr_events_room ON viewing_room_events(viewing_room_id, occurred_at DESC);

-- ----------------------------------------------------------------------------
-- VENDAS — COM PROTOCOLO ANTIFRAUDE EMBUTIDO
-- ----------------------------------------------------------------------------
CREATE TABLE sales (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  piece_id                UUID NOT NULL REFERENCES pieces(id),
  lead_id                 UUID REFERENCES leads(id),
  buyer_name              TEXT NOT NULL,
  buyer_email             TEXT,
  buyer_phone             TEXT,
  buyer_cpf_cnpj          TEXT,                    -- criptografado em produção
  buyer_address           JSONB,                    -- {cep, logradouro, numero, bairro, cidade, uf}

  -- Comercial
  agreed_price_brl        NUMERIC(15,2) NOT NULL,
  signal_amount_brl       NUMERIC(15,2),
  final_amount_brl        NUMERIC(15,2),
  payment_method          TEXT,
  status                  sale_status NOT NULL DEFAULT 'sinal_pendente',

  -- KYC
  kyc_document_url        TEXT,                     -- RG ou CNH
  kyc_proof_residence_url TEXT,
  kyc_selfie_url          TEXT,
  kyc_validated_at        TIMESTAMPTZ,
  kyc_validated_by        TEXT,

  -- Pagamento escalonado
  signal_paid_at          TIMESTAMPTZ,
  final_payment_at        TIMESTAMPTZ,

  -- Logística
  shipping_carrier        TEXT,                     -- Millenium, Atlantis, etc
  shipping_tracking       TEXT,
  shipping_insurance_brl  NUMERIC(15,2),
  shipped_at              TIMESTAMPTZ,
  delivered_at            TIMESTAMPTZ,

  -- Aprovação (5 dias)
  approval_deadline       TIMESTAMPTZ,
  unboxing_video_url      TEXT,                     -- vídeo obrigatório
  approved_at             TIMESTAMPTZ,

  -- Documentação final
  contract_url            TEXT,
  invoice_url             TEXT,
  certificate_url         TEXT,

  -- Atribuição da comissão
  digital_attributed      BOOLEAN NOT NULL DEFAULT FALSE,
  digital_attribution_notes TEXT,
  executor_commission_pct NUMERIC(5,2),
  executor_commission_brl NUMERIC(15,2),

  -- Compliance
  cnart_reported          BOOLEAN NOT NULL DEFAULT FALSE,
  coaf_communication      BOOLEAN NOT NULL DEFAULT FALSE,
  coaf_communication_at   TIMESTAMPTZ,
  iphan_export_consult    BOOLEAN,                   -- só para venda internacional
  iphan_consult_protocol  TEXT,

  notes_internal          TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_at               TIMESTAMPTZ
);

CREATE INDEX idx_sales_piece ON sales(piece_id);
CREATE INDEX idx_sales_status ON sales(status);
CREATE INDEX idx_sales_lead ON sales(lead_id);

-- ----------------------------------------------------------------------------
-- SOURCING LEADS (FAMÍLIAS/PESSOAS QUERENDO VENDER)
-- ----------------------------------------------------------------------------
CREATE TABLE sourcing_leads (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_name           TEXT NOT NULL,
  seller_email          TEXT,
  seller_phone          TEXT,
  seller_city           TEXT,
  seller_state          TEXT,

  -- Descrição da peça
  artist_claimed        TEXT,
  technique_claimed     TEXT,
  dimensions_claimed    TEXT,
  year_claimed          TEXT,
  acquisition_history   TEXT,
  expected_value_brl    NUMERIC(15,2),
  has_documents         BOOLEAN,
  documents_description TEXT,

  -- Fotos
  photos                JSONB,                       -- array de URLs

  -- Workflow
  status                TEXT NOT NULL DEFAULT 'aguardando_analise'
                        CHECK (status IN ('aguardando_analise', 'em_pesquisa', 'proposta_enviada',
                                          'aceita', 'recusada', 'inviavel', 'arquivado')),
  provenance_report_url TEXT,                         -- output do agente
  preliminary_estimate_brl NUMERIC(15,2),
  proposal_amount_brl   NUMERIC(15,2),
  proposal_type         TEXT CHECK (proposal_type IN ('compra_a_vista', 'consignacao', 'misto')),

  -- Atribuição da comissão executor (20% se ele captou e fechou venda)
  executor_captured     BOOLEAN NOT NULL DEFAULT TRUE,
  resulted_in_piece_id  UUID REFERENCES pieces(id),  -- peça resultante quando captada

  utm_source            TEXT,
  utm_medium            TEXT,
  utm_campaign          TEXT,

  consent_data          BOOLEAN NOT NULL DEFAULT FALSE,
  consent_at            TIMESTAMPTZ,

  assigned_to           TEXT,
  notes_internal        TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sourcing_status ON sourcing_leads(status);

-- ----------------------------------------------------------------------------
-- PROVENANCE AGENT — LOG DE EXECUÇÕES
-- ----------------------------------------------------------------------------
CREATE TABLE provenance_executions (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  executed_by           TEXT NOT NULL,
  source_type           TEXT NOT NULL CHECK (source_type IN ('sourcing_lead', 'manual', 'piece_review')),
  sourcing_lead_id      UUID REFERENCES sourcing_leads(id),
  piece_id              UUID REFERENCES pieces(id),

  inputs                JSONB NOT NULL,              -- dados de entrada estruturados
  output_report         JSONB,                        -- relatório estruturado
  output_pdf_url        TEXT,
  confidence_score      INT CHECK (confidence_score >= 0 AND confidence_score <= 100),

  tokens_input          INT,
  tokens_output         INT,
  cost_usd              NUMERIC(10,4),
  duration_ms           INT,

  status                TEXT NOT NULL DEFAULT 'em_execucao'
                        CHECK (status IN ('em_execucao', 'concluida', 'falha', 'cancelada')),
  error_message         TEXT,

  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at          TIMESTAMPTZ
);

-- ----------------------------------------------------------------------------
-- WHATSAPP — CONVERSAS E MENSAGENS
-- ----------------------------------------------------------------------------
CREATE TABLE whatsapp_conversations (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone                 TEXT NOT NULL,
  contact_name          TEXT,
  lead_id               UUID REFERENCES leads(id),

  bot_active            BOOLEAN NOT NULL DEFAULT TRUE,
  handed_off_at         TIMESTAMPTZ,
  handoff_reason        TEXT,

  last_message_at       TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_wpp_phone ON whatsapp_conversations(phone);

CREATE TABLE whatsapp_messages (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id       UUID NOT NULL REFERENCES whatsapp_conversations(id) ON DELETE CASCADE,
  direction             TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  sender_type           TEXT NOT NULL CHECK (sender_type IN ('client', 'bot', 'human')),
  content               TEXT NOT NULL,
  media_url             TEXT,
  classified_intent     TEXT,                         -- ex: 'qualification', 'piece_inquiry', 'high_intent'
  rag_pieces_used       UUID[],                        -- peças consultadas no RAG
  tokens_used           INT,
  occurred_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_wpp_messages_conv ON whatsapp_messages(conversation_id, occurred_at);

-- ----------------------------------------------------------------------------
-- BOLETIM (BLOG) — ANÁLISES DE MERCADO E LEILÕES
-- ----------------------------------------------------------------------------
CREATE TABLE boletim_posts (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug              TEXT UNIQUE NOT NULL,
  category          TEXT NOT NULL CHECK (category IN ('analise_leilao', 'verbete_artista', 'mercado', 'editorial', 'noticia')),
  title_pt          TEXT NOT NULL,
  title_en          TEXT,
  title_fr          TEXT,
  excerpt_pt        TEXT,
  excerpt_en        TEXT,
  excerpt_fr        TEXT,
  content_pt        TEXT NOT NULL,                  -- markdown
  content_en        TEXT,
  content_fr        TEXT,
  hero_image_url    TEXT,
  related_artists   UUID[],                          -- referências a artists.id
  related_pieces    UUID[],
  author            TEXT,
  published_at      TIMESTAMPTZ,
  is_published      BOOLEAN NOT NULL DEFAULT FALSE,
  seo_title         TEXT,
  seo_description   TEXT,
  needs_retranslation BOOLEAN NOT NULL DEFAULT FALSE,
  content_hash      TEXT,
  view_count        INT NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_boletim_slug ON boletim_posts(slug);
CREATE INDEX idx_boletim_published ON boletim_posts(is_published, published_at DESC) WHERE is_published = TRUE;
CREATE INDEX idx_boletim_category ON boletim_posts(category);

-- ----------------------------------------------------------------------------
-- NEWSLETTER SUBSCRIBERS
-- ----------------------------------------------------------------------------
CREATE TABLE newsletter_subscribers (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email             TEXT UNIQUE NOT NULL,
  name              TEXT,
  language          language_code NOT NULL DEFAULT 'pt-BR',
  source            lead_source,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  confirmed_at      TIMESTAMPTZ,                     -- double opt-in
  unsubscribed_at   TIMESTAMPTZ,
  consent_ip        TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- COMPLIANCE — REGISTROS CNART/COAF
-- ----------------------------------------------------------------------------
CREATE TABLE cnart_reports (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  period_start      DATE NOT NULL,
  period_end        DATE NOT NULL,
  pieces_count      INT NOT NULL,
  export_url        TEXT,                            -- arquivo CSV gerado
  submitted_to_iphan_at TIMESTAMPTZ,
  submitted_by      TEXT,
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE coaf_communications (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id           UUID REFERENCES sales(id),
  communication_type TEXT NOT NULL CHECK (communication_type IN ('cash_above_10k', 'suspicious', 'annual_non_occurrence')),
  amount_brl        NUMERIC(15,2),
  description       TEXT,
  submitted_at      TIMESTAMPTZ,
  protocol_number   TEXT,
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
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
DECLARE
  t TEXT;
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
-- TRIGGER: MARCAR NECESSIDADE DE RETRADUÇÃO QUANDO CONTEÚDO PT MUDA
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION flag_retranslation_pieces()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.description_pt IS DISTINCT FROM OLD.description_pt
     OR NEW.provenance_pt IS DISTINCT FROM OLD.provenance_pt
     OR NEW.title_pt IS DISTINCT FROM OLD.title_pt THEN
    NEW.needs_retranslation := TRUE;
    NEW.content_hash := encode(digest(
      COALESCE(NEW.title_pt, '') || COALESCE(NEW.description_pt, '') || COALESCE(NEW.provenance_pt, ''),
      'sha256'
    ), 'hex');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_flag_retranslation_pieces
BEFORE UPDATE ON pieces
FOR EACH ROW EXECUTE FUNCTION flag_retranslation_pieces();

-- ----------------------------------------------------------------------------
-- FUNÇÃO RPC: BUSCA VETORIAL DE PEÇAS (PARA RAG DO BOT WHATSAPP)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION match_pieces(
  query_embedding vector(1536),
  match_threshold FLOAT DEFAULT 0.78,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  internal_code TEXT,
  title_pt TEXT,
  description_pt TEXT,
  similarity FLOAT
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.internal_code,
    p.title_pt,
    p.description_pt,
    1 - (p.embedding <=> query_embedding) AS similarity
  FROM pieces p
  WHERE p.status IN ('publico', 'reservado')
    AND p.embedding IS NOT NULL
    AND 1 - (p.embedding <=> query_embedding) > match_threshold
  ORDER BY p.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
-- ----------------------------------------------------------------------------
-- Estratégia:
--   - Acesso público (anon) só lê peças/artistas/posts publicados
--   - Acesso autenticado (admin) lê e escreve tudo
--   - Documentos KYC nunca expostos publicamente

ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE pieces ENABLE ROW LEVEL SECURITY;
ALTER TABLE piece_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE piece_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE boletim_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE viewing_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE viewing_room_pieces ENABLE ROW LEVEL SECURITY;
ALTER TABLE sourcing_leads ENABLE ROW LEVEL SECURITY;

-- Artistas: leitura pública apenas se publicado; escrita só autenticado
CREATE POLICY "artists_public_read" ON artists FOR SELECT
  USING (is_published = TRUE);
CREATE POLICY "artists_authenticated_all" ON artists FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Peças: leitura pública apenas com status público
CREATE POLICY "pieces_public_read" ON pieces FOR SELECT
  USING (status = 'publico');
CREATE POLICY "pieces_authenticated_all" ON pieces FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Imagens: visíveis se peça associada é pública
CREATE POLICY "piece_images_public_read" ON piece_images FOR SELECT
  USING (EXISTS (SELECT 1 FROM pieces WHERE pieces.id = piece_images.piece_id AND pieces.status = 'publico'));
CREATE POLICY "piece_images_authenticated_all" ON piece_images FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Documentos: NUNCA públicos, exceto explicitamente marcados
CREATE POLICY "piece_documents_public_read" ON piece_documents FOR SELECT
  USING (is_public = TRUE AND EXISTS (
    SELECT 1 FROM pieces WHERE pieces.id = piece_documents.piece_id AND pieces.status = 'publico'
  ));
CREATE POLICY "piece_documents_authenticated_all" ON piece_documents FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Boletim
CREATE POLICY "boletim_public_read" ON boletim_posts FOR SELECT
  USING (is_published = TRUE);
CREATE POLICY "boletim_authenticated_all" ON boletim_posts FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Leads: somente autenticado
CREATE POLICY "leads_authenticated_all" ON leads FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Mas anon pode INSERT em leads (formulário público)
CREATE POLICY "leads_anon_insert" ON leads FOR INSERT
  WITH CHECK (auth.role() = 'anon' OR auth.role() = 'authenticated');

-- Sales: somente autenticado
CREATE POLICY "sales_authenticated_all" ON sales FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Viewing rooms: leitura por token (sem auth) — controle feito na aplicação
-- Por isso permitimos SELECT anon, mas a aplicação filtra por token + expiração
CREATE POLICY "viewing_rooms_anon_read" ON viewing_rooms FOR SELECT
  USING (is_active = TRUE AND expires_at > NOW());
CREATE POLICY "viewing_rooms_authenticated_all" ON viewing_rooms FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "viewing_room_pieces_anon_read" ON viewing_room_pieces FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM viewing_rooms WHERE viewing_rooms.id = viewing_room_pieces.viewing_room_id
      AND viewing_rooms.is_active = TRUE
      AND viewing_rooms.expires_at > NOW()
  ));
CREATE POLICY "viewing_room_pieces_authenticated_all" ON viewing_room_pieces FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Sourcing leads: anon insert (form público), authenticated all
CREATE POLICY "sourcing_anon_insert" ON sourcing_leads FOR INSERT
  WITH CHECK (auth.role() = 'anon' OR auth.role() = 'authenticated');
CREATE POLICY "sourcing_authenticated_all" ON sourcing_leads FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ----------------------------------------------------------------------------
-- STORAGE BUCKETS (criar via UI ou via SQL após login)
-- ----------------------------------------------------------------------------
-- Criar manualmente no Supabase Studio:
--   - `piece-images` (público)
--   - `piece-documents-public` (público)
--   - `piece-documents-private` (privado, signed URLs)
--   - `kyc-documents` (privado, retenção 5 anos)
--   - `viewing-room-assets` (público)
--   - `dossier-pdfs` (privado, signed URLs com expiração 7 dias)
--   - `provenance-reports` (privado)

-- ----------------------------------------------------------------------------
-- SEED — ARTISTAS-ÂNCORA (executar após criar o schema)
-- ----------------------------------------------------------------------------
INSERT INTO artists (slug, name, birth_year, death_year, birth_place, nationality, schools, bio_pt, is_published) VALUES
  ('di-cavalcanti',
   'Emiliano Di Cavalcanti',
   1897, 1976,
   'Rio de Janeiro, Brasil',
   'Brasileira',
   ARRAY['Modernismo Brasileiro', 'Semana de Arte Moderna de 1922'],
   '## Emiliano Di Cavalcanti

Pintor brasileiro fundamental do Modernismo, Emiliano Di Cavalcanti nasceu no Rio de Janeiro em 1897. Foi um dos organizadores da Semana de Arte Moderna de 1922, marco da modernidade no Brasil.

Sua obra é reconhecida pela representação vibrante da cultura afro-brasileira, mulatas, samba, carnaval e cenas do cotidiano popular do Rio de Janeiro. Trabalhou com óleo sobre tela, desenho, gravura e murais.

(Verbete inicial — expandir com pesquisa em catálogo raisonné e revisão curatorial antes de publicar.)',
   FALSE),

  ('pedro-americo',
   'Pedro Américo de Figueiredo e Melo',
   1843, 1905,
   'Areia, Paraíba, Brasil',
   'Brasileira',
   ARRAY['Academicismo', 'Pintura Histórica'],
   '## Pedro Américo

Pintor, escritor e político brasileiro, Pedro Américo nasceu em Areia, na Paraíba, em 1843. É considerado um dos maiores expoentes da pintura histórica brasileira do século XIX.

Sua obra mais conhecida é "Independência ou Morte" (1888), conhecida popularmente como "O Grito do Ipiranga". Estudou em Paris na École des Beaux-Arts.

**ATENÇÃO COMPLIANCE:** obras produzidas antes de 1889 estão sujeitas à Lei do Período Monárquico (Lei 4.845/1965) — não podem ser exportadas do Brasil.

(Verbete inicial — expandir antes de publicar.)',
   FALSE),

  ('djanira',
   'Djanira da Motta e Silva',
   1914, 1979,
   'Avaré, São Paulo, Brasil',
   'Brasileira',
   ARRAY['Modernismo Brasileiro', 'Pintura Naïf', 'Arte Popular'],
   '## Djanira da Motta e Silva

Pintora brasileira, Djanira nasceu em Avaré (SP) em 1914. Sua obra capturou cenas do cotidiano brasileiro com forte presença popular, religiosa e do trabalho.

Documentou a vida em Minas Gerais, na Bahia e no Rio de Janeiro com paleta vibrante e composições marcantemente narrativas.

(Verbete inicial — expandir antes de publicar.)',
   FALSE),

  ('alfredo-volpi',
   'Alfredo Volpi',
   1896, 1988,
   'Lucca, Itália',
   'Ítalo-Brasileira',
   ARRAY['Modernismo Brasileiro', 'Concretismo', 'Pós-Modernismo'],
   '## Alfredo Volpi

Nascido em Lucca, Itália, em 1896, Volpi chegou ao Brasil ainda criança. Foi um dos artistas mais importantes da segunda geração do modernismo brasileiro.

Reconhecido mundialmente pelas suas "Bandeirinhas" — composições geométricas inspiradas em festas juninas que se tornaram ícone visual da arte brasileira. Trabalhou predominantemente com têmpera sobre tela.

(Verbete inicial — expandir antes de publicar.)',
   FALSE),

  ('sergio-camargo',
   'Sergio de Camargo',
   1930, 1990,
   'Rio de Janeiro, Brasil',
   'Brasileira',
   ARRAY['Construtivismo', 'Arte Cinética', 'Neoconcretismo'],
   '## Sergio de Camargo

Escultor brasileiro nascido no Rio de Janeiro em 1930. Estudou em Buenos Aires sob Lucio Fontana e Emilio Pettoruti, e em Paris na Sorbonne.

Sua obra é reconhecida pelos relevos brancos em madeira — composições construtivistas que jogam com luz e sombra através da disposição de elementos cilíndricos. Recebeu o Prêmio Internacional de Escultura na Bienal de Paris.

Tem alto valor de mercado no segmento de escultura brasileira moderna.

(Verbete inicial — expandir antes de publicar.)',
   FALSE);

-- ----------------------------------------------------------------------------
-- FIM DO SCHEMA
-- ----------------------------------------------------------------------------
-- Próximo passo: gerar tipos TypeScript com `supabase gen types typescript`
-- ----------------------------------------------------------------------------
