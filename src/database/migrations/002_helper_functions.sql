-- ============================================================
-- NYIUR NANGGROE — Migration 002
-- Helper Functions, Triggers, Storage Buckets, Seed Data
-- Run this in: Supabase SQL Editor (after 001_initial_schema.sql)
-- ============================================================

-- ============================================================
-- STOCK MANAGEMENT RPC
-- Called by order.repository.ts on checkout
-- ============================================================

CREATE OR REPLACE FUNCTION decrement_stock(product_id UUID, qty INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET stock = GREATEST(stock - qty, 0)
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- REVIEW HELPFUL COUNT RPC
-- Called by review.service.ts
-- ============================================================

CREATE OR REPLACE FUNCTION increment_review_helpful(rev_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE reviews
  SET helpful_count = helpful_count + 1
  WHERE id = rev_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- SELLER STATISTICS AUTO-UPDATE TRIGGER
-- Fires after an order status changes to 'delivered' or 'cancelled'
-- ============================================================

CREATE OR REPLACE FUNCTION update_seller_statistics_on_order()
RETURNS TRIGGER AS $$
DECLARE
  v_month TEXT;
  v_revenue NUMERIC;
BEGIN
  v_month := TO_CHAR(NOW(), 'YYYY-MM');

  -- Only act on meaningful status transitions
  IF NEW.status = OLD.status THEN
    RETURN NEW;
  END IF;

  -- On delivery: increment completed orders + revenue
  IF NEW.status = 'delivered' AND NEW.payment_status = 'paid' THEN
    INSERT INTO seller_statistics (store_id)
    VALUES (NEW.store_id)
    ON CONFLICT (store_id) DO NOTHING;

    SELECT total FROM orders WHERE id = NEW.id INTO v_revenue;

    UPDATE seller_statistics
    SET
      total_orders      = total_orders + 1,
      completed_orders  = completed_orders + 1,
      total_revenue     = total_revenue + COALESCE(v_revenue, 0),
      monthly_revenue   = jsonb_set(
        monthly_revenue,
        ARRAY[v_month],
        to_jsonb(COALESCE((monthly_revenue->>v_month)::NUMERIC, 0) + COALESCE(v_revenue, 0))
      ),
      monthly_orders    = jsonb_set(
        monthly_orders,
        ARRAY[v_month],
        to_jsonb(COALESCE((monthly_orders->>v_month)::INTEGER, 0) + 1)
      ),
      updated_at        = NOW()
    WHERE store_id = NEW.store_id;

    -- Update buyer's user statistics
    UPDATE user_statistics
    SET
      total_orders = total_orders + 1,
      total_spent  = total_spent + COALESCE(v_revenue, 0),
      updated_at   = NOW()
    WHERE user_id = NEW.buyer_id;

  -- On cancellation: increment cancelled orders
  ELSIF NEW.status = 'cancelled' THEN
    INSERT INTO seller_statistics (store_id)
    VALUES (NEW.store_id)
    ON CONFLICT (store_id) DO NOTHING;

    UPDATE seller_statistics
    SET
      cancelled_orders = cancelled_orders + 1,
      updated_at       = NOW()
    WHERE store_id = NEW.store_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_update_seller_stats
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_seller_statistics_on_order();

-- ============================================================
-- UNIQUE CUSTOMER COUNT TRIGGER FOR SELLER STATS
-- Fires after new order is created (pending status)
-- ============================================================

CREATE OR REPLACE FUNCTION update_seller_customer_count()
RETURNS TRIGGER AS $$
DECLARE
  v_is_new_customer BOOLEAN;
BEGIN
  -- Check if this buyer has placed an order with this store before
  SELECT NOT EXISTS (
    SELECT 1 FROM orders
    WHERE store_id = NEW.store_id
      AND buyer_id = NEW.buyer_id
      AND id <> NEW.id
  ) INTO v_is_new_customer;

  IF v_is_new_customer THEN
    INSERT INTO seller_statistics (store_id)
    VALUES (NEW.store_id)
    ON CONFLICT (store_id) DO NOTHING;

    UPDATE seller_statistics
    SET total_customers = total_customers + 1,
        updated_at = NOW()
    WHERE store_id = NEW.store_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_seller_customer_count
  AFTER INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION update_seller_customer_count();

-- ============================================================
-- SELLER RATING AUTO-UPDATE
-- Fires when reviews are added/updated/deleted
-- ============================================================

CREATE OR REPLACE FUNCTION update_seller_rating()
RETURNS TRIGGER AS $$
DECLARE
  v_store_id UUID;
BEGIN
  -- Get the store for this product
  SELECT store_id INTO v_store_id
  FROM products
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);

  IF v_store_id IS NOT NULL THEN
    UPDATE seller_statistics
    SET
      avg_rating   = (
        SELECT COALESCE(AVG(r.rating), 0)
        FROM reviews r
        JOIN products p ON r.product_id = p.id
        WHERE p.store_id = v_store_id
      ),
      total_reviews = (
        SELECT COUNT(*)
        FROM reviews r
        JOIN products p ON r.product_id = p.id
        WHERE p.store_id = v_store_id
      ),
      updated_at = NOW()
    WHERE store_id = v_store_id;

    -- Also update seller_profiles rating
    UPDATE seller_profiles
    SET rating = (
      SELECT COALESCE(AVG(r.rating), 0)
      FROM reviews r
      JOIN products p ON r.product_id = p.id
      WHERE p.store_id = v_store_id
    )
    WHERE id = v_store_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_update_seller_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_seller_rating();

-- ============================================================
-- CATEGORY PRODUCT COUNT TRIGGER
-- Keeps categories.product_count accurate
-- ============================================================

CREATE OR REPLACE FUNCTION update_category_product_count()
RETURNS TRIGGER AS $$
DECLARE
  v_category_id UUID;
BEGIN
  v_category_id := COALESCE(NEW.category_id, OLD.category_id);

  IF v_category_id IS NOT NULL THEN
    UPDATE categories
    SET product_count = (
      SELECT COUNT(*)
      FROM products
      WHERE category_id = v_category_id
        AND is_active = TRUE
        AND deleted_at IS NULL
    )
    WHERE id = v_category_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_category_product_count
  AFTER INSERT OR UPDATE OR DELETE ON products
  FOR EACH ROW EXECUTE FUNCTION update_category_product_count();

-- ============================================================
-- SELLER TOTAL PRODUCTS COUNTER
-- ============================================================

CREATE OR REPLACE FUNCTION update_seller_total_products()
RETURNS TRIGGER AS $$
DECLARE
  v_store_id UUID;
BEGIN
  v_store_id := COALESCE(NEW.store_id, OLD.store_id);

  UPDATE seller_profiles
  SET total_products = (
    SELECT COUNT(*) FROM products
    WHERE store_id = v_store_id
      AND is_active = TRUE
      AND deleted_at IS NULL
  )
  WHERE id = v_store_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_seller_total_products
  AFTER INSERT OR UPDATE OR DELETE ON products
  FOR EACH ROW EXECUTE FUNCTION update_seller_total_products();

-- ============================================================
-- TOTAL SOLD UPDATE ON ORDER DELIVERY
-- ============================================================

CREATE OR REPLACE FUNCTION update_product_total_sold()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'delivered' AND OLD.status <> 'delivered' THEN
    UPDATE products p
    SET total_sold = total_sold + oi.quantity
    FROM order_items oi
    WHERE oi.order_id = NEW.id
      AND oi.product_id = p.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_update_product_total_sold
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_product_total_sold();

-- ============================================================
-- USER CO2 SAVINGS ACCUMULATOR
-- ============================================================

CREATE OR REPLACE FUNCTION update_user_co2_savings()
RETURNS TRIGGER AS $$
DECLARE
  v_co2_saved NUMERIC;
BEGIN
  IF NEW.status = 'delivered' AND OLD.status <> 'delivered' THEN
    SELECT COALESCE(SUM(p.co2_saved * oi.quantity), 0)
    INTO v_co2_saved
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = NEW.id;

    UPDATE user_statistics
    SET co2_saved_kg = co2_saved_kg + v_co2_saved,
        updated_at   = NOW()
    WHERE user_id = NEW.buyer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_user_co2_savings
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_user_co2_savings();

-- ============================================================
-- ARTICLE VIEW COUNT FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION increment_article_view(article_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE education_articles
  SET view_count = view_count + 1
  WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- VIDEO VIEW COUNT FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION increment_video_view(video_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE education_videos
  SET view_count = view_count + 1
  WHERE id = video_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- USER STATISTICS — QUIZ PASS UPDATE
-- ============================================================

CREATE OR REPLACE FUNCTION update_user_quiz_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.passed = TRUE THEN
    UPDATE user_statistics
    SET quizzes_passed = quizzes_passed + 1,
        updated_at = NOW()
    WHERE user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_user_quiz_stats
  AFTER INSERT ON quiz_results
  FOR EACH ROW EXECUTE FUNCTION update_user_quiz_stats();

-- ============================================================
-- ENVIRONMENTAL IMPACT RECALCULATION FUNCTION
-- Called via /api/impact/recalculate (admin-only)
-- ============================================================

CREATE OR REPLACE FUNCTION recalculate_environmental_impact()
RETURNS VOID AS $$
DECLARE
  v_total_co2      NUMERIC;
  v_total_waste    NUMERIC;
  v_total_sellers  INTEGER;
  v_total_products INTEGER;
  v_total_txns     INTEGER;
BEGIN
  -- Total CO2 saved across all completed orders
  SELECT COALESCE(SUM(p.co2_saved * oi.quantity), 0)
  INTO v_total_co2
  FROM order_items oi
  JOIN products p ON oi.product_id = p.id
  JOIN orders o ON oi.order_id = o.id
  WHERE o.status = 'delivered';

  -- Total waste diverted
  SELECT COALESCE(SUM(p.waste_diverted * oi.quantity), 0)
  INTO v_total_waste
  FROM order_items oi
  JOIN products p ON oi.product_id = p.id
  JOIN orders o ON oi.order_id = o.id
  WHERE o.status = 'delivered';

  -- Active sellers
  SELECT COUNT(*) INTO v_total_sellers
  FROM seller_profiles WHERE is_active = TRUE;

  -- Active products
  SELECT COUNT(*) INTO v_total_products
  FROM products WHERE is_active = TRUE AND deleted_at IS NULL;

  -- Total completed transactions
  SELECT COUNT(*) INTO v_total_txns
  FROM orders WHERE status = 'delivered';

  UPDATE environmental_impacts
  SET
    total_co2_saved       = v_total_co2,
    total_waste_diverted  = v_total_waste,
    total_sellers         = v_total_sellers,
    total_products        = v_total_products,
    total_transactions    = v_total_txns,
    updated_at            = NOW()
  WHERE id = (SELECT id FROM environmental_impacts LIMIT 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- CONVERSATIONS last_message_at UPDATE TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET last_message_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_conversation_last_message
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();

-- ============================================================
-- STORAGE BUCKETS
-- Uncomment and run these manually if not created via dashboard
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars',        'avatars',        true, 5242880,  ARRAY['image/jpeg','image/png','image/webp']),
  ('store-logos',    'store-logos',    true, 5242880,  ARRAY['image/jpeg','image/png','image/webp']),
  ('store-banners',  'store-banners',  true, 10485760, ARRAY['image/jpeg','image/png','image/webp']),
  ('product-images', 'product-images', true, 10485760, ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('review-images',  'review-images',  true, 5242760,  ARRAY['image/jpeg','image/png','image/webp']),
  ('education',      'education',      true, 52428800, ARRAY['image/jpeg','image/png','image/webp','video/mp4','application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "avatars_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "avatars_auth_upload" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND auth.uid()::TEXT = (storage.foldername(name))[1]
);

CREATE POLICY "store_logos_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'store-logos');
CREATE POLICY "store_logos_seller_write" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'store-logos' AND auth.role() = 'authenticated');

CREATE POLICY "store_banners_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'store-banners');
CREATE POLICY "store_banners_seller_write" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'store-banners' AND auth.role() = 'authenticated');

CREATE POLICY "product_images_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "product_images_seller_write" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "review_images_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'review-images');
CREATE POLICY "review_images_auth_write" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'review-images' AND auth.role() = 'authenticated');

CREATE POLICY "education_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'education');
CREATE POLICY "education_admin_write" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'education' AND get_user_role(auth.uid()) = 'admin'
);

-- ============================================================
-- DATABASE INDEXES — Additional Performance
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_last_msg ON conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_status ON orders(buyer_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_store_status ON orders(store_id, status);
CREATE INDEX IF NOT EXISTS idx_edu_articles_featured ON education_articles(is_featured, is_published) WHERE is_featured = TRUE AND is_published = TRUE;
CREATE INDEX IF NOT EXISTS idx_edu_articles_tags ON education_articles USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_edu_videos_category ON education_videos(category);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_passed ON quiz_results(user_id, passed);
CREATE INDEX IF NOT EXISTS idx_seller_stats_revenue ON seller_statistics(total_revenue DESC);
CREATE INDEX IF NOT EXISTS idx_wishlist_user_created ON wishlists(user_id, created_at DESC);

-- ============================================================
-- SEED DATA — Categories (10 Coconut Product Categories)
-- ============================================================

INSERT INTO categories (name, name_en, slug, description, icon, sort_order, is_active) VALUES
  ('Produk Kelapa Segar',  'Fresh Coconut Products',    'produk-kelapa-segar',   'Kelapa segar, air kelapa, daging kelapa muda dan tua',                            '🥥', 1,  true),
  ('Minyak Kelapa',        'Coconut Oil',               'minyak-kelapa',         'VCO (Virgin Coconut Oil), minyak goreng kelapa, minyak kelapa murni',              '🫙', 2,  true),
  ('Arang & Briket',       'Charcoal & Briquettes',     'arang-briket',          'Arang tempurung kelapa, briket kelapa, arang aktif',                              '🔥', 3,  true),
  ('Sabut & Cocofiber',    'Coco Fiber & Peat',         'sabut-cocofiber',       'Sabut kelapa, cocofiber, cocopeat, coir untuk pertanian dan hortikultura',        '🌱', 4,  true),
  ('Gula & Nira Kelapa',   'Coconut Sugar & Sap',       'gula-nira-kelapa',      'Gula kelapa, gula semut, nira kelapa, tuak kelapa',                               '🍯', 5,  true),
  ('Kerajinan Tempurung',  'Shell Crafts',              'kerajinan-tempurung',   'Perkakas, aksesoris, dekorasi, dan kerajinan dari tempurung kelapa',              '🎭', 6,  true),
  ('Santan & Olahan',      'Coconut Milk & Processed',  'santan-olahan',         'Santan kelapa, tepung kelapa, krim kelapa, selai kelapa',                        '🥛', 7,  true),
  ('Produk Perawatan',     'Coconut Care Products',     'produk-perawatan',      'Kosmetik, sabun, sampo, lotion berbahan dasar kelapa',                           '💆', 8,  true),
  ('Minuman Kelapa',       'Coconut Beverages',         'minuman-kelapa',        'Air kelapa kemasan, minuman kelapa fermentasi, kopi kelapa, smoothie kelapa',    '🥤', 9,  true),
  ('Pakan & Pertanian',    'Feed & Agriculture',        'pakan-pertanian',       'Pakan ternak dari kelapa, pupuk organik, media tanam berbahan kelapa',           '🌾', 10, true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- GRANT EXECUTE PERMISSIONS on helper functions
-- ============================================================

GRANT EXECUTE ON FUNCTION decrement_stock(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_review_helpful(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_article_view(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_video_view(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION recalculate_environmental_impact() TO authenticated;
