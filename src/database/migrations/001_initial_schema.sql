-- ============================================================
-- NYIUR NANGGROE — PostgreSQL Schema
-- Migration: 001_initial_schema.sql
-- Run this in: Supabase SQL Editor
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('user', 'seller', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded', 'expired');
CREATE TYPE payment_method AS ENUM ('dummy', 'qris', 'midtrans', 'xendit', 'bank_transfer', 'e_wallet');
CREATE TYPE notification_type AS ENUM ('marketplace', 'order', 'education', 'ai', 'announcement', 'system');
CREATE TYPE article_category AS ENUM ('coconut_products', 'circular_economy', 'farming_tips', 'business_guide', 'environment', 'technology');

-- ============================================================
-- PROFILES
-- Extends auth.users — created via trigger on signup
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT NOT NULL,
  username      TEXT UNIQUE,
  avatar_url    TEXT,
  bio           TEXT,
  phone         TEXT,
  location      TEXT,
  province      TEXT,
  city          TEXT,
  country       TEXT DEFAULT 'Indonesia',
  role          user_role NOT NULL DEFAULT 'user',
  is_verified   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_username ON profiles(username);

-- ============================================================
-- SELLER PROFILES (stores)
-- ============================================================

CREATE TABLE IF NOT EXISTS seller_profiles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id        UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  description     TEXT,
  logo_url        TEXT,
  banner_url      TEXT,
  location        TEXT,
  province        TEXT,
  city            TEXT,
  is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  rating          NUMERIC(3,2) NOT NULL DEFAULT 0,
  total_sales     INTEGER NOT NULL DEFAULT 0,
  total_products  INTEGER NOT NULL DEFAULT 0,
  whatsapp        TEXT,
  instagram       TEXT,
  website         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_seller_profiles_owner_id ON seller_profiles(owner_id);
CREATE INDEX idx_seller_profiles_slug ON seller_profiles(slug);
CREATE INDEX idx_seller_profiles_province ON seller_profiles(province);

-- ============================================================
-- CATEGORIES
-- ============================================================

CREATE TABLE IF NOT EXISTS categories (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  name_en       TEXT,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  icon          TEXT,
  image_url     TEXT,
  parent_id     UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  product_count INTEGER NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);

-- ============================================================
-- PRODUCTS
-- ============================================================

CREATE TABLE IF NOT EXISTS products (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id            UUID NOT NULL REFERENCES seller_profiles(id) ON DELETE CASCADE,
  category_id         UUID REFERENCES categories(id) ON DELETE SET NULL,
  name                TEXT NOT NULL,
  slug                TEXT NOT NULL UNIQUE,
  description         TEXT NOT NULL,
  short_description   TEXT,
  price               NUMERIC(15,2) NOT NULL CHECK (price >= 0),
  min_price           NUMERIC(15,2),
  max_price           NUMERIC(15,2),
  stock               INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  min_order           INTEGER NOT NULL DEFAULT 1,
  unit                TEXT NOT NULL DEFAULT 'pcs',
  weight              INTEGER,              -- grams
  length              NUMERIC(10,2),        -- cm
  width               NUMERIC(10,2),        -- cm
  height              NUMERIC(10,2),        -- cm
  location            TEXT,
  province            TEXT,
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured         BOOLEAN NOT NULL DEFAULT FALSE,
  is_eco_certified    BOOLEAN NOT NULL DEFAULT FALSE,
  tags                TEXT[] DEFAULT '{}',
  rating              NUMERIC(3,2) NOT NULL DEFAULT 0,
  review_count        INTEGER NOT NULL DEFAULT 0,
  total_sold          INTEGER NOT NULL DEFAULT 0,
  co2_saved           NUMERIC(10,3),        -- kg CO2 per unit
  waste_diverted      NUMERIC(10,3),        -- kg per unit
  search_vector       TSVECTOR,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at          TIMESTAMPTZ           -- soft delete
);

CREATE INDEX idx_products_store_id ON products(store_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_is_active ON products(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_products_is_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_rating ON products(rating DESC);
CREATE INDEX idx_products_province ON products(province);
CREATE INDEX idx_products_search ON products USING GIN(search_vector);
CREATE INDEX idx_products_tags ON products USING GIN(tags);
CREATE INDEX idx_products_deleted_at ON products(deleted_at) WHERE deleted_at IS NULL;

-- ============================================================
-- PRODUCT IMAGES
-- ============================================================

CREATE TABLE IF NOT EXISTS product_images (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  alt         TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_primary  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_images_product_id ON product_images(product_id);

-- ============================================================
-- CARTS
-- ============================================================

CREATE TABLE IF NOT EXISTS carts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_carts_user_id ON carts(user_id);

-- ============================================================
-- CART ITEMS
-- ============================================================

CREATE TABLE IF NOT EXISTS cart_items (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id         UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity        INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  price_snapshot  NUMERIC(15,2) NOT NULL,  -- price at time of adding
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(cart_id, product_id)
);

CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);

-- ============================================================
-- WISHLISTS
-- ============================================================

CREATE TABLE IF NOT EXISTS wishlists (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX idx_wishlists_product_id ON wishlists(product_id);

-- ============================================================
-- ORDERS
-- ============================================================

CREATE TABLE IF NOT EXISTS orders (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number      TEXT NOT NULL UNIQUE,
  buyer_id          UUID NOT NULL REFERENCES auth.users(id),
  store_id          UUID NOT NULL REFERENCES seller_profiles(id),
  status            order_status NOT NULL DEFAULT 'pending',
  payment_status    payment_status NOT NULL DEFAULT 'pending',
  payment_method    payment_method,
  subtotal          NUMERIC(15,2) NOT NULL CHECK (subtotal >= 0),
  shipping_cost     NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (shipping_cost >= 0),
  platform_fee      NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (platform_fee >= 0),
  total             NUMERIC(15,2) NOT NULL CHECK (total >= 0),
  notes             TEXT,
  shipping_address  JSONB NOT NULL,         -- { full_name, phone, address, city, province, postal_code }
  tracking_number   TEXT,
  cancelled_reason  TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_store_id ON orders(store_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- ============================================================
-- ORDER ITEMS
-- ============================================================

CREATE TABLE IF NOT EXISTS order_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id),
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  price       NUMERIC(15,2) NOT NULL CHECK (price >= 0),
  subtotal    NUMERIC(15,2) NOT NULL CHECK (subtotal >= 0),
  product_snapshot JSONB,                  -- product name, image at time of order
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- ============================================================
-- PAYMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS payments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  method          payment_method NOT NULL DEFAULT 'dummy',
  status          payment_status NOT NULL DEFAULT 'pending',
  amount          NUMERIC(15,2) NOT NULL,
  token           TEXT,                    -- gateway token/URL
  gateway_ref     TEXT,                    -- gateway transaction ID
  gateway_payload JSONB,                   -- raw gateway response
  paid_at         TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_gateway_ref ON payments(gateway_ref);

-- ============================================================
-- REVIEWS
-- ============================================================

CREATE TABLE IF NOT EXISTS reviews (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id            UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id               UUID NOT NULL REFERENCES auth.users(id),
  order_id              UUID REFERENCES orders(id),
  rating                INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment               TEXT,
  is_verified_purchase  BOOLEAN NOT NULL DEFAULT FALSE,
  helpful_count         INTEGER NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, user_id, order_id)
);

CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- ============================================================
-- REVIEW IMAGES
-- ============================================================

CREATE TABLE IF NOT EXISTS review_images (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id   UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_review_images_review_id ON review_images(review_id);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type        notification_type NOT NULL DEFAULT 'system',
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  data        JSONB DEFAULT '{}',          -- arbitrary payload (order_id, product_id etc)
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  action_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================================
-- MESSAGES & CONVERSATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS conversations (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id    UUID NOT NULL REFERENCES auth.users(id),
  seller_id   UUID NOT NULL REFERENCES auth.users(id),
  product_id  UUID REFERENCES products(id) ON DELETE SET NULL,
  last_message_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(buyer_id, seller_id, product_id)
);

CREATE INDEX idx_conversations_buyer_id ON conversations(buyer_id);
CREATE INDEX idx_conversations_seller_id ON conversations(seller_id);

CREATE TABLE IF NOT EXISTS messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES auth.users(id),
  content         TEXT NOT NULL,
  is_read         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);

-- ============================================================
-- EDUCATION — ARTICLES
-- ============================================================

CREATE TABLE IF NOT EXISTS education_articles (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  title_en      TEXT,
  slug          TEXT NOT NULL UNIQUE,
  excerpt       TEXT,
  content       TEXT NOT NULL,
  cover_image   TEXT,
  author_id     UUID REFERENCES auth.users(id),
  category      article_category NOT NULL DEFAULT 'coconut_products',
  tags          TEXT[] DEFAULT '{}',
  read_time     INTEGER NOT NULL DEFAULT 5,   -- minutes
  is_published  BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured   BOOLEAN NOT NULL DEFAULT FALSE,
  view_count    INTEGER NOT NULL DEFAULT 0,
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_edu_articles_slug ON education_articles(slug);
CREATE INDEX idx_edu_articles_category ON education_articles(category);
CREATE INDEX idx_edu_articles_is_published ON education_articles(is_published) WHERE is_published = TRUE;

-- ============================================================
-- EDUCATION — VIDEOS
-- ============================================================

CREATE TABLE IF NOT EXISTS education_videos (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  thumbnail_url TEXT,
  video_url     TEXT NOT NULL,
  duration      INTEGER,                    -- seconds
  author_id     UUID REFERENCES auth.users(id),
  category      article_category NOT NULL DEFAULT 'coconut_products',
  tags          TEXT[] DEFAULT '{}',
  is_published  BOOLEAN NOT NULL DEFAULT FALSE,
  view_count    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- QUIZZES
-- ============================================================

CREATE TABLE IF NOT EXISTS quizzes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  description     TEXT,
  article_id      UUID REFERENCES education_articles(id) ON DELETE SET NULL,
  question_count  INTEGER NOT NULL DEFAULT 0,
  time_limit      INTEGER,                  -- seconds, null = no limit
  pass_score      INTEGER NOT NULL DEFAULT 70,  -- percentage
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id         UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question        TEXT NOT NULL,
  options         JSONB NOT NULL,            -- ["A", "B", "C", "D"]
  correct_answer  INTEGER NOT NULL,          -- index of correct option
  explanation     TEXT,
  sort_order      INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);

CREATE TABLE IF NOT EXISTS quiz_results (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id     UUID NOT NULL REFERENCES quizzes(id),
  user_id     UUID NOT NULL REFERENCES auth.users(id),
  score       INTEGER NOT NULL,              -- percentage
  passed      BOOLEAN NOT NULL DEFAULT FALSE,
  answers     JSONB,                         -- user's answers
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(quiz_id, user_id)
);

CREATE INDEX idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX idx_quiz_results_quiz_id ON quiz_results(quiz_id);

-- ============================================================
-- AI LOGS
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_logs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES auth.users(id),
  type          TEXT NOT NULL,               -- 'chat', 'visual_search', 'recommendation'
  input         TEXT,
  output        TEXT,
  tokens_used   INTEGER,
  model         TEXT,
  latency_ms    INTEGER,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_logs_user_id ON ai_logs(user_id);
CREATE INDEX idx_ai_logs_type ON ai_logs(type);
CREATE INDEX idx_ai_logs_created_at ON ai_logs(created_at DESC);

-- ============================================================
-- ENVIRONMENTAL IMPACTS (platform-wide, updated by cron)
-- ============================================================

CREATE TABLE IF NOT EXISTS environmental_impacts (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  total_waste_diverted  NUMERIC(15,3) NOT NULL DEFAULT 0,  -- kg
  total_co2_saved       NUMERIC(15,3) NOT NULL DEFAULT 0,  -- kg
  total_sellers         INTEGER NOT NULL DEFAULT 0,
  total_products        INTEGER NOT NULL DEFAULT 0,
  total_transactions    INTEGER NOT NULL DEFAULT 0,
  total_communities     INTEGER NOT NULL DEFAULT 0,
  monthly_growth        NUMERIC(5,2) NOT NULL DEFAULT 0,   -- percentage
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert initial row
INSERT INTO environmental_impacts DEFAULT VALUES;

-- ============================================================
-- SELLER STATISTICS (denormalized, updated via trigger)
-- ============================================================

CREATE TABLE IF NOT EXISTS seller_statistics (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id            UUID NOT NULL UNIQUE REFERENCES seller_profiles(id) ON DELETE CASCADE,
  total_revenue       NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_orders        INTEGER NOT NULL DEFAULT 0,
  completed_orders    INTEGER NOT NULL DEFAULT 0,
  cancelled_orders    INTEGER NOT NULL DEFAULT 0,
  total_customers     INTEGER NOT NULL DEFAULT 0,
  avg_rating          NUMERIC(3,2) NOT NULL DEFAULT 0,
  total_reviews       INTEGER NOT NULL DEFAULT 0,
  monthly_revenue     JSONB DEFAULT '{}',    -- { "2026-01": 1500000, ... }
  monthly_orders      JSONB DEFAULT '{}',
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_seller_stats_store_id ON seller_statistics(store_id);

-- ============================================================
-- USER STATISTICS (denormalized)
-- ============================================================

CREATE TABLE IF NOT EXISTS user_statistics (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  total_orders    INTEGER NOT NULL DEFAULT 0,
  total_spent     NUMERIC(15,2) NOT NULL DEFAULT 0,
  co2_saved_kg    NUMERIC(10,3) NOT NULL DEFAULT 0,
  articles_read   INTEGER NOT NULL DEFAULT 0,
  quizzes_passed  INTEGER NOT NULL DEFAULT 0,
  wishlist_count  INTEGER NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_stats_user_id ON user_statistics(user_id);

-- ============================================================
-- ARTICLE BOOKMARKS (education)
-- ============================================================

CREATE TABLE IF NOT EXISTS article_bookmarks (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id  UUID NOT NULL REFERENCES education_articles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_seller_profiles_updated_at BEFORE UPDATE ON seller_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_carts_updated_at BEFORE UPDATE ON carts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on auth.users insert
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    'user'
  );
  INSERT INTO carts (user_id) VALUES (NEW.id);
  INSERT INTO user_statistics (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update product search vector
CREATE OR REPLACE FUNCTION update_product_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector = to_tsvector('indonesian',
    COALESCE(NEW.name, '') || ' ' ||
    COALESCE(NEW.short_description, '') || ' ' ||
    COALESCE(array_to_string(NEW.tags, ' '), '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_product_search_vector
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_product_search_vector();

-- Auto-update product rating when review added/updated
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products SET
    rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)),
    review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = COALESCE(NEW.product_id, OLD.product_id))
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_review_update_product_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- Auto-generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number = 'NN-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(LEFT(NEW.id::TEXT, 8));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE environmental_impacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_statistics ENABLE ROW LEVEL SECURITY;

-- Helper: get user role from profiles
CREATE OR REPLACE FUNCTION get_user_role(uid UUID)
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE user_id = uid;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- ---- PROFILES ----
CREATE POLICY "profiles_select_all" ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- ---- SELLER PROFILES ----
CREATE POLICY "seller_profiles_select_all" ON seller_profiles FOR SELECT USING (TRUE);
CREATE POLICY "seller_profiles_insert_own" ON seller_profiles FOR INSERT WITH CHECK (
  owner_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
);
CREATE POLICY "seller_profiles_update_own" ON seller_profiles FOR UPDATE USING (
  owner_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
);

-- ---- CATEGORIES ----
CREATE POLICY "categories_select_all" ON categories FOR SELECT USING (TRUE);
CREATE POLICY "categories_admin_write" ON categories FOR ALL USING (
  get_user_role(auth.uid()) = 'admin'
);

-- ---- PRODUCTS ----
CREATE POLICY "products_select_active" ON products FOR SELECT USING (is_active = TRUE AND deleted_at IS NULL);
CREATE POLICY "products_seller_insert" ON products FOR INSERT WITH CHECK (
  store_id IN (SELECT id FROM seller_profiles WHERE owner_id = (SELECT id FROM profiles WHERE user_id = auth.uid()))
);
CREATE POLICY "products_seller_update" ON products FOR UPDATE USING (
  store_id IN (SELECT id FROM seller_profiles WHERE owner_id = (SELECT id FROM profiles WHERE user_id = auth.uid()))
);
CREATE POLICY "products_admin_all" ON products FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- ---- PRODUCT IMAGES ----
CREATE POLICY "product_images_select_all" ON product_images FOR SELECT USING (TRUE);
CREATE POLICY "product_images_seller_write" ON product_images FOR ALL USING (
  product_id IN (
    SELECT p.id FROM products p
    JOIN seller_profiles sp ON p.store_id = sp.id
    JOIN profiles pr ON sp.owner_id = pr.id
    WHERE pr.user_id = auth.uid()
  )
);

-- ---- CARTS ----
CREATE POLICY "carts_own" ON carts FOR ALL USING (user_id = auth.uid());

-- ---- CART ITEMS ----
CREATE POLICY "cart_items_own" ON cart_items FOR ALL USING (
  cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid())
);

-- ---- WISHLISTS ----
CREATE POLICY "wishlists_own" ON wishlists FOR ALL USING (user_id = auth.uid());

-- ---- ORDERS ----
CREATE POLICY "orders_buyer_select" ON orders FOR SELECT USING (buyer_id = auth.uid());
CREATE POLICY "orders_buyer_insert" ON orders FOR INSERT WITH CHECK (buyer_id = auth.uid());
CREATE POLICY "orders_seller_select" ON orders FOR SELECT USING (
  store_id IN (SELECT id FROM seller_profiles WHERE owner_id = (SELECT id FROM profiles WHERE user_id = auth.uid()))
);
CREATE POLICY "orders_seller_update" ON orders FOR UPDATE USING (
  store_id IN (SELECT id FROM seller_profiles WHERE owner_id = (SELECT id FROM profiles WHERE user_id = auth.uid()))
);
CREATE POLICY "orders_admin_all" ON orders FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- ---- ORDER ITEMS ----
CREATE POLICY "order_items_own" ON order_items FOR SELECT USING (
  order_id IN (SELECT id FROM orders WHERE buyer_id = auth.uid())
  OR order_id IN (SELECT o.id FROM orders o JOIN seller_profiles sp ON o.store_id = sp.id JOIN profiles p ON sp.owner_id = p.id WHERE p.user_id = auth.uid())
);
CREATE POLICY "order_items_insert" ON order_items FOR INSERT WITH CHECK (
  order_id IN (SELECT id FROM orders WHERE buyer_id = auth.uid())
);

-- ---- PAYMENTS ----
CREATE POLICY "payments_own" ON payments FOR SELECT USING (
  order_id IN (SELECT id FROM orders WHERE buyer_id = auth.uid())
);
CREATE POLICY "payments_admin_all" ON payments FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- ---- REVIEWS ----
CREATE POLICY "reviews_select_all" ON reviews FOR SELECT USING (TRUE);
CREATE POLICY "reviews_own_insert" ON reviews FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "reviews_own_update" ON reviews FOR UPDATE USING (user_id = auth.uid());

-- ---- REVIEW IMAGES ----
CREATE POLICY "review_images_select_all" ON review_images FOR SELECT USING (TRUE);
CREATE POLICY "review_images_own_write" ON review_images FOR ALL USING (
  review_id IN (SELECT id FROM reviews WHERE user_id = auth.uid())
);

-- ---- NOTIFICATIONS ----
CREATE POLICY "notifications_own" ON notifications FOR ALL USING (user_id = auth.uid());

-- ---- CONVERSATIONS ----
CREATE POLICY "conversations_own" ON conversations FOR ALL USING (
  buyer_id = auth.uid() OR seller_id = auth.uid()
);

-- ---- MESSAGES ----
CREATE POLICY "messages_own" ON messages FOR ALL USING (
  conversation_id IN (
    SELECT id FROM conversations WHERE buyer_id = auth.uid() OR seller_id = auth.uid()
  )
);

-- ---- EDUCATION ----
CREATE POLICY "edu_articles_published" ON education_articles FOR SELECT USING (is_published = TRUE);
CREATE POLICY "edu_articles_admin_all" ON education_articles FOR ALL USING (get_user_role(auth.uid()) = 'admin');
CREATE POLICY "edu_videos_published" ON education_videos FOR SELECT USING (is_published = TRUE);
CREATE POLICY "edu_videos_admin_all" ON education_videos FOR ALL USING (get_user_role(auth.uid()) = 'admin');
CREATE POLICY "quizzes_active" ON quizzes FOR SELECT USING (is_active = TRUE);
CREATE POLICY "quiz_questions_select" ON quiz_questions FOR SELECT USING (TRUE);
CREATE POLICY "quiz_results_own" ON quiz_results FOR ALL USING (user_id = auth.uid());
CREATE POLICY "bookmarks_own" ON article_bookmarks FOR ALL USING (user_id = auth.uid());

-- ---- AI LOGS ----
CREATE POLICY "ai_logs_own" ON ai_logs FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "ai_logs_insert" ON ai_logs FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- ---- IMPACT (public read) ----
CREATE POLICY "impact_public_read" ON environmental_impacts FOR SELECT USING (TRUE);
CREATE POLICY "impact_admin_write" ON environmental_impacts FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- ---- STATISTICS ----
CREATE POLICY "seller_stats_own" ON seller_statistics FOR SELECT USING (
  store_id IN (SELECT id FROM seller_profiles WHERE owner_id = (SELECT id FROM profiles WHERE user_id = auth.uid()))
);
CREATE POLICY "seller_stats_admin" ON seller_statistics FOR ALL USING (get_user_role(auth.uid()) = 'admin');
CREATE POLICY "user_stats_own" ON user_statistics FOR SELECT USING (user_id = auth.uid());

-- ============================================================
-- STORAGE BUCKETS (run separately or via Supabase dashboard)
-- ============================================================

-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('store-logos', 'store-logos', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('store-banners', 'store-banners', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('review-images', 'review-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('education', 'education', true);
