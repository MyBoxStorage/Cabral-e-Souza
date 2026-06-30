-- ============================================================================
-- CABRAL & SOUZA — MIGRATION 0003: Bucket sourcing-uploads
-- ============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('sourcing-uploads', 'sourcing-uploads', FALSE, 52428800, ARRAY['image/jpeg','image/png','image/webp','image/avif'])
ON CONFLICT (id) DO NOTHING;

-- Apenas service role (via server actions) — sem acesso público
DROP POLICY IF EXISTS "sourcing-uploads service role" ON storage.objects;
CREATE POLICY "sourcing-uploads service role" ON storage.objects FOR ALL
  USING (bucket_id = 'sourcing-uploads' AND auth.role() = 'service_role')
  WITH CHECK (bucket_id = 'sourcing-uploads' AND auth.role() = 'service_role');
