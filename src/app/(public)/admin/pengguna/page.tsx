"use client";

import { useState } from "react";
import AdminLayout from "../layout";
import { Search, ShieldAlert, Check, UserMinus, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock users database for Admin Panel
const INITIAL_USERS = [
  { id: "usr-1", name: "Siti Aisyah", email: "user@nyiurnanggroe.id", role: "user", phone: "+62 811-234-567", status: "active", joinDate: "2025-01-15" },
  { id: "usr-2", name: "Ahmad Maulana", email: "seller@nyiurnanggroe.id", role: "seller", phone: "+62 822-345-678", status: "active", joinDate: "2024-08-10" },
  { id: "usr-3", name: "Admin Nyiur", email: "admin@nyiurnanggroe.id", role: "admin", phone: "+62 800-000-000", status: "active", joinDate: "2024-01-01" },
  { id: "usr-4", name: "Rian Saputra", email: "rian.s@gmail.com", role: "user", phone: "+62 812-445-987", status: "suspended", joinDate: "2025-03-12" },
  { id: "usr-5", name: "Fatimah Zahra", email: "fatimah.z@gmail.com", role: "user", phone: "+62 853-221-112", status: "active", joinDate: "2025-06-01" }
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "seller" | "admin">("all");

  const handleToggleStatus = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === "active" ? "suspended" : "active" };
      }
      return u;
    }));
  };

  const handlePromote = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, role: u.role === "user" ? "seller" : "admin" };
      }
      return u;
    }));
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus permanen pengguna ini?")) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
          <div>
            <h1 className="text-xl font-bold text-charcoal-800">Manajemen Pengguna</h1>
            <p className="text-xs text-charcoal-500 mt-0.5">Pantau data profil pelanggan, ganti wewenang role, atau tangguhkan akses akun bermasalah.</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-2xl border border-border/60">
          <div className="flex-1 flex items-center gap-2 border px-3.5 py-2.5 rounded-xl bg-mist/20">
            <Search className="w-4.5 h-4.5 text-charcoal-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari pengguna berdasarkan nama atau email..."
              className="bg-transparent border-none outline-none text-xs w-full text-charcoal placeholder:text-charcoal-350"
            />
          </div>
          <div className="flex gap-2.5 overflow-x-auto">
            {[
              { id: "all", label: "Semua Role" },
              { id: "user", label: "Pelanggan" },
              { id: "seller", label: "Penjual" },
              { id: "admin", label: "Admin" }
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => setRoleFilter(btn.id as any)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all",
                  roleFilter === btn.id
                    ? "bg-forest-600 border-forest-600 text-white shadow-sm"
                    : "bg-white border-border text-charcoal hover:bg-mist"
                )}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-3xl border border-border/60 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-mist/35 border-b border-border text-xs text-charcoal-500 font-bold uppercase">
                  <th className="px-5 py-4">Nama / Kontak</th>
                  <th className="px-5 py-4">Wewenang (Role)</th>
                  <th className="px-5 py-4">Tanggal Gabung</th>
                  <th className="px-5 py-4 text-center">Status</th>
                  <th className="px-5 py-4 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm">
                {filteredUsers.map(usr => (
                  <tr key={usr.id} className="hover:bg-mist/10 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-bold text-charcoal-850">{usr.name}</p>
                      <p className="text-[10px] text-charcoal-450 mt-0.5">{usr.email}</p>
                      <p className="text-[10px] text-charcoal-400 font-medium">{usr.phone}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize",
                        usr.role === "admin" && "bg-red-50 text-red-700 border-red-100",
                        usr.role === "seller" && "bg-forest-50 text-forest-750 border-forest-100",
                        usr.role === "user" && "bg-blue-50 text-blue-700 border-blue-100"
                      )}>
                        {usr.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-charcoal-500 font-medium">
                      {new Date(usr.joinDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                        usr.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-550/10 text-red-650 border-red-200"
                      )}>
                        {usr.status === "active" ? "Aktif" : "Ditangguhkan"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {usr.role !== "admin" && (
                          <button
                            onClick={() => handlePromote(usr.id)}
                            className="text-xs font-semibold text-forest-650 hover:text-forest-700 hover:underline"
                            title="Promote role"
                          >
                            Naik Role
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleStatus(usr.id)}
                          className={cn(
                            "text-xs font-semibold hover:underline",
                            usr.status === "active" ? "text-amber hover:text-amber-600" : "text-emerald-650 hover:text-emerald-705"
                          )}
                        >
                          {usr.status === "active" ? "Tangguhkan" : "Aktifkan"}
                        </button>
                        <button
                          onClick={() => handleDelete(usr.id)}
                          className="text-charcoal-350 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
