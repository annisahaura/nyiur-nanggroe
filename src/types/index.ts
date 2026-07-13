// ============================================
// TIPE DATA APLIKASI NYIUR NANGGROE
// ============================================

export type UserRole = "user" | "seller" | "admin";
export type NotificationType = "marketplace" | "order" | "education" | "ai" | "announcement" | "system";
export type AIInteractionType = "chat" | "visual_search" | "recommendation";
export type ArticleCategory =
  | "coconut_products"
  | "circular_economy"
  | "farming_tips"
  | "business_guide"
  | "environment"
  | "technology";

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
  location: string | null;
  role: UserRole;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Store {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  location: string;
  province: string;
  city: string;
  is_verified: boolean;
  is_active: boolean;
  rating: number;
  total_sales: number;
  total_products: number;
  whatsapp: string | null;
  instagram: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  name_en: string;
  slug: string;
  description: string | null;
  icon: string;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
  product_count: number;
  is_active: boolean;
}

export interface Product {
  id: string;
  store_id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string | null;
  price: number;
  min_price: number | null;
  max_price: number | null;
  stock: number;
  min_order: number;
  unit: string;
  weight: number | null; // grams
  is_active: boolean;
  is_featured: boolean;
  is_eco_certified: boolean;
  tags: string[];
  rating: number;
  review_count: number;
  total_sold: number;
  co2_saved: number | null; // kg CO2 per unit
  waste_diverted: number | null; // kg per unit
  created_at: string;
  updated_at: string;
  // Joins
  store?: Store;
  category?: Category;
  images?: ProductImage[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
  is_primary: boolean;
}

export interface Order {
  id: string;
  buyer_id: string;
  store_id: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string | null;
  payment_token: string | null;
  subtotal: number;
  shipping_cost: number;
  platform_fee: number;
  total: number;
  notes: string | null;
  shipping_address: ShippingAddress;
  tracking_number: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "expired";

export interface ShippingAddress {
  full_name: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  subtotal: number;
  product?: Product;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  order_id: string;
  rating: number;
  comment: string | null;
  images: string[];
  is_verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  profile?: Profile;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

// ============================================
// EDUCATION TYPES
// ============================================

export interface Article {
  id: string;
  title: string;
  title_en: string | null;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  author_id: string;
  category: ArticleCategory;
  tags: string[];
  read_time: number; // minutes
  is_published: boolean;
  is_featured: boolean;
  view_count: number;
  published_at: string | null;
  created_at: string;
  author?: Profile;
}

// ============================================
// TIPE VIDEO EDUKASI
// ============================================

export interface EducationVideo {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  video_url: string;
  duration: number | null; // detik
  author_id: string | null;
  category: ArticleCategory;
  tags: string[];
  is_published: boolean;
  view_count: number;
  created_at: string;
  author?: Profile;
}

// ============================================
// TIPE HASIL KUIS
// ============================================

export interface QuizResult {
  id: string;
  quiz_id: string;
  user_id: string;
  score: number; // persentase
  passed: boolean;
  answers: number[];
  completed_at: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string | null;
  article_id: string | null;
  question_count: number;
  time_limit: number | null; // seconds
  pass_score: number; // percentage
  is_active: boolean;
  questions?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question: string;
  options: string[];
  correct_answer: number; // index
  explanation: string | null;
  sort_order: number;
}

// ============================================
// IMPACT TYPES
// ============================================

export interface ImpactMetrics {
  total_waste_diverted_kg: number;
  total_co2_saved_kg: number;
  total_sellers: number;
  total_products: number;
  total_transactions: number;
  total_communities: number;
  monthly_growth: number; // percentage
}

// ============================================
// AI TYPES
// ============================================

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}

// ============================================
// TIPE PESAN & PERCAKAPAN
// ============================================

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender?: Pick<Profile, "id" | "full_name" | "avatar_url">;
}

export interface Conversation {
  id: string;
  buyer_id: string;
  seller_id: string;
  product_id: string | null;
  last_message_at: string | null;
  created_at: string;
  unread_count?: number;
  buyer?: Pick<Profile, "id" | "full_name" | "avatar_url">;
  seller?: Pick<Profile, "id" | "full_name" | "avatar_url">;
  product?: Pick<Product, "id" | "name" | "slug"> & { images?: ProductImage[] };
}

// ============================================
// TIPE NOTIFIKASI
// ============================================

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, unknown>;
  is_read: boolean;
  action_url: string | null;
  created_at: string;
}

// ============================================
// TIPE LOG AI
// ============================================

export interface AILog {
  id: string;
  user_id: string | null;
  type: AIInteractionType;
  input: string | null;
  output: string | null;
  tokens_used: number | null;
  model: string | null;
  latency_ms: number | null;
  created_at: string;
}

export interface VisualSearchResult {
  detected_product: string;
  confidence: number;
  search_query: string;
  products: Product[];
}

// ============================================
// UI / COMPONENT TYPES
// ============================================

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface FilterOptions {
  category?: string;
  min_price?: number;
  max_price?: number;
  location?: string;
  is_eco_certified?: boolean;
  sort?: "relevance" | "newest" | "price_asc" | "price_desc" | "rating";
  page?: number;
  per_page?: number;
  query?: string;
}

export interface NavigationItem {
  label: string;
  label_id: string;
  href: string;
  icon?: string;
  badge?: string;
  children?: NavigationItem[];
}

export interface Breadcrumb {
  label: string;
  href: string;
}
