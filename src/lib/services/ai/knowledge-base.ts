// ============================================================
// NYIUR NANGGROE — KNOWLEDGE BASE
// Basis Pengetahuan Lokal Ekonomi Sirkular Kelapa
// ============================================================

export interface KnowledgeSnippet {
  id: string;
  category: string;
  keywords: string[];
  title: string;
  content: string;
}

export const COCONUT_KNOWLEDGE_BASE: KnowledgeSnippet[] = [
  {
    id: "kb-001",
    category: "briket",
    keywords: ["briket", "arang", "tempurung", "briquette", "shisha", "ekspor"],
    title: "Pembuatan Briket Arang Kelapa Ekspor",
    content: "Briket arang tempurung kelapa berkualitas ekspor harus dibuat dari tempurung tua kering (kadar air < 12%). Proses pirolisis (pembakaran tanpa oksigen) menghasilkan arang murni. Arang ditumbuk halus, disaring mesh 60-80, lalu dicampur perekat tepung tapioka alami (sekitar 3-5%) untuk mempertahankan aroma netral dan abu putih saat dibakar. Pasar ekspor terbesar mencakup Timur Tengah (untuk shisha) dan Eropa/Amerika (untuk BBQ premium)."
  },
  {
    id: "kb-002",
    category: "cocopeat",
    keywords: ["cocopeat", "sabut", "coco peat", "media tanam", "hidroponik"],
    title: "Cocopeat sebagai Media Tanam Sirkular",
    content: "Cocopeat diperoleh dari penggilingan sabut kelapa (mesocarp) setelah serat kasarnya (cocofiber) dipisahkan. Cocopeat memiliki kemampuan menyerap air hingga 8-10 kali beratnya sendiri dan menyimpan nutrisi dengan baik. Untuk hidroponik, cocopeat harus melalui proses pencucian (washing) untuk menurunkan kadar garam/tanin (Electrical Conductivity < 0.5 mS/cm) agar tidak meracuni akar tanaman."
  },
  {
    id: "kb-003",
    category: "vco",
    keywords: ["vco", "virgin coconut oil", "minyak kelapa", "murni", "fermentasi"],
    title: "Virgin Coconut Oil (VCO) Tradisional dan Modern",
    content: "VCO diproduksi langsung dari santan kelapa segar tanpa melalui proses pemanasan suhu tinggi, pemutihan, atau penghilangan bau (non-RBD). Metode fermentasi dingin memanfaatkan bakteri asam laktat alami untuk memisahkan lapisan minyak dan protein santan secara alami dalam waktu 20-24 jam. VCO yang baik berwarna bening seperti air, beraroma kelapa segar yang lembut, dan kaya akan asam laurat yang meningkatkan daya tahan tubuh."
  },
  {
    id: "kb-004",
    category: "sirkular",
    keywords: ["sirkular", "circular", "dampak", "karbon", "co2", "limbah"],
    title: "Nilai Ekonomi Sirkular Kelapa",
    content: "Ekonomi sirkular kelapa memastikan tidak ada bagian dari pohon kelapa yang terbuang percuma (zero waste). Pengolahan 1 ton kelapa segar berpotensi menghasilkan 300kg sabut (diolah menjadi cocopeat dan cocofiber), 150kg tempurung (menjadi arang dan kerajinan), serta daging buahnya diolah menjadi minyak atau santan. Pengalihan limbah ini mengurangi emisi metana di TPA dan mengurangi jejak karbon hingga 1.8 kg CO2 per kg produk yang berhasil diselamatkan."
  },
  {
    id: "kb-005",
    category: "budidaya",
    keywords: ["budidaya", "tani", "hama", "pupuk", "bibit", "kelapa genjah", "kelapa dalam"],
    title: "Tips Budidaya Kelapa Produktif",
    content: "Varietas Kelapa Dalam memiliki tinggi hingga 30 meter dan berbuah setelah 6-8 tahun dengan masa produktif 60 tahun lebih (sangat cocok untuk santan/minyak). Kelapa Genjah lebih pendek, berbuah lebih cepat (3-4 tahun), dan cocok untuk air kelapa segar. Pemupukan harus menyertakan unsur Kalium (K) yang tinggi karena kelapa membutuhkan kalium untuk pembentukan buah dan ketahanan terhadap penyakit noda daun."
  },
  {
    id: "kb-006",
    category: "mitra",
    keywords: ["mitra", "jual", "daftar", "toko", "verifikasi", "akun"],
    title: "Pendaftaran Penjual (Mitra) Nyiur Nanggroe",
    content: "Untuk membuka toko di Nyiur Nanggroe, masuk ke halaman 'Daftar Mitra', isi data nama toko, slug toko unik, alamat lengkap, dan nomor kontak WhatsApp. Pengguna harus sudah memiliki profil terverifikasi dasar. Penjual dapat menaikkan status menjadi 'Mitra Terverifikasi' dengan mengunggah foto kualitas produk Grade A dan mempertahankan penilaian ulasan pembeli rata-rata di atas 4.5 bintang."
  }
];

/**
 * Mencari snippet pengetahuan berdasarkan kata kunci pada pertanyaan pengguna
 */
export function queryKnowledgeBase(question: string): string {
  const normalized = question.toLowerCase();
  const matchedSnippets: string[] = [];

  for (const snippet of COCONUT_KNOWLEDGE_BASE) {
    const hasMatch = snippet.keywords.some((keyword) => normalized.includes(keyword));
    if (hasMatch) {
      matchedSnippets.push(`[TOPIK: ${snippet.title}]\n${snippet.content}`);
    }
  }

  if (matchedSnippets.length === 0) {
    return "";
  }

  return `\n\nGunakan referensi pengetahuan internal berikut untuk menjawab jika relevan dengan pertanyaan:\n${matchedSnippets.join("\n\n")}`;
}
