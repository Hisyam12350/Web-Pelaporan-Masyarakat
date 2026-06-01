"use client";

import Link from "next/link";
import { useState } from "react";
import Swal from "sweetalert2";

export default function RequestKategori() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [requestForm, setRequestForm] = useState({
    nama_kategori: "",
    alasan: "",
  });
  const [userId, setUserId] = useState(null);

  async function handleRequest() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("id");
    setUserId(id);

    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (role === "users") {
      window.location.href = "/home";
      return;
    } else if (role === "super admin") {
      window.location.href = "/superAdmin/dashboard";
      return;
    }

    const res = await fetch("http://localhost:5000/api/kategori", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestForm),
    });

    const data = await res.json();
    if (data.ok) {
      Swal.fire({
        icon: "success",
        title: "Request Terkirim!",
        confirmButtonColor: "#06B6D4",
      });
      setRequestForm({ nama_kategori: "", alasan: "" });
    }
  }
  return (
    <div className="min-h-screen bg-[#F0F9FF] flex font-sans">
      {/* --- SIDEBAR --- */}
      <aside
        className={`
    bg-[#0F172A] text-white
    transition-all duration-300 ease-in-out
    ${sidebarOpen ? "w-[280px] p-8 opacity-100" : "w-0 p-0 opacity-0"}
    overflow-hidden
    hidden md:flex flex-col shadow-2xl sticky top-0 h-screen
  `}
      >
        <div className={`${sidebarOpen ? "block" : "hidden"}`}>
          <div className="mb-12">
            <Link href="/admin/home">
              <h1 className="text-4xl font-extrabold whitespace-nowrap tracking-tight">
                LAPOR<span className="text-[#06B6D4]">!</span>
              </h1>
            </Link>
            <p className="text-cyan-400 text-sm font-medium mt-1 uppercase tracking-wider whitespace-nowrap">
              Super Admin Panel
            </p>
          </div>

          <nav className="flex flex-col gap-3">
            {/* Tombol Home - Mengikuti style tombol pasif agar konsisten dengan yang atas jika sedang di Dashboard */}
            <Link href="/admin/home">
              <button className="hover:bg-slate-800 px-6 py-4 rounded-2xl text-left transition whitespace-nowrap w-full text-slate-300 hover:text-white font-medium">
                Home
              </button>
            </Link>

            {/* Tombol Dashboard - Menjadi tombol Aktif (Biru) sesuai struktur kode pertama */}
            <Link href="/admin/dashboard">
              <button className="hover:bg-slate-800 px-6 py-4 rounded-2xl text-left transition whitespace-nowrap w-full text-slate-300 hover:text-white font-medium">
                Dashboard
              </button>
            </Link>

            <button className="bg-[#06B6D4] text-white px-6 py-4 rounded-2xl text-left font-bold whitespace-nowrap shadow-lg shadow-cyan-900/20 w-full">
              Request Kategori
            </button>

            <Link href={`/admin/profile/${userId}`}>
              <button className="hover:bg-slate-800 px-6 w-full py-4 rounded-2xl text-left transition whitespace-nowrap text-slate-300 hover:text-white font-medium">
                Profile
              </button>
            </Link>
          </nav>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* HEADER TOP (Toggle & Title) */}
        <div className="flex items-center gap-6 mb-12">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-white shadow-md shadow-cyan-100 p-4 rounded-2xl hover:bg-cyan-50 transition border border-cyan-50"
          >
            <div className="flex flex-col gap-1.5">
              <span className="w-6 h-[2.5px] bg-[#06B6D4] rounded"></span>
              <span className="w-4 h-[2.5px] bg-[#0891B2] rounded"></span>
              <span className="w-6 h-[2.5px] bg-[#06B6D4] rounded"></span>
            </div>
          </button>
          <div>
            <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">
              Request Kategori
            </h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
              System Configuration
            </p>
          </div>
        </div>

        {/* FORM CONTAINER */}
        <div className="max-w-3xl">
          <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-cyan-900/5 border border-white relative overflow-hidden">
            {/* Dekorasi Latar Belakang */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-50 rounded-full blur-3xl opacity-60"></div>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-8 relative z-10"
            >
              {/* Input Nama Kategori */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block ml-1">
                  Nama Kategori Baru
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-6 flex items-center text-xl group-focus-within:scale-110 transition-transform">
                    🏷️
                  </span>
                  <input
                    type="text"
                    placeholder="Misal: Perbaikan Jalan, Limbah B3..."
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-[24px] px-14 py-5 font-bold text-slate-700 focus:border-cyan-500 focus:bg-white outline-none transition-all placeholder:text-slate-300 shadow-sm"
                    value={requestForm.nama_kategori}
                    onChange={(e) =>
                      setRequestForm({
                        ...requestForm,
                        nama_kategori: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Textarea Alasan */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block ml-1">
                  Alasan Pengajuan (Justifikasi)
                </label>
                <textarea
                  placeholder="Berikan alasan mengapa kategori ini mendesak untuk ditambahkan..."
                  rows="6"
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-[32px] px-8 py-6 font-bold text-slate-700 focus:border-cyan-500 focus:bg-white outline-none transition-all placeholder:text-slate-300 resize-none shadow-sm"
                  value={requestForm.alasan}
                  onChange={(e) =>
                    setRequestForm({ ...requestForm, alasan: e.target.value })
                  }
                />
              </div>

              {/* Alert Box */}
              <div className="flex items-start gap-4 bg-amber-50 rounded-3xl p-6 border border-amber-100">
                <span className="text-2xl">⚠️</span>
                <p className="text-xs text-amber-800 font-bold leading-relaxed">
                  PENTING: Pastikan Anda telah memeriksa daftar kategori yang
                  sudah ada untuk menghindari duplikasi data sebelum mengirim
                  permintaan ini.
                </p>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleRequest}
                className="w-full bg-[#0F172A] text-white py-6 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] hover:bg-cyan-600 shadow-xl shadow-cyan-900/10 transition-all active:scale-[0.97] flex items-center justify-center gap-3 group"
              >
                <span>Kirim Permintaan</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
