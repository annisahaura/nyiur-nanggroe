"use client";

import { useState } from "react";
import AdminLayout from "../layout";
import { Check, X, Shield, Search, ArrowRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock seller requests database
const INITIAL_REQUESTS = [
  {
    id: "req-1",
    storeName: "Minyak Kelapa Sejahtera",
    ownerName: "Faisal Amir",
    whatsapp: "081299887766",
    businessType: "perorangan",
    joinedDate: "2026-07-01",
    status: "pending",
    ktpNumber: "1101031204850001",
    description: "Memproduksi minyak VCO premium kelapa pesisir barat Aceh."
  },
  {
    id: "req-2",
    storeName: "Koperasi Nanggroe Lestari",
    ownerName: "Cut Nyak Meutia",
    whatsapp: "081344556677",
    businessType: "koperasi",
    joinedDate: "2026-06-30",
    status: "approved",
    ktpNumber: "1103041512900003",
    description: "Koperasi pengolah tempurung kelapa menjadi kerajinan & briket arang."
  }
];

export default function AdminSellersPage() {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("pending");
  const [selectedReqId, setSelectedReqId] = useState<string | null>("req-1");

  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        return { ...req, status: "approved" };
      }
      return req;
    }));
  };

  const handleReject = (id: string) => {
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        return { ...req, status: "rejected" };
      }
      return req;
    }));
  };

  const filteredRequests = requests.filter(r => filter === "all" || r.status === filter);
  const selectedRequest = requests.find(r => r.id === selectedReqId) || requests[0];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-charcoal-800">Manajemen Pengajuan Mitra Penjual</h1>
          <p className="text-xs text-charcoal-500 mt-0.5">Tinjau berkas identitas KTP dan tipe kepemilikan bisnis pemohon sebelum memberikan lencana penjual.</p>
        </div>

        {/* Toolbar */}
        <div className="flex gap-2.5 overflow-x-auto border-b pb-2">
          {[
            { id: "pending", label: "Menunggu Persetujuan" },
            { id: "approved", label: "Mitra Disetujui" },
            { id: "all", label: "Semua Pengajuan" }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id as any)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all",
                filter === btn.id
                  ? "bg-forest-600 border-forest-600 text-white shadow-sm"
                  : "bg-white border-border text-charcoal hover:bg-mist"
              )}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Requests List */}
          <div className="lg:col-span-1 bg-white border border-border/60 rounded-3xl p-4 space-y-3 h-[480px] overflow-y-auto flex flex-col justify-between scrollbar-none shadow-sm">
            <div className="space-y-1.5 flex-1">
              {filteredRequests.length === 0 ? (
                <p className="text-center text-xs text-charcoal-400 py-10 font-medium">Tidak ada pengajuan dalam kategori ini.</p>
              ) : (
                filteredRequests.map(req => (
                  <button
                    key={req.id}
                    onClick={() => setSelectedReqId(req.id)}
                    className={cn(
                      "w-full text-left p-3.5 rounded-2xl border transition-all space-y-1",
                      selectedReqId === req.id
                        ? "bg-forest-50 border-forest-300 shadow-sm"
                        : "border-border hover:bg-mist/10"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-xs font-bold text-charcoal-800 line-clamp-1">{req.storeName}</h3>
                      <span className={cn(
                        "text-[8px] font-bold px-2 py-0.5 rounded-full border capitalize",
                        req.status === "pending" && "bg-amber-50 text-amber-700 border-amber-100",
                        req.status === "approved" && "bg-forest-50 text-forest-750 border-forest-100",
                        req.status === "rejected" && "bg-red-50 text-red-700 border-red-100"
                      )}>
                        {req.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-charcoal-500 font-medium">Oleh: {req.ownerName}</p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Verification Details */}
          <div className="lg:col-span-2 bg-white border border-border/60 rounded-3xl p-6 shadow-sm min-h-[480px] flex flex-col justify-between">
            {selectedRequest ? (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h2 className="text-base font-bold text-charcoal-800">{selectedRequest.storeName}</h2>
                      <p className="text-[10px] text-charcoal-450 uppercase font-semibold">Tipe: {selectedRequest.businessType}</p>
                    </div>
                    <span className="text-[10px] text-charcoal-400 font-medium">Diajukan {new Date(selectedRequest.joinedDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="font-semibold text-charcoal-500">Nama Pemohon (KTP)</p>
                      <p className="font-bold text-charcoal-800 mt-0.5">{selectedRequest.ownerName}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-charcoal-500">NIK KTP</p>
                      <p className="font-mono font-bold text-charcoal-800 mt-0.5">{selectedRequest.ktpNumber}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-charcoal-500">Kontak WhatsApp</p>
                      <p className="font-bold text-charcoal-800 mt-0.5">{selectedRequest.whatsapp}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-charcoal-500">Berkas Pendukung</p>
                      <button className="text-forest-650 hover:text-forest-700 font-bold flex items-center gap-1 mt-1 hover:underline">
                        Lihat Foto KTP <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-charcoal-500">Deskripsi Bisnis</p>
                    <p className="text-xs text-charcoal-600 leading-relaxed italic">{selectedRequest.description}</p>
                  </div>
                </div>

                {selectedRequest.status === "pending" && (
                  <div className="flex gap-3 border-t pt-5 mt-auto">
                    <button
                      onClick={() => handleReject(selectedRequest.id)}
                      className="flex-1 border border-red-200 text-red-500 hover:bg-red-50 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <X className="w-4 h-4" /> Tolak Pengajuan
                    </button>
                    <button
                      onClick={() => handleApprove(selectedRequest.id)}
                      className="flex-1 bg-forest-600 hover:bg-forest-700 text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-forest-600/10"
                    >
                      <Check className="w-4 h-4" /> Setujui Mitra
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-charcoal-400 text-xs py-20">Pilih pengajuan untuk meninjau berkas.</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
