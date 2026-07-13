-- ============================================================
-- NYIUR NANGGROE — Seed Data
-- Run AFTER 001_initial_schema.sql
-- Note: Insert users via Supabase Auth API, not directly into auth.users
-- ============================================================

-- ============================================================
-- CATEGORIES
-- ============================================================

INSERT INTO categories (name, name_en, slug, description, icon, sort_order, is_active) VALUES
  ('Kelapa Segar', 'Fresh Coconut', 'kelapa-segar', 'Kelapa segar langsung dari kebun petani', '🥥', 1, TRUE),
  ('Minyak Kelapa', 'Coconut Oil', 'minyak-kelapa', 'Virgin coconut oil dan turunannya', '🫙', 2, TRUE),
  ('Arang & Briket', 'Charcoal & Briquettes', 'arang-briket', 'Briket dan arang kelapa ramah lingkungan', '🔥', 3, TRUE),
  ('Cocopeat & Media Tanam', 'Cocopeat & Growing Media', 'cocopeat', 'Cocopeat, coco coir, media tanam organik', '🌱', 4, TRUE),
  ('Kerajinan & Dekorasi', 'Crafts & Decoration', 'kerajinan', 'Produk kerajinan tangan dari tempurung kelapa', '🎨', 5, TRUE),
  ('Makanan & Minuman', 'Food & Beverage', 'makanan-minuman', 'Produk olahan pangan berbasis kelapa', '🍽️', 6, TRUE),
  ('Kosmetik & Perawatan', 'Cosmetics & Care', 'kosmetik', 'Produk kecantikan berbahan kelapa', '✨', 7, TRUE),
  ('Pupuk & Kompos', 'Fertilizer & Compost', 'pupuk', 'Pupuk organik dari limbah kelapa', '🌿', 8, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- ENVIRONMENTAL IMPACTS (initial values)
-- ============================================================

INSERT INTO environmental_impacts (total_waste_diverted, total_co2_saved, total_sellers, total_products, total_transactions, total_communities, monthly_growth)
VALUES (142500.0, 89320.0, 234, 1847, 12450, 18, 12.4)
ON CONFLICT DO NOTHING;
