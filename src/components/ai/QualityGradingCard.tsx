"use client";

import { useState, useEffect } from "react";
import { Upload, Camera, AlertTriangle, Sparkles, Loader2, Award, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export function QualityGradingCard() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [preview, setPreview] = useState<string | null>(null);
  const [isGrading, setIsGrading] = useState(false);
  const [report, setReport] = useState<any | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load history grading laporan
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/ai/grade");
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch {
      // ignore
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setError(null);
    setFile(selected);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selected);
  };

  const runGrading = async () => {
    if (!file || isGrading) return;

    setIsGrading(true);
    setError(null);
    setReport(null);

    try {
      const formData = new FormData();
      formData.append("image", file);
      // Kirim URL palsu untuk keperluan data statis atau database
      formData.append("imageUrl", preview || "/placeholder-product.jpg");

      const res = await fetch("/api/ai/grade", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gagal memproses penilaian kualitas.");
      }

      const reportData = await res.json();
      setReport(reportData);
      fetchHistory(); // Perbarui riwayat
    } catch (err: any) {
      setError(err.message || "Gagal menghubungi layanan AI.");
    } finally {
      setIsGrading(false);
    }
  };

  const clearSelection = () => {
    setFile(null);
    setPreview(null);
    setReport(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Grading Dropzone & Editor */}
      <div className="bg-white rounded-3xl p-6 border border-border shadow-sm space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-charcoal flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Penilaian Kualitas AI (Quality Grading)
          </h2>
          <p className="text-xs text-charcoal-400 mt-1 leading-relaxed">
            Unggah foto produk kelapa Anda (misal briket, cocopeat, VCO) untuk memperoleh laporan penilaian fisik, kelayakan pasar ekspor, serta rekomendasi optimasi visual.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload Box */}
          <div className="space-y-4">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-cream flex flex-col items-center justify-center border-2 border-dashed border-border group hover:border-forest-400 transition-colors">
              {preview ? (
                <>
                  <Image src={preview} alt="Pratinjau produk" fill className="object-contain" />
                  <button
                    onClick={clearSelection}
                    className="absolute top-3 right-3 p-2 bg-charcoal-800/80 hover:bg-charcoal-900 text-white rounded-xl backdrop-blur-sm transition-colors"
                  >
                    Hapus
                  </button>
                </>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center p-6 text-center w-full h-full">
                  <Camera className="w-10 h-10 text-charcoal-300 group-hover:text-forest-500 group-hover:scale-110 transition-all duration-300" />
                  <span className="text-xs font-bold text-charcoal-600 mt-3 block">
                    Pilih atau Jatuhkan Foto Produk
                  </span>
                  <span className="text-[10px] text-charcoal-400 mt-1 block">
                    Format JPG, PNG, atau WebP (Maksimal 5MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {preview && !report && (
              <button
                onClick={runGrading}
                disabled={isGrading}
                className="w-full py-3 bg-forest-600 hover:bg-forest-500 disabled:opacity-50 text-white text-xs font-bold rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
              >
                {isGrading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Nyai Nyiur Sedang Menganalisis...
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" />
                    Analisis Kualitas Produk
                  </>
                )}
              </button>
            )}
          </div>

          {/* Results Analysis */}
          <div className="space-y-4">
            {report ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4 bg-mist/30 p-5 rounded-2xl border border-border/80"
              >
                {/* Score Header */}
                <div className="flex items-center gap-4 border-b border-border pb-4">
                  <div className="w-16 h-16 rounded-2xl bg-forest-100 flex flex-col items-center justify-center text-forest-700">
                    <span className="text-[10px] font-bold block uppercase tracking-wider">
                      GRADE
                    </span>
                    <span className="text-3xl font-extrabold block">
                      {report.overall_grade}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-charcoal-400 font-bold block uppercase tracking-wider">
                      Skor Presentasi
                    </span>
                    <span className="text-2xl font-extrabold text-charcoal-700 block mt-0.5">
                      {report.presentation_score} / 100
                    </span>
                  </div>
                </div>

                {/* Parameters Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-border/60">
                    <span className="text-[9px] text-charcoal-400 font-bold block uppercase">
                      Estimasi Air
                    </span>
                    <span className="font-extrabold text-charcoal-700 mt-1 block">
                      {report.moisture_estimate}
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-border/60">
                    <span className="text-[9px] text-charcoal-400 font-bold block uppercase">
                      Kondisi Fisik
                    </span>
                    <span className="font-extrabold text-charcoal-700 mt-1 block truncate" title={report.surface_condition}>
                      {report.surface_condition}
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-border/60">
                    <span className="text-[9px] text-charcoal-400 font-bold block uppercase">
                      Warna
                    </span>
                    <span className="font-extrabold text-charcoal-700 mt-1 block">
                      {report.color_consistency}
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-border/60">
                    <span className="text-[9px] text-charcoal-400 font-bold block uppercase">
                      Potensi Pasar
                    </span>
                    <span className="font-extrabold text-forest-700 mt-1 block flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-forest-500" />
                      {report.potential_market}
                    </span>
                  </div>
                </div>

                {/* Suggestions List */}
                <div>
                  <span className="text-[10px] text-charcoal-400 font-bold block uppercase tracking-wider">
                    Saran Perbaikan Visual
                  </span>
                  <ul className="mt-2 space-y-1 text-xs text-charcoal-600">
                    {report.suggestions.map((sug: string, i: number) => (
                      <li key={i} className="flex gap-2 items-start">
                        <span className="text-amber-500 mt-0.5">•</span>
                        <span>{sug}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Detailed Explanation */}
                <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl">
                  <span className="text-[9px] text-amber-700 font-bold block uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                    Penjelasan Analisis AI
                  </span>
                  <p className="text-[11px] text-charcoal-600 mt-1 leading-relaxed">
                    {report.explanation}
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[300px] border border-dashed border-border rounded-2xl flex flex-col items-center justify-center p-6 text-center text-charcoal-400">
                <Award className="w-12 h-12 text-charcoal-200" />
                <p className="text-xs font-bold mt-3">Hasil Penilaian Mutu Produk</p>
                <p className="text-[10px] mt-1">Laporan kualitas produk akan ditampilkan di sini setelah analisis selesai.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* History Reports */}
      {history.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-border shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-charcoal">Riwayat Penilaian Produk</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border text-charcoal-400">
                  <th className="py-2.5">Foto</th>
                  <th className="py-2.5">Grade</th>
                  <th className="py-2.5">Skor</th>
                  <th className="py-2.5">Kelembapan</th>
                  <th className="py-2.5">Pasar Potensial</th>
                  <th className="py-2.5">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {history.map((rep) => (
                  <tr key={rep.id} className="border-b border-border/40 hover:bg-mist/10">
                    <td className="py-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-border bg-cream">
                        <Image src={rep.image_url} alt="Produk" fill className="object-cover" />
                      </div>
                    </td>
                    <td className="py-3 font-extrabold text-sm">{rep.overall_grade}</td>
                    <td className="py-3 font-bold text-charcoal-700">{rep.presentation_score}</td>
                    <td className="py-3 text-charcoal-600">{rep.moisture_estimate}</td>
                    <td className="py-3 text-forest-700 font-semibold">{rep.potential_market}</td>
                    <td className="py-3 text-charcoal-400">
                      {new Date(rep.created_at).toLocaleDateString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
