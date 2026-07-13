-- ============================================================
-- NYIUR NANGGROE — Migrasi 003: Laporan Kualitas AI
-- Jalankan ini di: Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_quality_reports (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id            UUID NOT NULL REFERENCES seller_profiles(id) ON DELETE CASCADE,
  image_url           TEXT NOT NULL,
  overall_grade       TEXT NOT NULL, -- 'A', 'B', 'C'
  moisture_estimate   TEXT,          -- persentase estimasi kandungan air
  surface_condition   TEXT,          -- kondisi fisik permukaan
  color_consistency   TEXT,          -- konsistensi warna produk
  packaging_appearance TEXT,         -- kualitas & kerapian kemasan
  image_quality       TEXT,          -- kejelasan pencahayaan / resolusi foto
  presentation_score  NUMERIC(5,2) NOT NULL DEFAULT 0, -- skor keseluruhan (0-100)
  potential_market    TEXT NOT NULL, -- 'Local', 'National', 'Export'
  suggestions         JSONB NOT NULL DEFAULT '[]'::jsonb, -- array saran perbaikan
  explanation         TEXT NOT NULL, -- penjelasan alasan nilai
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Buat index untuk pencarian cepat berdasarkan toko
CREATE INDEX IF NOT EXISTS idx_quality_reports_store_id ON ai_quality_reports(store_id);
CREATE INDEX IF NOT EXISTS idx_quality_reports_created_at ON ai_quality_reports(created_at DESC);

-- Aktifkan RLS (Row Level Security)
ALTER TABLE ai_quality_reports ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS (Hanya penjual pemilik toko yang bisa membaca/menambah data laporan kuis mereka sendiri)
CREATE POLICY "quality_reports_select_own" ON ai_quality_reports FOR SELECT USING (
  store_id IN (
    SELECT id FROM seller_profiles 
    WHERE owner_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
  )
);

CREATE POLICY "quality_reports_insert_own" ON ai_quality_reports FOR INSERT WITH CHECK (
  store_id IN (
    SELECT id FROM seller_profiles 
    WHERE owner_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
  )
);

CREATE POLICY "quality_reports_admin_all" ON ai_quality_reports FOR ALL USING (
  get_user_role(auth.uid()) = 'admin'
);
