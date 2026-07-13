# 🌿 Nyiur Nanggroe Design System & UI Engineering Guideline

Selamat datang di Panduan Sistem Desain Nyiur Nanggroe. Panduan ini dirancang untuk memastikan seluruh komponen digital platform terasa kohesif, premium, responsif, dan mudah diakses oleh semua pengguna (petani kelapa, UMKM, pembeli, dan administrator).

Sistem desain ini menggunakan prinsip minimalis modern yang terinspirasi oleh produk kelas dunia seperti Apple, Stripe, Airbnb, Notion, dan Etsy.

---

## 🎨 1. Identitas Visual & Warna

Kami menggunakan palet warna alami yang mencerminkan kepercayaan, sustainability (keberlanjutan), dan kehangatan. Semua variabel warna terikat pada CSS custom properties dan mendukung Light/Dark theme.

| Token | Light Mode | Dark Mode | Deskripsi |
|---|---|---|---|
| `Primary` | Forest Green (`hsl(153 38% 16%)`) | Leaf Green (`hsl(153 38% 30%)`) | Warna brand utama, dominan pada tombol & judul |
| `Secondary` | Mist/Warm Gray (`hsl(38 18% 93%)`) | Slate Dark (`hsl(240 5% 15%)`) | Warna sekunder untuk latar komponen & tombol pasif |
| `Accent` | Natural Brown (`hsl(30 50% 52%)`) | Soft Gold (`hsl(30 45% 58%)`) | Highlight visual, badge premium, & branding kelapa |
| `Background` | Cream White (`hsl(40 50% 97%)`) | Deep Gray (`hsl(240 10% 7%)`) | Warna latar belakang utama halaman |
| `Cards` | Pure White (`hsl(0 0% 100%)`) | Dark Charcoal (`hsl(240 7% 10%)`) | Latar belakang box, card, & modul navigasi |
| `Borders` | Light Soft Gray (`hsl(38 18% 88%)`) | Slate border (`hsl(240 6% 16%)`) | Pembatas visual yang tipis & elegan |

### Semantic State Colors
- **Success**: Green (`#2D6A4F` / `#3A9A6E`) — Konfirmasi aksi sukses & status eco-impact.
- **Warning**: Amber (`#E09A3C` / `#EFB96B`) — Pemberitahuan peringatan.
- **Error**: Red (`#destructive`) — Validasi gagal, aksi berbahaya, & pembatalan.
- **Info**: Blue (`#3B82F6`) — Informasi umum.

---

## 📐 2. Spacing System (Sistem Spasi)

Untuk menciptakan ritme vertikal yang konsisten, kami menerapkan **8-point Spacing System**. Hindari penentuan margin atau padding secara acak.

| Nilai (rem / px) | Tailwind Class | Penggunaan Utama |
|---|---|---|
| `0.25rem` (4px) | `p-1` / `m-1` | Spasi mikro antar ikon dan teks kecil |
| `0.5rem` (8px) | `p-2` / `m-2` | Padding dalam tombol kecil / list dropdown |
| `1rem` (16px) | `p-4` / `m-4` | Padding standar card & form input spacing |
| `1.5rem` (24px) | `p-6` / `m-6` | Margin horizontal container mobile & card besar |
| `2rem` (32px) | `p-8` / `m-8` | Padding dalam section hero & form grouping |
| `2.5rem` (40px) | `p-10` / `m-10` | Spasi antar modul besar |
| `3rem` (48px) | `p-12` / `m-12` | Spasi atas-bawah section halaman utama |

---

## 🅰️ 3. Typography Scale (Skala Tipografi)

Sistem tipografi Nyiur Nanggroe hanya menggunakan dua keluarga font (sans-serif) demi mempertahankan readability tingkat tinggi.
- **Display & Headings**: `Plus Jakarta Sans` (`--font-plus-jakarta`)
- **Body & Controls**: `Inter` (`--font-inter`)
- **Code & Tech Specs**: `JetBrains Mono` (`--font-jetbrains`)

### Skala Tipografi
1. **Display 2XL**: `4.5rem` / `72px` (Line height: 1.1) — Hero title utama desktop
2. **Heading 1**: `2.25rem` / `36px` (Line height: 1.2) — Judul utama halaman
3. **Heading 2**: `1.875rem` / `30px` (Line height: 1.25) — Judul section
4. **Heading 3**: `1.5rem` / `24px` (Line height: 1.3) — Sub-section / Judul card besar
5. **Body Large**: `1.125rem` / `18px` (Line height: 1.5) — Teks pembuka / intro artikel
6. **Body Medium**: `0.875rem` / `14px` (Line height: 1.5) — Teks body utama & deskripsi produk
7. **Body Small**: `0.75rem` / `12px` (Line height: 1.6) — Helper text, meta info, & tags
8. **Button Text**: `0.875rem` / `14px` (Semi-bold) — Label tombol aksi

---

## 🔲 4. Grid System (Sistem Grid)

Layout beradaptasi secara otomatis pada breakpoint layar berikut:
- **Desktop (>= 1024px)**: 12-column grid dengan margin `24px` (`container-base`)
- **Tablet (768px - 1023px)**: 8-column grid dengan margin `16px`
- **Mobile (< 768px)**: 4-column grid dengan margin `16px`

Gunakan container pembatas:
- `.container-base` (max-width `1280px`) — Untuk halaman transaksional & e-commerce.
- `.container-narrow` (max-width `860px`) — Halaman edukasi, bacaan artikel, & form login.

---

## 🪙 5. Border Radius & Shadows

Kami menggunakan sudut membulat secara konsisten untuk memberikan kesan modern, ramah lingkungan, dan premium.
- **Small (`rounded-lg` / `8px`)**: Tombol kecil, dropdown menu items, & mini badges.
- **Medium (`rounded-xl` / `12px`)**: Tombol utama, input teks, & product cards.
- **Large (`rounded-2xl` / `16px`)**: Halaman modul dashboard, dialog box, & dialog modal.
- **Extra Large (`rounded-3xl` / `24px`)**: Banner utama, section hero background, & footer.

### Shadow (Elevasi)
- **Subtle Shadow (`shadow-sm`)**: Untuk elemen sejajar halaman yang membutuhkan kedalaman minimal.
- **Floating Shadow (`shadow-glass-lg`)**: Untuk dialog, menu dropdown, navbar on scroll, & mascot Nyai Nyiur.

---

## ⚡ 6. Motion & Micro-Interactions

Interaksi transisi menggunakan library **Framer Motion** dengan durasi super cepat agar terasa instan dan responsif.
- **Hover Lift**: Saat card disentuh kursor, geser ke atas sebanyak `y: -6px` dengan shadow yang membesar secara halus menggunakan efek spring transition.
- **Active Scale**: Tombol mengecil ke `scale: 0.98` saat diklik memberikan feedback haptic visual instan.
- **Modal Pop**: Dialog muncul dengan fade-in opacity (`0` ke `1`) dibarengi scale-up halus (`0.95` ke `1`).
- **Skeleton Shimmer**: Gunakan gradient linear beranimasi menyapu secara horizontal dengan siklus `2s` untuk menggantikan gambar/konten yang sedang di-load.

---

## ⌨️ 7. Accessibility (Aksesibilitas)

Platform wajib mematuhi standar aksesibilitas dasar:
1. **Focus States**: Setiap elemen interaktif wajib memiliki focus ring yang kontras (`focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`).
2. **Keyboard Navigation**: Dialog modal & dropdown menu harus bisa dibuka, dinavigasi dengan tombol panah/Tab, dan ditutup dengan tombol `Escape`.
3. **Screen Readers**: Gunakan tag semantic HTML (`main`, `nav`, `section`, `header`, `footer`) serta atribut `aria-label` untuk elemen non-teks seperti tombol ikon.
4. **Contrast**: Kontras rasio teks minimal `4.5:1` sesuai dengan standar WCAG AA.

---

## ✏️ 8. Copywriting & Bahasa

Gunakan gaya bahasa Indonesia yang **ramah, ringkas, transparan, dan berorientasi pada aksi**.
- Hindari istilah teknis yang rumit di area publik (misal: gunakan "Nilai Kualitas Kelapa" bukan "Metode Inferensi Citra Multi-Skala").
- Tombol aksi wajib berupa kata kerja spesifik (misal: "Beli Sekarang", "Unduh Laporan", "Cari Produk") bukan kata pasif yang tidak jelas ("Klik di Sini", "Lanjutkan").
