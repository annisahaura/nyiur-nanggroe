import type { Category, Product, Store, Review, ProductImage } from "@/types";

// ============================================
// STATIC PRODUCT IMAGE REGISTRY
// ------------------------------------------------
// Menggunakan Wikimedia Commons — gambar 100% terverifikasi,
// statis, permanent, tidak memerlukan API key, tidak pernah
// berubah saat refresh. URL langsung ke file asli.
// ============================================




const PRODUCT_IMAGES: Record<string, string[]> = {
  // ── BRIKET & ARANG ─────────────────────────────────────────────
  "briket-kelapa-premium-hexagon": [
    "/images/product-briket.png",
  ],
  "briket-kelapa-cube-bbq": [
    "/images/product-briket.png",
  ],
  "arang-kelapa-hookah-grade": [
    "/images/product-arang-shisha.png",
  ],
  "briket-kelapa-lonjong-3kg": [
    "/images/product-briket.png",
  ],
  "arang-aktif-premium-400-mesh": [
    "/images/product-arang-aktif.png",
  ],
  "arang-kelapa-industri-25kg": [
    "/images/product-arang-industri.png",
  ],

  // ── TEMPURUNG KELAPA ───────────────────────────────────────────
  "tepung-tempurung-kelapa": [
    "/images/product-tepung-tempurung.png",
  ],
  "tempurung-kelapa-asap-cair": [
    "/images/product-asap-cair.png",
  ],
  "tempurung-kelapa-asah-bahan-baku": [
    "/images/product-tempurung-asah.png",
  ],

  // ── COCOPEAT & SABUT ───────────────────────────────────────────
  "cocopeat-premium-organik-50l": [
    "/images/product-cocopeat.png",
  ],
  "cocopeat-brick-compresed": [
    "/images/product-cocopeat.png",
  ],
  "sabut-kelapa-anyaman-premium": [
    "/images/product-keset.png",
  ],
  "cocopeat-siap-tanam-10kg": [
    "/images/product-cocopeat.png",
  ],
  "sabut-kelapa-cocofiber-roll": [
    "/images/product-cocofiber-roll.png",
  ],
  "sabut-kelapa-curah-100kg": [
    "/images/product-sabut-curah.png",
  ],

  // ── MINYAK KELAPA / VCO ────────────────────────────────────────
  "vco-murni-cold-pressed-500ml": [
    "/images/product-vco.png",
  ],
  "vco-kapsul-softgel-100caps": [
    "/images/product-vco-kapsul.png",
  ],
  "minyak-kelapa-goreng-tradisional": [
    "/images/product-minyak-goreng.png",
  ],
  "vco-murni-1-liter": [
    "/images/product-vco.png",
  ],

  // ── KERAJINAN TEMPURUNG ────────────────────────────────────────
  "mangkok-tempurung-ukir-handmade": [
    "/images/product-mangkuk.png",
  ],
  "mangkok-set-tempurung-premium": [
    "/images/product-mangkuk.png",
  ],
  "kerajinan-frame-foto-tempurung": [
    "/images/product-frame-foto.png",
  ],
  "pot-bunga-tempurung-kelapa": [
    "/images/product-pot-bunga.png",
  ],
  "lilin-aromaterapi-tempurung": [
    "/images/product-lilin-aromaterapi.png",
  ],
};

// Banner toko per store slug
const STORE_BANNERS: Record<string, string> = {
  "karya-nyiur-aceh":           "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Coconut_on_white_background.jpg/1200px-Coconut_on_white_background.jpg",
  "briket-premium-nusantara":   "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Coconut_charcoal_briquettes.jpg/1200px-Coconut_charcoal_briquettes.jpg",
  "vco-alami-nusantara":        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Coconut-oil.jpg/1200px-Coconut-oil.jpg",
  "sabut-hijau-lestari":        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Coir_fibers.jpg/1200px-Coir_fibers.jpg",
  "kerajinan-tempurung-jaya":   "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Coconut_shell_bowl.jpg/1200px-Coconut_shell_bowl.jpg",
  "arang-kelapa-berkualitas":   "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Charcoal_briquettes.jpg/1200px-Charcoal_briquettes.jpg",
};

// Gambar kategori per slug
const CATEGORY_IMAGES: Record<string, string> = {
  "tempurung":  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Coconut_on_white_background.jpg/800px-Coconut_on_white_background.jpg",
  "sabut":      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Coir_fibers.jpg/800px-Coir_fibers.jpg",
  "arang":      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Coconut_charcoal_briquettes.jpg/800px-Coconut_charcoal_briquettes.jpg",
  "minyak":     "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Coconut-oil.jpg/800px-Coconut-oil.jpg",
  "kerajinan":  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Coconut_shell_bowl.jpg/800px-Coconut_shell_bowl.jpg",
  "olahan":     "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Coconut_on_white_background.jpg/800px-Coconut_on_white_background.jpg",
};

// Helper utama: ambil gambar produk dari registry
const getProductImage = (slug: string, idx = 0): string => {
  const list = PRODUCT_IMAGES[slug];
  if (list && list.length > 0) return list[idx % list.length];
  return "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Coconut_on_white_background.jpg/800px-Coconut_on_white_background.jpg";
};

const avatar = (name: string, bg = "2F5233") =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&size=200&bold=true`;

// ============================================
// CATEGORIES
// ============================================

export const MOCK_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Tempurung Kelapa",
    name_en: "Coconut Shell",
    slug: "tempurung",
    description: "Produk olahan tempurung kelapa berkualitas premium",
    icon: "🥥",
    image_url: CATEGORY_IMAGES["tempurung"],
    parent_id: null,
    sort_order: 1,
    product_count: 48,
    is_active: true,
  },
  {
    id: "cat-2",
    name: "Sabut & Cocopeat",
    name_en: "Coir & Cocopeat",
    slug: "sabut",
    description: "Sabut kelapa dan cocopeat untuk media tanam premium",
    icon: "🌿",
    image_url: CATEGORY_IMAGES["sabut"],
    parent_id: null,
    sort_order: 2,
    product_count: 36,
    is_active: true,
  },
  {
    id: "cat-3",
    name: "Arang & Briket",
    name_en: "Charcoal & Briquettes",
    slug: "arang",
    description: "Arang kelapa aktif dan briket berkalori tinggi",
    icon: "⚫",
    image_url: CATEGORY_IMAGES["arang"],
    parent_id: null,
    sort_order: 3,
    product_count: 52,
    is_active: true,
  },
  {
    id: "cat-4",
    name: "Minyak Kelapa",
    name_en: "Coconut Oil",
    slug: "minyak",
    description: "VCO dan minyak kelapa murni hasil pengolahan tradisional",
    icon: "🫙",
    image_url: CATEGORY_IMAGES["minyak"],
    parent_id: null,
    sort_order: 4,
    product_count: 29,
    is_active: true,
  },
  {
    id: "cat-5",
    name: "Kerajinan Tangan",
    name_en: "Handicrafts",
    slug: "kerajinan",
    description: "Kerajinan unik berbahan tempurung dan serat kelapa",
    icon: "🎨",
    image_url: CATEGORY_IMAGES["kerajinan"],
    parent_id: null,
    sort_order: 5,
    product_count: 41,
    is_active: true,
  },
  {
    id: "cat-6",
    name: "Produk Olahan",
    name_en: "Processed Products",
    slug: "olahan",
    description: "Berbagai produk inovatif turunan kelapa siap pakai",
    icon: "🍃",
    image_url: CATEGORY_IMAGES["tempurung"],
    parent_id: null,
    sort_order: 6,
    product_count: 23,
    is_active: true,
  },
];

// ============================================
// STORES / SELLERS
// ============================================

export const MOCK_STORES: Store[] = [
  {
    id: "store-1",
    owner_id: "user-1",
    name: "Karya Nyiur Aceh",
    slug: "karya-nyiur-aceh",
    description:
      "Produsen tempurung kelapa premium dari jantung Aceh. Kami menjamin kualitas Grade A dengan proses seleksi ketat dan sertifikasi ramah lingkungan.",
    logo_url: avatar("Karya Nyiur Aceh"),
    banner_url: STORE_BANNERS["karya-nyiur-aceh"],
    location: "Banda Aceh, Aceh",
    province: "Aceh",
    city: "Banda Aceh",
    is_verified: true,
    is_active: true,
    rating: 4.9,
    total_sales: 2847,
    total_products: 18,
    whatsapp: "628112345001",
    instagram: "@karyanyiuraceh",
    website: null,
    created_at: "2022-03-15T00:00:00Z",
    updated_at: "2026-06-01T00:00:00Z",
  },
  {
    id: "store-2",
    owner_id: "user-2",
    name: "Briket Premium Nusantara",
    slug: "briket-premium-nusantara",
    description:
      "Spesialis briket kelapa berkualitas ekspor untuk BBQ dan shisha. Telah melayani lebih dari 50 negara dengan standar internasional.",
    logo_url: avatar("Briket Premium Nusantara", "6B3E26"),
    banner_url: STORE_BANNERS["briket-premium-nusantara"],
    location: "Medan, Sumatera Utara",
    province: "Sumatera Utara",
    city: "Medan",
    is_verified: true,
    is_active: true,
    rating: 4.8,
    total_sales: 5234,
    total_products: 12,
    whatsapp: "628112345002",
    instagram: "@briketpremiumnusantara",
    website: "https://briketpremium.co.id",
    created_at: "2021-07-20T00:00:00Z",
    updated_at: "2026-05-15T00:00:00Z",
  },
  {
    id: "store-3",
    owner_id: "user-3",
    name: "VCO Alami Nusantara",
    slug: "vco-alami-nusantara",
    description:
      "Produsen VCO (Virgin Coconut Oil) murni dengan metode cold-pressed tradisional. Setiap botol adalah esensi kesehatan dari kebun kelapa Aceh.",
    logo_url: avatar("VCO Alami Nusantara", "8C6D1F"),
    banner_url: STORE_BANNERS["vco-alami-nusantara"],
    location: "Jakarta Selatan, DKI Jakarta",
    province: "DKI Jakarta",
    city: "Jakarta Selatan",
    is_verified: true,
    is_active: true,
    rating: 4.7,
    total_sales: 3912,
    total_products: 8,
    whatsapp: "628112345003",
    instagram: "@vcoalaminusantara",
    website: null,
    created_at: "2022-01-10T00:00:00Z",
    updated_at: "2026-06-10T00:00:00Z",
  },
  {
    id: "store-4",
    owner_id: "user-4",
    name: "Sabut Hijau Lestari",
    slug: "sabut-hijau-lestari",
    description:
      "Produsen cocopeat dan sabut kelapa untuk hortikultura dan pertanian organik. Mendukung petani lokal dengan harga terjangkau.",
    logo_url: avatar("Sabut Hijau Lestari", "3F6B2F"),
    banner_url: STORE_BANNERS["sabut-hijau-lestari"],
    location: "Surabaya, Jawa Timur",
    province: "Jawa Timur",
    city: "Surabaya",
    is_verified: true,
    is_active: true,
    rating: 4.6,
    total_sales: 1876,
    total_products: 14,
    whatsapp: "628112345004",
    instagram: "@sabuthijaulestari",
    website: null,
    created_at: "2022-09-05T00:00:00Z",
    updated_at: "2026-04-20T00:00:00Z",
  },
  {
    id: "store-5",
    owner_id: "user-5",
    name: "Kerajinan Tempurung Jaya",
    slug: "kerajinan-tempurung-jaya",
    description:
      "Pengrajin tempurung kelapa berpengalaman 20 tahun. Setiap karya adalah perpaduan seni tradisional dan inovasi modern yang berkelanjutan.",
    logo_url: avatar("Kerajinan Tempurung Jaya", "7A4A1E"),
    banner_url: STORE_BANNERS["kerajinan-tempurung-jaya"],
    location: "Yogyakarta, DI Yogyakarta",
    province: "DI Yogyakarta",
    city: "Yogyakarta",
    is_verified: false,
    is_active: true,
    rating: 4.8,
    total_sales: 1243,
    total_products: 22,
    whatsapp: "628112345005",
    instagram: "@kerajinantempurungjaya",
    website: null,
    created_at: "2023-02-14T00:00:00Z",
    updated_at: "2026-06-05T00:00:00Z",
  },
  {
    id: "store-6",
    owner_id: "user-6",
    name: "Arang Kelapa Berkualitas",
    slug: "arang-kelapa-berkualitas",
    description:
      "Produsen arang aktif (activated carbon) dari tempurung kelapa pilihan. Melayani industri farmasi, pengolahan air, dan ekspor internasional.",
    logo_url: avatar("Arang Kelapa Berkualitas", "2B2B2B"),
    banner_url: STORE_BANNERS["arang-kelapa-berkualitas"],
    location: "Makassar, Sulawesi Selatan",
    province: "Sulawesi Selatan",
    city: "Makassar",
    is_verified: true,
    is_active: true,
    rating: 4.9,
    total_sales: 4127,
    total_products: 9,
    whatsapp: "628112345006",
    instagram: "@arangkelapaberkualitas",
    website: "https://arangkelapa.id",
    created_at: "2021-11-30T00:00:00Z",
    updated_at: "2026-05-28T00:00:00Z",
  },
];

// ============================================
// AI INSIGHTS (per product)
// ============================================

export interface AIInsight {
  quality_grade: "A" | "B" | "C";
  suitable_for: string[];
  suggested_uses: string[];
  market_demand: "high" | "medium" | "low";
  co2_impact: string;
  purity?: string;
  calorific_value?: string;
}

export const AI_INSIGHTS: Record<string, AIInsight> = {
  "briket-kelapa-premium-hexagon": {
    quality_grade: "A",
    suitable_for: ["BBQ Restaurant", "Shisha Lounge", "Ekspor"],
    suggested_uses: ["Pembakaran BBQ", "Shisha", "Perapian"],
    market_demand: "high",
    co2_impact: "Menghemat 2.4 kg CO₂ per kg vs. batubara",
    calorific_value: "7.200 kcal/kg",
  },
  "arang-aktif-premium-400-mesh": {
    quality_grade: "A",
    suitable_for: ["Industri Farmasi", "Pengolahan Air", "Industri Kimia"],
    suggested_uses: ["Filtrasi Air", "Pemurnian Obat", "Adsorpsi Gas"],
    market_demand: "high",
    co2_impact: "Mendaur ulang 100% limbah tempurung",
    purity: "99.2% Carbon",
  },
  "vco-murni-cold-pressed-500ml": {
    quality_grade: "A",
    suitable_for: ["Konsumsi Langsung", "Kecantikan", "Memasak Sehat"],
    suggested_uses: ["Suplemen Kesehatan", "Perawatan Rambut", "Masak"],
    market_demand: "high",
    co2_impact: "Zero waste — ampas digunakan untuk pakan ternak",
  },
  "cocopeat-premium-organik-50l": {
    quality_grade: "A",
    suitable_for: ["Hidroponik", "Media Tanam", "Nurseri Profesional"],
    suggested_uses: ["Media Tanam Sayuran", "Pembenah Tanah", "Mulsa"],
    market_demand: "high",
    co2_impact: "Mengurangi penggunaan tanah gambut 100%",
  },
  "tempurung-kelapa-asap-cair": {
    quality_grade: "B",
    suitable_for: ["Industri Pengasapan", "Pengawet Alami", "Pertanian"],
    suggested_uses: ["Pengawet Daging", "Pestisida Organik", "Penolak Hama"],
    market_demand: "medium",
    co2_impact: "Memanfaatkan 100% hasil samping pengarangan",
  },
  "mangkok-tempurung-ukir-handmade": {
    quality_grade: "A",
    suitable_for: ["Home Decor", "Restoran Etnik", "Souvenir Premium"],
    suggested_uses: ["Wadah Makanan", "Dekorasi Meja", "Hadiah Premium"],
    market_demand: "medium",
    co2_impact: "Menggunakan tempurung yang tidak dapat dijual langsung",
  },
  "sabut-kelapa-anyaman-premium": {
    quality_grade: "B",
    suitable_for: ["Industri Furniture", "Pertanian", "Ekspor"],
    suggested_uses: ["Jok Kendaraan", "Kasur Organik", "Media Tanam"],
    market_demand: "medium",
    co2_impact: "Mengalihkan 3 kg limbah sabut per unit",
  },
  "briket-kelapa-cube-bbq": {
    quality_grade: "A",
    suitable_for: ["BBQ Home", "Katering", "Warung Makan"],
    suggested_uses: ["Pembakaran Daging", "Ikan Bakar", "Sate"],
    market_demand: "high",
    co2_impact: "2.1 kg CO₂ lebih rendah vs. briket batubara",
    calorific_value: "6.800 kcal/kg",
  },
  "tepung-tempurung-kelapa": {
    quality_grade: "B",
    suitable_for: ["Industri Pakan", "Pupuk Organik", "Biochar"],
    suggested_uses: ["Pakan Ternak", "Amandemen Tanah", "Kompos Premium"],
    market_demand: "medium",
    co2_impact: "Memanfaatkan 100% limbah tempurung yang tidak terpakai",
  },
  "minyak-kelapa-goreng-tradisional": {
    quality_grade: "B",
    suitable_for: ["Masak Rumahan", "Industri Kuliner", "HORECA"],
    suggested_uses: ["Menggoreng", "Tumis", "Baking"],
    market_demand: "high",
    co2_impact: "Diproduksi tanpa bahan kimia tambahan",
  },
  "cocopeat-brick-compresed": {
    quality_grade: "A",
    suitable_for: ["Ekspor", "Pertanian Modern", "Greenhouse"],
    suggested_uses: ["Ekspansi Media Tanam", "Substrat Hidroponik", "Nurseri"],
    market_demand: "high",
    co2_impact: "Produk terkompresi mengurangi volume pengiriman 85%",
  },
  "kerajinan-frame-foto-tempurung": {
    quality_grade: "A",
    suitable_for: ["Home Decor", "Souvenir", "Gift Shop"],
    suggested_uses: ["Bingkai Foto", "Dekorasi Dinding", "Hadiah"],
    market_demand: "low",
    co2_impact: "Setiap unit menggunakan 200g tempurung daur ulang",
  },
  "arang-kelapa-hookah-grade": {
    quality_grade: "A",
    suitable_for: ["Shisha Lounge", "Hookah Bar", "Ekspor Timur Tengah"],
    suggested_uses: ["Bahan Bakar Shisha", "Hookah Premium"],
    market_demand: "high",
    co2_impact: "Bebas bahan kimia — murni 100% kelapa",
    calorific_value: "7.500 kcal/kg",
  },
  "vco-kapsul-softgel-100caps": {
    quality_grade: "A",
    suitable_for: ["Suplemen Kesehatan", "Farmasi", "Wellness Center"],
    suggested_uses: ["Suplemen Harian", "Peningkat Imun", "Anti-inflamasi"],
    market_demand: "high",
    co2_impact: "Kemasan ramah lingkungan — kapsul berbasis alga",
  },
  "sabut-kelapa-cocofiber-roll": {
    quality_grade: "B",
    suitable_for: ["Erosi Kontrol", "Reklamasi Lahan", "Pertanian Lereng"],
    suggested_uses: ["Penahan Erosi", "Stabilisasi Tanah", "Revegetasi"],
    market_demand: "medium",
    co2_impact: "1 roll menahan erosi setara 500 kg tanah/tahun",
  },
  "mangkok-set-tempurung-premium": {
    quality_grade: "A",
    suitable_for: ["Fine Dining", "Hotel Bintang", "Restoran Etnik"],
    suggested_uses: ["Set Makan Mewah", "Dekorasi Premium", "Souvenir Hotel"],
    market_demand: "medium",
    co2_impact: "Setiap set menggunakan 4 tempurung yang tak terpakai",
  },
  "briket-kelapa-lonjong-3kg": {
    quality_grade: "A",
    suitable_for: ["Pembangkit Listrik Skala Kecil", "Industri Rumahan"],
    suggested_uses: ["Bahan Bakar Biomassa", "BBQ Skala Besar"],
    market_demand: "medium",
    co2_impact: "3.2 kg CO₂ lebih rendah per kg vs. batubara",
    calorific_value: "6.500 kcal/kg",
  },
  "vco-murni-1-liter": {
    quality_grade: "A",
    suitable_for: ["Produksi Kosmetik", "Industri Makanan", "Ekspor"],
    suggested_uses: ["Bahan Baku Kosmetik", "Minyak Esensial", "Sabun"],
    market_demand: "high",
    co2_impact: "Zero waste — semua fraksi kelapa dimanfaatkan",
  },
  "pot-bunga-tempurung-kelapa": {
    quality_grade: "B",
    suitable_for: ["Home Garden", "Cafe Decor", "Nurseri Tanaman"],
    suggested_uses: ["Pot Tanaman Hias", "Terrarium Mini", "Dekorasi Taman"],
    market_demand: "low",
    co2_impact: "Pot biodegradable — tidak meninggalkan plastik",
  },
  "cocopeat-siap-tanam-10kg": {
    quality_grade: "A",
    suitable_for: ["Home Gardening", "Urban Farming", "Komunitas Tani"],
    suggested_uses: ["Media Tanam Langsung", "Campuran Pot", "Pertanian Rumah"],
    market_demand: "high",
    co2_impact: "Mengalihkan 10 kg limbah sabut dari pembakaran",
  },
  "arang-kelapa-industri-25kg": {
    quality_grade: "B",
    suitable_for: ["Industri Logam", "Peleburan", "Industri Kimia"],
    suggested_uses: ["Reduktor Logam", "Karbon Aktif Industri"],
    market_demand: "medium",
    co2_impact: "25 kg arang menggantikan 30 kg batubara",
  },
  "tempurung-kelapa-asah-bahan-baku": {
    quality_grade: "B",
    suitable_for: ["Pengrajin", "Pabrik Kerajinan", "Home Industry"],
    suggested_uses: ["Bahan Baku Kerajinan", "Karbon Premium", "Ukiran"],
    market_demand: "medium",
    co2_impact: "Mengalihkan 100% limbah pertanian kelapa",
  },
  "sabut-kelapa-curah-100kg": {
    quality_grade: "B",
    suitable_for: ["Pabrik Kasur", "Industri Otomotif", "Ekspor Bahan Baku"],
    suggested_uses: ["Bahan Baku Kasur", "Padding Kendaraan", "Isolasi"],
    market_demand: "medium",
    co2_impact: "Mengalihkan 100 kg limbah dari pembakaran",
  },
  "lilin-aromaterapi-tempurung": {
    quality_grade: "A",
    suitable_for: ["Spa", "Hotel Boutique", "Gift Shop Premium"],
    suggested_uses: ["Aromaterapi", "Dekorasi Ruangan", "Hadiah Premium"],
    market_demand: "low",
    co2_impact: "Wadah tempurung dapat digunakan ulang sebagai pot",
  },
};

// ============================================
// PRODUCTS (24 total)
// ============================================

// Kata kunci foto per produk — dipilih manual supaya visual yang
// tampil benar-benar sesuai nama & deskripsi produk (bukan foto acak).
const PRODUCT_IMAGE_KEYWORDS: Record<string, string> = {
  "briket-kelapa-premium-hexagon": "charcoal,briquette,hexagon",
  "arang-aktif-premium-400-mesh": "activated,carbon,powder",
  "tepung-tempurung-kelapa": "coconut,shell,powder",
  "tempurung-kelapa-asap-cair": "liquidsmoke,bottle,brown",
  "cocopeat-premium-organik-50l": "cocopeat,coir,soil",
  "cocopeat-brick-compresed": "cocopeat,brick,compressed",
  "sabut-kelapa-anyaman-premium": "coir,mat,woven",
  "cocopeat-siap-tanam-10kg": "cocopeat,potting,soil",
  "briket-kelapa-cube-bbq": "charcoal,cube,bbq",
  "arang-kelapa-hookah-grade": "charcoal,hookah,shisha",
  "briket-kelapa-lonjong-3kg": "charcoal,briquette,oval",
  "arang-kelapa-industri-25kg": "charcoal,sack,industrial",
  "vco-murni-cold-pressed-500ml": "coconut,oil,bottle",
  "vco-kapsul-softgel-100caps": "capsule,supplement,softgel",
  "minyak-kelapa-goreng-tradisional": "coconut,oil,cooking",
  "vco-murni-1-liter": "coconut,oil,glassbottle",
  "mangkok-tempurung-ukir-handmade": "coconut,bowl,carved",
  "mangkok-set-tempurung-premium": "coconut,bowl,tableware",
  "kerajinan-frame-foto-tempurung": "coconut,shell,photoframe",
  "pot-bunga-tempurung-kelapa": "coconut,shell,flowerpot",
  "sabut-kelapa-cocofiber-roll": "coir,fiber,roll",
  "tempurung-kelapa-asah-bahan-baku": "coconut,shell,rawmaterial",
  "sabut-kelapa-curah-100kg": "coconut,coir,sack",
  "lilin-aromaterapi-tempurung": "coconut,shell,candle",
};

const makeImages = (slug: string, count = 3): ProductImage[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `img-${slug}-${i}`,
    product_id: slug,
    url: getProductImage(slug, i),
    alt: null,
    sort_order: i,
    is_primary: i === 0,
  }));

export const MOCK_PRODUCTS: Product[] = [
  // ===== TEMPURUNG KELAPA (cat-1) =====
  {
    id: "prod-1",
    store_id: "store-1",
    category_id: "cat-1",
    name: "Briket Kelapa Premium Hexagon",
    slug: "briket-kelapa-premium-hexagon",
    description:
      "Briket kelapa premium berbentuk hexagon dengan nilai kalor tinggi 7.200 kcal/kg. Cocok untuk BBQ restaurant, shisha lounge, dan ekspor. Diproses dari tempurung kelapa pilihan Grade A tanpa campuran bahan kimia berbahaya. Pembakaran bersih, tanpa asap, dan tahan lama hingga 3-4 jam. Sudah memenuhi standar SGS dan ISO 9001.",
    short_description: "Briket hexagon Grade A, nilai kalor 7.200 kcal/kg, tanpa bahan kimia",
    price: 45000,
    min_price: 45000,
    max_price: 850000,
    stock: 500,
    min_order: 1,
    unit: "kg",
    weight: 1000,
    is_active: true,
    is_featured: true,
    is_eco_certified: true,
    tags: ["briket", "kelapa", "hexagon", "bbq", "shisha", "premium", "ekspor"],
    rating: 4.9,
    review_count: 284,
    total_sold: 4821,
    co2_saved: 2.4,
    waste_diverted: 1.2,
    created_at: "2023-01-15T00:00:00Z",
    updated_at: "2026-06-01T00:00:00Z",
    store: MOCK_STORES[0],
    category: MOCK_CATEGORIES[0],
    images: makeImages("briket-kelapa-premium-hexagon", 4),
  },
  {
    id: "prod-2",
    store_id: "store-6",
    category_id: "cat-1",
    name: "Arang Aktif Premium 400 Mesh",
    slug: "arang-aktif-premium-400-mesh",
    description:
      "Arang aktif (activated carbon) dari tempurung kelapa pilihan dengan kemurnian 99.2% carbon. Mesh 400 untuk aplikasi industri farmasi, pengolahan air limbah, dan pemurnian gas. Luas permukaan BET > 1000 m²/g. Telah tersertifikasi NSF/ANSI 61 untuk aplikasi pengolahan air minum.",
    short_description: "Activated carbon 99.2% purity, BET > 1000 m²/g, NSF certified",
    price: 185000,
    min_price: 185000,
    max_price: 3500000,
    stock: 200,
    min_order: 1,
    unit: "kg",
    weight: 1000,
    is_active: true,
    is_featured: true,
    is_eco_certified: true,
    tags: ["arang", "aktif", "activated carbon", "farmasi", "filter", "industri"],
    rating: 4.8,
    review_count: 167,
    total_sold: 2341,
    co2_saved: 3.1,
    waste_diverted: 1.0,
    created_at: "2022-08-20T00:00:00Z",
    updated_at: "2026-05-15T00:00:00Z",
    store: MOCK_STORES[5],
    category: MOCK_CATEGORIES[0],
    images: makeImages("arang-aktif-premium-400-mesh", 3),
  },
  {
    id: "prod-3",
    store_id: "store-1",
    category_id: "cat-1",
    name: "Tepung Tempurung Kelapa",
    slug: "tepung-tempurung-kelapa",
    description:
      "Tepung tempurung kelapa halus untuk bahan pakan ternak premium dan pupuk organik. Kaya karbon organik dan mineral mikro. Dapat meningkatkan kualitas tanah secara signifikan. Diolah secara higienis tanpa bahan pengawet.",
    short_description: "Tepung tempurung halus, kaya mineral, untuk pakan & pupuk organik",
    price: 25000,
    min_price: 25000,
    max_price: 450000,
    stock: 800,
    min_order: 5,
    unit: "kg",
    weight: 1000,
    is_active: true,
    is_featured: false,
    is_eco_certified: true,
    tags: ["tepung", "tempurung", "pupuk", "pakan", "organik"],
    rating: 4.5,
    review_count: 89,
    total_sold: 1234,
    co2_saved: 1.8,
    waste_diverted: 2.0,
    created_at: "2023-03-10T00:00:00Z",
    updated_at: "2026-04-20T00:00:00Z",
    store: MOCK_STORES[0],
    category: MOCK_CATEGORIES[0],
    images: makeImages("tepung-tempurung-kelapa", 2),
  },
  {
    id: "prod-4",
    store_id: "store-1",
    category_id: "cat-1",
    name: "Tempurung Kelapa Asap Cair",
    slug: "tempurung-kelapa-asap-cair",
    description:
      "Asap cair (liquid smoke) Grade 1 dari distilasi tempurung kelapa. Digunakan sebagai pengawet alami, pestisida organik, dan pengasap makanan. Bebas benzopiren dan PAH (Polycyclic Aromatic Hydrocarbons). Sudah diuji di laboratorium terakreditasi Kemenperin.",
    short_description: "Asap cair Grade 1, bebas benzopiren, pengawet & pestisida organik",
    price: 35000,
    min_price: 35000,
    max_price: 280000,
    stock: 300,
    min_order: 1,
    unit: "liter",
    weight: 1100,
    is_active: true,
    is_featured: false,
    is_eco_certified: true,
    tags: ["asap cair", "liquid smoke", "pengawet", "pestisida", "organik"],
    rating: 4.6,
    review_count: 112,
    total_sold: 876,
    co2_saved: 1.5,
    waste_diverted: 0.8,
    created_at: "2023-05-22T00:00:00Z",
    updated_at: "2026-03-10T00:00:00Z",
    store: MOCK_STORES[0],
    category: MOCK_CATEGORIES[0],
    images: makeImages("tempurung-kelapa-asap-cair", 3),
  },
  // ===== SABUT & COCOPEAT (cat-2) =====
  {
    id: "prod-5",
    store_id: "store-4",
    category_id: "cat-2",
    name: "Cocopeat Premium Organik 50L",
    slug: "cocopeat-premium-organik-50l",
    description:
      "Cocopeat premium terkomposisi sempurna untuk media tanam hidroponik dan organik. EC rendah (< 1.0 mS/cm), pH netral 5.8-6.5. Menyimpan air 8x beratnya sendiri. Bebas patogen dan hama. Cocok untuk sayuran, bunga, dan tanaman hias premium.",
    short_description: "Cocopeat EC rendah, pH 5.8-6.5, kapasitas air 8x, bebas patogen",
    price: 85000,
    min_price: 85000,
    max_price: 1500000,
    stock: 400,
    min_order: 1,
    unit: "karung",
    weight: 9000,
    is_active: true,
    is_featured: true,
    is_eco_certified: true,
    tags: ["cocopeat", "media tanam", "hidroponik", "organik", "tanaman"],
    rating: 4.8,
    review_count: 203,
    total_sold: 2987,
    co2_saved: 0.8,
    waste_diverted: 9.0,
    created_at: "2022-11-01T00:00:00Z",
    updated_at: "2026-06-12T00:00:00Z",
    store: MOCK_STORES[3],
    category: MOCK_CATEGORIES[1],
    images: makeImages("cocopeat-premium-organik-50l", 3),
  },
  {
    id: "prod-6",
    store_id: "store-4",
    category_id: "cat-2",
    name: "Cocopeat Brick Compressed",
    slug: "cocopeat-brick-compresed",
    description:
      "Cocopeat dalam bentuk brick terkompresi untuk kemudahan ekspor dan distribusi. 1 brick 650g mengembang menjadi 8-9 liter cocopeat siap pakai. Efisiensi pengiriman lebih dari 85%. Sudah diekspor ke 20+ negara. Ideal untuk nurseri, greenhouse, dan pengecer pertanian.",
    short_description: "1 brick = 8-9L cocopeat, efisiensi kirim 85%, sudah ekspor ke 20+ negara",
    price: 15000,
    min_price: 15000,
    max_price: 650000,
    stock: 1200,
    min_order: 10,
    unit: "pcs",
    weight: 650,
    is_active: true,
    is_featured: true,
    is_eco_certified: true,
    tags: ["cocopeat", "brick", "compressed", "ekspor", "efisien"],
    rating: 4.9,
    review_count: 341,
    total_sold: 8234,
    co2_saved: 0.5,
    waste_diverted: 0.65,
    created_at: "2022-06-15T00:00:00Z",
    updated_at: "2026-06-01T00:00:00Z",
    store: MOCK_STORES[3],
    category: MOCK_CATEGORIES[1],
    images: makeImages("cocopeat-brick-compresed", 4),
  },
  {
    id: "prod-7",
    store_id: "store-4",
    category_id: "cat-2",
    name: "Sabut Kelapa Anyaman Premium",
    slug: "sabut-kelapa-anyaman-premium",
    description:
      "Sabut kelapa anyaman (coir mat) premium untuk hortikultura dan lapangan golf. Kekuatan tarik > 35 kg/cm². Biodegradable dalam 3-5 tahun. Mencegah erosi dan menstabilkan tanah. Tersedia dalam berbagai ukuran mulai dari 1x1 hingga 2x50 meter.",
    short_description: "Coir mat premium, kuat tarik >35 kg/cm², biodegradable 3-5 tahun",
    price: 65000,
    min_price: 65000,
    max_price: 3200000,
    stock: 150,
    min_order: 1,
    unit: "roll",
    weight: 5000,
    is_active: true,
    is_featured: false,
    is_eco_certified: true,
    tags: ["sabut", "anyaman", "coir mat", "erosi", "golf", "hortikultura"],
    rating: 4.6,
    review_count: 78,
    total_sold: 654,
    co2_saved: 0.9,
    waste_diverted: 5.0,
    created_at: "2023-02-28T00:00:00Z",
    updated_at: "2026-04-15T00:00:00Z",
    store: MOCK_STORES[3],
    category: MOCK_CATEGORIES[1],
    images: makeImages("sabut-kelapa-anyaman-premium", 2),
  },
  {
    id: "prod-8",
    store_id: "store-4",
    category_id: "cat-2",
    name: "Cocopeat Siap Tanam 10kg",
    slug: "cocopeat-siap-tanam-10kg",
    description:
      "Cocopeat ready-to-use untuk home gardening dan urban farming. Sudah dicuci, dikeringkan, dan dikemas higienis. Langsung dapat digunakan tanpa persiapan tambahan. Ideal untuk pemula berkebun di rumah.",
    short_description: "Cocopeat siap pakai, sudah dicuci & dikemas higienis, untuk pemula",
    price: 45000,
    min_price: 45000,
    max_price: 380000,
    stock: 600,
    min_order: 1,
    unit: "karung",
    weight: 10000,
    is_active: true,
    is_featured: false,
    is_eco_certified: true,
    tags: ["cocopeat", "ready use", "home garden", "urban farming", "pemula"],
    rating: 4.7,
    review_count: 156,
    total_sold: 1876,
    co2_saved: 0.6,
    waste_diverted: 10.0,
    created_at: "2023-07-10T00:00:00Z",
    updated_at: "2026-05-20T00:00:00Z",
    store: MOCK_STORES[3],
    category: MOCK_CATEGORIES[1],
    images: makeImages("cocopeat-siap-tanam-10kg", 3),
  },
  // ===== ARANG & BRIKET (cat-3) =====
  {
    id: "prod-9",
    store_id: "store-2",
    category_id: "cat-3",
    name: "Briket Kelapa Cube BBQ",
    slug: "briket-kelapa-cube-bbq",
    description:
      "Briket kelapa berbentuk kubus (3x3x3 cm) khusus untuk BBQ home use dan katering. Mudah dinyalakan, nyala stabil hingga 2-3 jam. Tidak berasap dan tidak berbau. Dikemas dalam kardus 3kg yang praktis. Sudah melalui uji kalori di lab terakreditasi.",
    short_description: "Briket cube 3x3 cm, nyala 2-3 jam, tanpa asap, kemasan 3kg praktis",
    price: 55000,
    min_price: 55000,
    max_price: 480000,
    stock: 750,
    min_order: 1,
    unit: "pack",
    weight: 3000,
    is_active: true,
    is_featured: true,
    is_eco_certified: true,
    tags: ["briket", "cube", "bbq", "rumahan", "katering"],
    rating: 4.8,
    review_count: 312,
    total_sold: 5123,
    co2_saved: 2.1,
    waste_diverted: 1.5,
    created_at: "2022-04-10T00:00:00Z",
    updated_at: "2026-06-05T00:00:00Z",
    store: MOCK_STORES[1],
    category: MOCK_CATEGORIES[2],
    images: makeImages("briket-kelapa-cube-bbq", 4),
  },
  {
    id: "prod-10",
    store_id: "store-6",
    category_id: "cat-3",
    name: "Arang Kelapa Hookah Grade",
    slug: "arang-kelapa-hookah-grade",
    description:
      "Arang kelapa premium untuk hookah dan shisha. Nilai kalor tertinggi 7.500 kcal/kg. Tanpa campuran bahan kimia — murni 100% tempurung kelapa. Terbakar lebih lama, menghasilkan panas merata, dan tidak merusak rasa tembakau shisha. Dipercaya oleh 500+ shisha lounge di Asia.",
    short_description: "Arang hookah premium, 7.500 kcal/kg, murni 100% kelapa, dipercaya 500+ lounge",
    price: 75000,
    min_price: 75000,
    max_price: 1350000,
    stock: 400,
    min_order: 1,
    unit: "kg",
    weight: 1000,
    is_active: true,
    is_featured: true,
    is_eco_certified: true,
    tags: ["arang", "hookah", "shisha", "premium", "murni"],
    rating: 4.9,
    review_count: 198,
    total_sold: 3012,
    co2_saved: 2.8,
    waste_diverted: 1.0,
    created_at: "2022-12-05T00:00:00Z",
    updated_at: "2026-06-10T00:00:00Z",
    store: MOCK_STORES[5],
    category: MOCK_CATEGORIES[2],
    images: makeImages("arang-kelapa-hookah-grade", 3),
  },
  {
    id: "prod-11",
    store_id: "store-2",
    category_id: "cat-3",
    name: "Briket Kelapa Lonjong 3kg",
    slug: "briket-kelapa-lonjong-3kg",
    description:
      "Briket kelapa berbentuk lonjong (finger) untuk masak tradisional dan industri rumahan. Nyala tahan lama hingga 4-5 jam. Cocok untuk masak skala besar seperti katering, warung, dan usaha kuliner. Nilai kalor 6.500 kcal/kg.",
    short_description: "Briket lonjong 4-5 jam, 6.500 kcal/kg, ideal katering & warung makan",
    price: 42000,
    min_price: 42000,
    max_price: 370000,
    stock: 600,
    min_order: 2,
    unit: "pack",
    weight: 3000,
    is_active: true,
    is_featured: false,
    is_eco_certified: false,
    tags: ["briket", "lonjong", "finger", "katering", "warung"],
    rating: 4.6,
    review_count: 143,
    total_sold: 2345,
    co2_saved: 1.9,
    waste_diverted: 1.5,
    created_at: "2023-01-20T00:00:00Z",
    updated_at: "2026-05-10T00:00:00Z",
    store: MOCK_STORES[1],
    category: MOCK_CATEGORIES[2],
    images: makeImages("briket-kelapa-lonjong-3kg", 2),
  },
  {
    id: "prod-12",
    store_id: "store-6",
    category_id: "cat-3",
    name: "Arang Kelapa Industri 25kg",
    slug: "arang-kelapa-industri-25kg",
    description:
      "Arang kelapa bulk 25kg untuk keperluan industri logam, peleburan, dan aplikasi karbon aktif skala besar. Kandungan karbon > 75%. Kadar abu < 5%. Sudah digunakan oleh pabrik baja, peleburan emas, dan industri kimia.",
    short_description: "Arang industri 25kg, karbon >75%, abu <5%, untuk pabrik & peleburan",
    price: 350000,
    min_price: 350000,
    max_price: 2800000,
    stock: 200,
    min_order: 1,
    unit: "karung",
    weight: 25000,
    is_active: true,
    is_featured: false,
    is_eco_certified: false,
    tags: ["arang", "industri", "bulk", "logam", "peleburan"],
    rating: 4.5,
    review_count: 67,
    total_sold: 834,
    co2_saved: 8.5,
    waste_diverted: 25.0,
    created_at: "2022-09-15T00:00:00Z",
    updated_at: "2026-04-01T00:00:00Z",
    store: MOCK_STORES[5],
    category: MOCK_CATEGORIES[2],
    images: makeImages("arang-kelapa-industri-25kg", 2),
  },
  // ===== MINYAK KELAPA (cat-4) =====
  {
    id: "prod-13",
    store_id: "store-3",
    category_id: "cat-4",
    name: "VCO Murni Cold-Pressed 500ml",
    slug: "vco-murni-cold-pressed-500ml",
    description:
      "Virgin Coconut Oil (VCO) murni proses cold-pressed dari kelapa segar Aceh. Warna bening kristal, aroma khas kelapa alami, bebas bahan kimia. Kaya asam laurat (>50%) dan MCFA untuk kesehatan jantung dan imunitas. Telah mendapat sertifikasi BPOM, Halal MUI, dan Organic.",
    short_description: "VCO cold-pressed, bening kristal, laurat >50%, BPOM + Halal MUI",
    price: 95000,
    min_price: 95000,
    max_price: 650000,
    stock: 500,
    min_order: 1,
    unit: "botol",
    weight: 550,
    is_active: true,
    is_featured: true,
    is_eco_certified: true,
    tags: ["vco", "virgin coconut oil", "cold pressed", "organik", "halal", "bpom"],
    rating: 4.9,
    review_count: 456,
    total_sold: 7234,
    co2_saved: 0.3,
    waste_diverted: 0.5,
    created_at: "2022-02-01T00:00:00Z",
    updated_at: "2026-06-15T00:00:00Z",
    store: MOCK_STORES[2],
    category: MOCK_CATEGORIES[3],
    images: makeImages("vco-murni-cold-pressed-500ml", 4),
  },
  {
    id: "prod-14",
    store_id: "store-3",
    category_id: "cat-4",
    name: "VCO Kapsul Softgel 100 Caps",
    slug: "vco-kapsul-softgel-100caps",
    description:
      "VCO dalam kemasan kapsul softgel untuk konsumsi praktis. Setiap kapsul mengandung 1000mg VCO murni cold-pressed. Kemasan kapsul ramah lingkungan berbasis alga. Bebas gluten dan bebas kedelai. Diproduksi dalam fasilitas GMP certified.",
    short_description: "100 kapsul VCO 1000mg, kapsul alga ramah lingkungan, GMP certified",
    price: 125000,
    min_price: 125000,
    max_price: 1100000,
    stock: 350,
    min_order: 1,
    unit: "botol",
    weight: 180,
    is_active: true,
    is_featured: true,
    is_eco_certified: true,
    tags: ["vco", "kapsul", "softgel", "suplemen", "gmp", "halal"],
    rating: 4.8,
    review_count: 289,
    total_sold: 4512,
    co2_saved: 0.2,
    waste_diverted: 0.18,
    created_at: "2022-06-20T00:00:00Z",
    updated_at: "2026-06-01T00:00:00Z",
    store: MOCK_STORES[2],
    category: MOCK_CATEGORIES[3],
    images: makeImages("vco-kapsul-softgel-100caps", 3),
  },
  {
    id: "prod-15",
    store_id: "store-3",
    category_id: "cat-4",
    name: "Minyak Kelapa Goreng Tradisional",
    slug: "minyak-kelapa-goreng-tradisional",
    description:
      "Minyak kelapa goreng tradisional dengan proses pemanasan yang menghasilkan aroma gurih khas. Cocok untuk menggoreng, menumis, dan baking. Titik asap tinggi (> 177°C) membuatnya stabil saat memasak suhu tinggi. Diproduksi oleh pengrajin tradisional Aceh.",
    short_description: "Minyak kelapa goreng tradisional, titik asap >177°C, aroma gurih khas",
    price: 65000,
    min_price: 65000,
    max_price: 550000,
    stock: 600,
    min_order: 1,
    unit: "botol",
    weight: 900,
    is_active: true,
    is_featured: false,
    is_eco_certified: false,
    tags: ["minyak kelapa", "goreng", "masak", "tradisional", "aceh"],
    rating: 4.6,
    review_count: 178,
    total_sold: 3234,
    co2_saved: 0.2,
    waste_diverted: 0.4,
    created_at: "2022-08-15T00:00:00Z",
    updated_at: "2026-05-01T00:00:00Z",
    store: MOCK_STORES[2],
    category: MOCK_CATEGORIES[3],
    images: makeImages("minyak-kelapa-goreng-tradisional", 3),
  },
  {
    id: "prod-16",
    store_id: "store-3",
    category_id: "cat-4",
    name: "VCO Murni 1 Liter",
    slug: "vco-murni-1-liter",
    description:
      "VCO murni ukuran 1 liter untuk kebutuhan lebih besar — rumah tangga, produksi kosmetik DIY, atau usaha kecil. Sama kualitasnya dengan kemasan 500ml. Kemasan botol kaca premium yang dapat didaur ulang.",
    short_description: "VCO murni 1 liter, kemasan kaca premium, cocok untuk usaha & rumah tangga",
    price: 175000,
    min_price: 175000,
    max_price: 1500000,
    stock: 280,
    min_order: 1,
    unit: "botol",
    weight: 1050,
    is_active: true,
    is_featured: false,
    is_eco_certified: true,
    tags: ["vco", "murni", "1 liter", "kaca", "premium", "usaha"],
    rating: 4.7,
    review_count: 134,
    total_sold: 2123,
    co2_saved: 0.3,
    waste_diverted: 1.0,
    created_at: "2022-10-10T00:00:00Z",
    updated_at: "2026-04-15T00:00:00Z",
    store: MOCK_STORES[2],
    category: MOCK_CATEGORIES[3],
    images: makeImages("vco-murni-1-liter", 3),
  },
  // ===== KERAJINAN TANGAN (cat-5) =====
  {
    id: "prod-17",
    store_id: "store-5",
    category_id: "cat-5",
    name: "Mangkok Tempurung Ukir Handmade",
    slug: "mangkok-tempurung-ukir-handmade",
    description:
      "Mangkok tempurung kelapa dengan ukiran motif Aceh handmade. Setiap mangkok adalah karya unik pengrajin berpengalaman 20 tahun. Dipoles dengan minyak alami untuk kilap tahan lama. Aman untuk makanan — bebas cat dan bahan kimia. Diameter 12-14cm.",
    short_description: "Mangkok ukir motif Aceh handmade, food-safe, dipoles minyak alami",
    price: 85000,
    min_price: 75000,
    max_price: 95000,
    stock: 80,
    min_order: 1,
    unit: "pcs",
    weight: 250,
    is_active: true,
    is_featured: true,
    is_eco_certified: true,
    tags: ["mangkok", "tempurung", "ukir", "handmade", "aceh", "food safe"],
    rating: 4.9,
    review_count: 134,
    total_sold: 1234,
    co2_saved: 0.15,
    waste_diverted: 0.25,
    created_at: "2023-03-15T00:00:00Z",
    updated_at: "2026-06-08T00:00:00Z",
    store: MOCK_STORES[4],
    category: MOCK_CATEGORIES[4],
    images: makeImages("mangkok-tempurung-ukir-handmade", 4),
  },
  {
    id: "prod-18",
    store_id: "store-5",
    category_id: "cat-5",
    name: "Set Mangkok Tempurung Premium",
    slug: "mangkok-set-tempurung-premium",
    description:
      "Set 4 mangkok tempurung kelapa premium untuk fine dining dan restoran etnik. Setiap set terdiri dari 4 mangkok berukuran berbeda (S, M, L, XL). Ukiran motif bunga geometris, difinishing dengan lacquer food-grade. Cocok untuk hotel bintang dan restoran berkelas.",
    short_description: "Set 4 mangkok premium S-XL, food-grade lacquer, untuk hotel & restoran",
    price: 285000,
    min_price: 285000,
    max_price: 285000,
    stock: 35,
    min_order: 1,
    unit: "set",
    weight: 900,
    is_active: true,
    is_featured: true,
    is_eco_certified: true,
    tags: ["mangkok set", "tempurung", "premium", "fine dining", "hotel"],
    rating: 4.8,
    review_count: 78,
    total_sold: 456,
    co2_saved: 0.5,
    waste_diverted: 0.9,
    created_at: "2023-05-01T00:00:00Z",
    updated_at: "2026-05-20T00:00:00Z",
    store: MOCK_STORES[4],
    category: MOCK_CATEGORIES[4],
    images: makeImages("mangkok-set-tempurung-premium", 4),
  },
  {
    id: "prod-19",
    store_id: "store-5",
    category_id: "cat-5",
    name: "Frame Foto Tempurung Kelapa",
    slug: "kerajinan-frame-foto-tempurung",
    description:
      "Bingkai foto dari tempurung kelapa alami dengan finishing natural. Ukuran foto 4R (10x15 cm). Desain minimalis yang cocok untuk dekorasi modern. Tali rami untuk gantungan. Tersedia juga dalam ukuran 5R dan A4.",
    short_description: "Frame foto 4R dari tempurung natural, desain minimalis, tali rami",
    price: 55000,
    min_price: 45000,
    max_price: 85000,
    stock: 120,
    min_order: 1,
    unit: "pcs",
    weight: 180,
    is_active: true,
    is_featured: false,
    is_eco_certified: false,
    tags: ["frame foto", "tempurung", "minimalis", "dekorasi", "dinding"],
    rating: 4.7,
    review_count: 92,
    total_sold: 734,
    co2_saved: 0.1,
    waste_diverted: 0.18,
    created_at: "2023-07-20T00:00:00Z",
    updated_at: "2026-04-05T00:00:00Z",
    store: MOCK_STORES[4],
    category: MOCK_CATEGORIES[4],
    images: makeImages("kerajinan-frame-foto-tempurung", 3),
  },
  {
    id: "prod-20",
    store_id: "store-5",
    category_id: "cat-5",
    name: "Pot Bunga Tempurung Kelapa",
    slug: "pot-bunga-tempurung-kelapa",
    description:
      "Pot bunga unik dari tempurung kelapa alami. Biodegradable sepenuhnya — saat pot terurai, menjadi nutrisi untuk tanah. Ukuran standar 12-15cm, cocok untuk tanaman sukulen, kaktus, dan tanaman hias kecil. Lengkap dengan lubang drainase.",
    short_description: "Pot tempurung biodegradable, nutrisi untuk tanah, cocok sukulen & kaktus",
    price: 35000,
    min_price: 25000,
    max_price: 45000,
    stock: 200,
    min_order: 1,
    unit: "pcs",
    weight: 300,
    is_active: true,
    is_featured: false,
    is_eco_certified: true,
    tags: ["pot", "tempurung", "biodegradable", "sukulen", "kaktus", "tanaman"],
    rating: 4.7,
    review_count: 167,
    total_sold: 1543,
    co2_saved: 0.12,
    waste_diverted: 0.3,
    created_at: "2023-04-10T00:00:00Z",
    updated_at: "2026-05-15T00:00:00Z",
    store: MOCK_STORES[4],
    category: MOCK_CATEGORIES[4],
    images: makeImages("pot-bunga-tempurung-kelapa", 3),
  },
  // ===== PRODUK OLAHAN (cat-6) =====
  {
    id: "prod-21",
    store_id: "store-1",
    category_id: "cat-6",
    name: "Sabut Kelapa Cocofiber Roll",
    slug: "sabut-kelapa-cocofiber-roll",
    description:
      "Cocofiber roll untuk pengendalian erosi dan revegetasi lahan. Cocok untuk lereng jalan, bantaran sungai, dan reklamasi lahan tambang. Kekuatan tarik tinggi, biodegradable dalam 3-5 tahun. Ukuran standar 1m x 25m.",
    short_description: "Cocofiber roll 1x25m, pengendalian erosi, biodegradable 3-5 tahun",
    price: 180000,
    min_price: 180000,
    max_price: 1800000,
    stock: 100,
    min_order: 1,
    unit: "roll",
    weight: 12000,
    is_active: true,
    is_featured: false,
    is_eco_certified: true,
    tags: ["cocofiber", "roll", "erosi", "revegetasi", "reklamasi", "lingkungan"],
    rating: 4.6,
    review_count: 43,
    total_sold: 289,
    co2_saved: 1.2,
    waste_diverted: 12.0,
    created_at: "2023-06-01T00:00:00Z",
    updated_at: "2026-03-20T00:00:00Z",
    store: MOCK_STORES[0],
    category: MOCK_CATEGORIES[5],
    images: makeImages("sabut-kelapa-cocofiber-roll", 2),
  },
  {
    id: "prod-22",
    store_id: "store-1",
    category_id: "cat-6",
    name: "Tempurung Kelapa Asah Bahan Baku",
    slug: "tempurung-kelapa-asah-bahan-baku",
    description:
      "Tempurung kelapa asah (crushed shell) sebagai bahan baku kerajinan dan industri karbon. Sudah dibersihkan dari serabut, dicuci, dan dikeringkan. Grading A, B, dan C tersedia. Minimum order 50 kg untuk harga grosir.",
    short_description: "Tempurung asah bersih, grading A/B/C, min. order 50kg grosir tersedia",
    price: 12000,
    min_price: 12000,
    max_price: 550000,
    stock: 5000,
    min_order: 50,
    unit: "kg",
    weight: 1000,
    is_active: true,
    is_featured: false,
    is_eco_certified: false,
    tags: ["tempurung", "bahan baku", "kerajinan", "grosir", "industri"],
    rating: 4.5,
    review_count: 56,
    total_sold: 4523,
    co2_saved: 0.8,
    waste_diverted: 1.0,
    created_at: "2022-07-15T00:00:00Z",
    updated_at: "2026-04-10T00:00:00Z",
    store: MOCK_STORES[0],
    category: MOCK_CATEGORIES[5],
    images: makeImages("tempurung-kelapa-asah-bahan-baku", 2),
  },
  {
    id: "prod-23",
    store_id: "store-4",
    category_id: "cat-6",
    name: "Sabut Kelapa Curah 100kg",
    slug: "sabut-kelapa-curah-100kg",
    description:
      "Sabut kelapa curah dalam karung 100kg untuk bahan baku pabrik kasur, bantal, dan padding otomotif. Kering, bebas jamur, dan siap proses. Harga kompetitif dengan kualitas konsisten. Pengiriman bisa seluruh Indonesia.",
    short_description: "Sabut curah 100kg, bahan baku kasur & otomotif, kering bebas jamur",
    price: 450000,
    min_price: 450000,
    max_price: 3800000,
    stock: 50,
    min_order: 1,
    unit: "karung",
    weight: 100000,
    is_active: true,
    is_featured: false,
    is_eco_certified: false,
    tags: ["sabut", "curah", "bahan baku", "kasur", "otomotif"],
    rating: 4.4,
    review_count: 34,
    total_sold: 234,
    co2_saved: 5.0,
    waste_diverted: 100.0,
    created_at: "2022-10-20T00:00:00Z",
    updated_at: "2026-03-01T00:00:00Z",
    store: MOCK_STORES[3],
    category: MOCK_CATEGORIES[5],
    images: makeImages("sabut-kelapa-curah-100kg", 2),
  },
  {
    id: "prod-24",
    store_id: "store-5",
    category_id: "cat-6",
    name: "Lilin Aromaterapi Tempurung",
    slug: "lilin-aromaterapi-tempurung",
    description:
      "Lilin aromaterapi premium dalam cangkang tempurung kelapa asli. Dibuat dari lilin lebah alami (beeswax) dan minyak esensial kelapa. Aroma tersedia: kelapa murni, pandan kelapa, dan kayu manis kelapa. Setiap lilin dapat menyala 20-25 jam. Wadah tempurung dapat digunakan ulang sebagai pot tanaman.",
    short_description: "Lilin beeswax premium dalam cangkang kelapa, 20-25 jam, aroma alami",
    price: 65000,
    min_price: 65000,
    max_price: 185000,
    stock: 150,
    min_order: 1,
    unit: "pcs",
    weight: 280,
    is_active: true,
    is_featured: false,
    is_eco_certified: true,
    tags: ["lilin", "aromaterapi", "tempurung", "beeswax", "spa", "aroma"],
    rating: 4.8,
    review_count: 112,
    total_sold: 876,
    co2_saved: 0.1,
    waste_diverted: 0.28,
    created_at: "2023-08-10T00:00:00Z",
    updated_at: "2026-05-25T00:00:00Z",
    store: MOCK_STORES[4],
    category: MOCK_CATEGORIES[5],
    images: makeImages("lilin-aromaterapi-tempurung", 3),
  },
];

// ============================================
// REVIEWS
// ============================================

export const MOCK_REVIEWS: Review[] = [
  {
    id: "rev-1",
    product_id: "prod-1",
    user_id: "user-rev-1",
    order_id: "order-1",
    rating: 5,
    comment:
      "Briket terbaik yang pernah saya coba! Nyala konsisten, tidak berasap, dan tahan lama. Sudah pesan 3 kali. Sangat direkomendasikan untuk BBQ restaurant.",
    images: ["https://images.unsplash.com/photo-1605647540924-852290f6b0d5?q=80&w=200&auto=format&fit=crop"],
    is_verified_purchase: true,
    helpful_count: 47,
    created_at: "2026-05-15T10:30:00Z",
    profile: { id: "p1", user_id: "u1", full_name: "Budi Santoso", username: "budi_s", avatar_url: null, bio: null, phone: null, location: "Jakarta", role: "user", is_verified: true, created_at: "2024-01-01Z", updated_at: "2024-01-01Z" },
  },
  {
    id: "rev-2",
    product_id: "prod-1",
    user_id: "user-rev-2",
    order_id: "order-2",
    rating: 5,
    comment:
      "Untuk shisha lounge kami, ini adalah pilihan terbaik. Tidak mengubah rasa tembakau dan panasnya merata. Sudah order rutin setiap bulan.",
    images: [],
    is_verified_purchase: true,
    helpful_count: 32,
    created_at: "2026-05-10T14:20:00Z",
    profile: { id: "p2", user_id: "u2", full_name: "Rizky Pratama", username: "rizky_p", avatar_url: null, bio: null, phone: null, location: "Surabaya", role: "user", is_verified: true, created_at: "2024-01-01Z", updated_at: "2024-01-01Z" },
  },
  {
    id: "rev-3",
    product_id: "prod-1",
    user_id: "user-rev-3",
    order_id: "order-3",
    rating: 4,
    comment:
      "Kualitas bagus, pengiriman cepat. Hanya saja harga sedikit lebih mahal dari kompetitor. Tapi memang sebanding dengan kualitas yang diberikan.",
    images: [],
    is_verified_purchase: true,
    helpful_count: 18,
    created_at: "2026-04-28T09:15:00Z",
    profile: { id: "p3", user_id: "u3", full_name: "Siti Aisyah", username: "siti_a", avatar_url: null, bio: null, phone: null, location: "Bandung", role: "user", is_verified: false, created_at: "2024-01-01Z", updated_at: "2024-01-01Z" },
  },
  {
    id: "rev-4",
    product_id: "prod-13",
    user_id: "user-rev-4",
    order_id: "order-4",
    rating: 5,
    comment:
      "VCO terbaik! Benar-benar bening seperti air jernih. Tidak berbau tengik sama sekali. Saya gunakan untuk masak dan perawatan rambut, hasilnya luar biasa.",
    images: [
      "https://images.unsplash.com/photo-1622484211148-716598e04041?q=80&w=200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=200&auto=format&fit=crop",
    ],
    is_verified_purchase: true,
    helpful_count: 89,
    created_at: "2026-06-01T11:00:00Z",
    profile: { id: "p4", user_id: "u4", full_name: "Diana Putri", username: "diana_p", avatar_url: null, bio: null, phone: null, location: "Medan", role: "user", is_verified: true, created_at: "2024-01-01Z", updated_at: "2024-01-01Z" },
  },
  {
    id: "rev-5",
    product_id: "prod-13",
    user_id: "user-rev-5",
    order_id: "order-5",
    rating: 5,
    comment:
      "Sudah 6 bulan konsumsi rutin. Kolesterol turun, energi meningkat. Teman-teman juga mulai pesan. Terima kasih sudah membuat produk berkualitas tinggi!",
    images: [],
    is_verified_purchase: true,
    helpful_count: 67,
    created_at: "2026-05-20T16:45:00Z",
    profile: { id: "p5", user_id: "u5", full_name: "Ahmad Fadhil", username: "ahmad_f", avatar_url: null, bio: null, phone: null, location: "Aceh", role: "user", is_verified: true, created_at: "2024-01-01Z", updated_at: "2024-01-01Z" },
  },
];

// ============================================
// EDUCATION ARTICLES (mock)
// ============================================

export interface MockArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  category_slug: string;
  cover_image: string;
  read_time: number;
  published_at: string;
  author_name: string;
  slug: string;
  is_featured: boolean;
  view_count: number;
  tags: string[];
}

export const MOCK_ARTICLES: MockArticle[] = [
  {
    id: "art-1",
    title: "Panduan Lengkap Membuat Briket Kelapa Berkualitas Ekspor",
    excerpt: "Pelajari langkah demi langkah proses pembuatan briket kelapa dari pemilihan bahan baku hingga quality control untuk standar ekspor internasional.",
    category: "Panduan UMKM",
    category_slug: "panduan-umkm",
    cover_image: "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?q=80&w=800&auto=format&fit=crop",
    read_time: 8,
    published_at: "2026-06-20T00:00:00Z",
    author_name: "Dr. Reza Kurniawan",
    slug: "panduan-membuat-briket-kelapa-ekspor",
    is_featured: true,
    view_count: 12847,
    tags: ["briket", "ekspor", "produksi", "panduan"],
  },
  {
    id: "art-2",
    title: "VCO vs Minyak Goreng Sawit: Perbandingan Komprehensif",
    excerpt: "Analisis mendalam tentang perbedaan nutrisi, proses produksi, dampak lingkungan, dan nilai ekonomi antara VCO kelapa dan minyak goreng sawit.",
    category: "Produk Kelapa",
    category_slug: "produk-kelapa",
    cover_image: "https://images.unsplash.com/photo-1622484211148-716598e04041?q=80&w=800&auto=format&fit=crop",
    read_time: 6,
    published_at: "2026-06-15T00:00:00Z",
    author_name: "Prof. Siti Nurhaliza",
    slug: "vco-vs-minyak-sawit-perbandingan",
    is_featured: true,
    view_count: 9234,
    tags: ["vco", "minyak kelapa", "perbandingan", "nutrisi"],
  },
  {
    id: "art-3",
    title: "Ekonomi Sirkular Kelapa: Dari Limbah Menjadi Nilai",
    excerpt: "Bagaimana platform Nyiur Nanggroe membantu petani kelapa Indonesia mengubah seluruh bagian kelapa menjadi sumber pendapatan yang berkelanjutan.",
    category: "Ekonomi Sirkular",
    category_slug: "ekonomi-sirkular",
    cover_image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=800&auto=format&fit=crop",
    read_time: 5,
    published_at: "2026-06-10T00:00:00Z",
    author_name: "Ir. Bambang Hartono",
    slug: "ekonomi-sirkular-kelapa-limbah-menjadi-nilai",
    is_featured: true,
    view_count: 7891,
    tags: ["ekonomi sirkular", "limbah", "sustainability", "petani"],
  },
  {
    id: "art-4",
    title: "Teknik Budidaya Kelapa Modern untuk Hasil Optimal",
    excerpt: "Tips dan teknik budidaya kelapa modern yang dapat meningkatkan hasil panen hingga 40% dengan tetap menjaga keberlanjutan lingkungan.",
    category: "Tips Pertanian",
    category_slug: "tips-pertanian",
    cover_image: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?q=80&w=800&auto=format&fit=crop",
    read_time: 10,
    published_at: "2026-06-05T00:00:00Z",
    author_name: "Agus Setiawan, S.P.",
    slug: "budidaya-kelapa-modern-hasil-optimal",
    is_featured: false,
    view_count: 5432,
    tags: ["budidaya", "pertanian", "kelapa", "modern"],
  },
  {
    id: "art-5",
    title: "Arang Aktif dari Tempurung Kelapa: Aplikasi Industri",
    excerpt: "Eksplorasi lengkap tentang berbagai aplikasi arang aktif kelapa di industri farmasi, pengolahan air, dan pemurnian gas industri.",
    category: "Teknologi",
    category_slug: "teknologi",
    cover_image: "https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=800&auto=format&fit=crop",
    read_time: 7,
    published_at: "2026-05-28T00:00:00Z",
    author_name: "Dr. Hendra Wijaya",
    slug: "arang-aktif-tempurung-aplikasi-industri",
    is_featured: false,
    view_count: 4123,
    tags: ["arang aktif", "industri", "farmasi", "teknologi"],
  },
  {
    id: "art-6",
    title: "Memulai Usaha Kerajinan Tempurung: Modal Kecil, Untung Besar",
    excerpt: "Panduan praktis memulai usaha kerajinan tempurung kelapa dengan modal terbatas, mulai dari peralatan, teknik, hingga pemasaran online.",
    category: "Panduan UMKM",
    category_slug: "panduan-umkm",
    cover_image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=800&auto=format&fit=crop",
    read_time: 9,
    published_at: "2026-05-20T00:00:00Z",
    author_name: "Yani Kusuma",
    slug: "usaha-kerajinan-tempurung-modal-kecil",
    is_featured: false,
    view_count: 6789,
    tags: ["kerajinan", "umkm", "usaha", "modal kecil"],
  },
  {
    id: "art-7",
    title: "Cocopeat sebagai Media Tanam Hidroponik: Panduan Lengkap",
    excerpt: "Semua yang perlu Anda tahu tentang menggunakan cocopeat sebagai media tanam hidroponik, termasuk persiapan, pemupukan, dan troubleshooting.",
    category: "Tips Pertanian",
    category_slug: "tips-pertanian",
    cover_image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop",
    read_time: 8,
    published_at: "2026-05-15T00:00:00Z",
    author_name: "Nur Hidayah, S.P.",
    slug: "cocopeat-media-tanam-hidroponik",
    is_featured: false,
    view_count: 8234,
    tags: ["cocopeat", "hidroponik", "media tanam", "pertanian"],
  },
  {
    id: "art-8",
    title: "Dampak Lingkungan Industri Kelapa Indonesia",
    excerpt: "Analisis dampak lingkungan industri kelapa Indonesia dan bagaimana praktik ekonomi sirkular dapat mengurangi limbah dan emisi karbon secara signifikan.",
    category: "Lingkungan",
    category_slug: "lingkungan",
    cover_image: "https://images.unsplash.com/photo-1557234195-bd9f290f3e2b?q=80&w=800&auto=format&fit=crop",
    read_time: 6,
    published_at: "2026-05-10T00:00:00Z",
    author_name: "Dr. Rina Susanti",
    slug: "dampak-lingkungan-industri-kelapa",
    is_featured: false,
    view_count: 3456,
    tags: ["lingkungan", "industri", "emisi", "sustainability"],
  },
];

// ============================================
// QUIZ DATA
// ============================================

export interface MockQuiz {
  id: string;
  title: string;
  description: string;
  questions: MockQuizQuestion[];
  pass_score: number;
  time_limit: number;
}

export interface MockQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

export const MOCK_QUIZ: MockQuiz = {
  id: "quiz-1",
  title: "Kuis Mingguan: Mengenal Produk Kelapa Indonesia",
  description: "Uji pengetahuan kamu tentang produk turunan kelapa dan ekonomi sirkular",
  pass_score: 70,
  time_limit: 300,
  questions: [
    {
      id: "q-1",
      question: "Apa yang dimaksud dengan VCO (Virgin Coconut Oil)?",
      options: [
        "Minyak kelapa yang diproses dengan pemanasan tinggi",
        "Minyak kelapa murni yang diproses tanpa pemanasan (cold-pressed)",
        "Minyak kelapa yang dicampur dengan minyak sawit",
        "Minyak kelapa untuk industri mesin",
      ],
      correct_answer: 1,
      explanation:
        "VCO atau Virgin Coconut Oil adalah minyak kelapa murni yang diekstrak dari daging kelapa segar tanpa proses pemanasan tinggi (cold-pressed), sehingga mempertahankan semua nutrisi alaminya.",
    },
    {
      id: "q-2",
      question: "Cocopeat berasal dari bagian kelapa yang mana?",
      options: ["Daging kelapa", "Air kelapa", "Serat sabut kelapa", "Tempurung kelapa"],
      correct_answer: 2,
      explanation:
        "Cocopeat adalah serbuk halus yang dihasilkan dari proses pengolahan sabut kelapa (coir). Cocopeat sangat baik sebagai media tanam karena mampu menyimpan air hingga 8-9 kali beratnya sendiri.",
    },
    {
      id: "q-3",
      question: "Berapa nilai kalor rata-rata briket kelapa premium?",
      options: [
        "2.000-3.000 kcal/kg",
        "4.000-5.000 kcal/kg",
        "6.500-7.500 kcal/kg",
        "9.000-10.000 kcal/kg",
      ],
      correct_answer: 2,
      explanation:
        "Briket kelapa premium memiliki nilai kalor 6.500-7.500 kcal/kg, jauh lebih tinggi dari batubara biasa (5.000-6.000 kcal/kg). Inilah yang membuatnya diminati untuk ekspor ke pasar BBQ internasional.",
    },
    {
      id: "q-4",
      question: "Apa manfaat utama ekonomi sirkular dalam industri kelapa?",
      options: [
        "Meningkatkan harga produk premium",
        "Menggunakan semua bagian kelapa sehingga meminimalkan limbah",
        "Mengurangi jumlah petani kelapa",
        "Mempercepat panen kelapa",
      ],
      correct_answer: 1,
      explanation:
        "Ekonomi sirkular dalam industri kelapa bertujuan memanfaatkan SELURUH bagian kelapa — daging, air, sabut, tempurung, dan daun — sehingga tidak ada yang terbuang sia-sia, menciptakan nilai maksimal dari setiap pohon.",
    },
    {
      id: "q-5",
      question: "Arang aktif (activated carbon) dari tempurung kelapa digunakan untuk apa?",
      options: [
        "Hanya untuk BBQ dan memasak",
        "Hanya untuk kosmetik",
        "Filtrasi air, farmasi, pemurnian gas, dan pengolahan limbah",
        "Bahan pewarna makanan",
      ],
      correct_answer: 2,
      explanation:
        "Arang aktif dari tempurung kelapa memiliki luas permukaan sangat tinggi (>1000 m²/g) yang membuatnya efektif untuk filtrasi air minum, pemurnian obat-obatan, adsorpsi gas industri, dan pengolahan limbah.",
    },
  ],
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getProductBySlug(slug: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  if (categorySlug === "semua") return MOCK_PRODUCTS;
  const category = MOCK_CATEGORIES.find((c) => c.slug === categorySlug);
  if (!category) return MOCK_PRODUCTS;
  return MOCK_PRODUCTS.filter((p) => p.category_id === category.id);
}

export function searchProducts(query: string): Product[] {
  if (!query.trim()) return MOCK_PRODUCTS;
  const q = query.toLowerCase();
  return MOCK_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return MOCK_PRODUCTS.filter(
    (p) => p.id !== product.id && p.category_id === product.category_id
  ).slice(0, limit);
}

export function getStoreBySlug(slug: string): Store | undefined {
  return MOCK_STORES.find((s) => s.slug === slug);
}

export function getStoreProducts(storeId: string): Product[] {
  return MOCK_PRODUCTS.filter((p) => p.store_id === storeId);
}

export function getProductReviews(productId: string): Review[] {
  return MOCK_REVIEWS.filter((r) => r.product_id === productId);
}

export function getFeaturedProducts(limit = 8): Product[] {
  return MOCK_PRODUCTS.filter((p) => p.is_featured).slice(0, limit);
}

export function getAIInsight(slug: string): AIInsight | null {
  return AI_INSIGHTS[slug] ?? null;
}
