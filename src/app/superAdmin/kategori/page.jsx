"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Kategori() {
  const [requests, setRequests] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userId, setUserId] = useState(null);
  const [kategoris, setKategoris] = useState([]);

  useEffect(() => {
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
    } else if (role === "admin") {
      window.location.href = "/admin/dashboard";
      return;
    }

    fetch("http://localhost:5000/api/kategori/get-request", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => setRequests(json.data || []));

    fetch("http://localhost:5000/api/kategori", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => setKategoris(json.data || []));
  }, []);

  async function handleUpdate(id, status) {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5000/api/kategori/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();
    if (data.ok) {
      Swal.fire({
        icon: "success",
        title: `Request ${status}!`,
        confirmButtonColor: "#06B6D4",
      });
      // refresh
      setRequests(requests.map((r) => (r.id === id ? { ...r, status } : r)));
    }
  }

  async function handleDelete(id) {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:5000/api/kategori/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.ok) {
        Swal.fire({
          icon: "success",
          title: "Kategori Dihapus!",
          confirmButtonColor: "#06B6D4",
        });
        setKategoris(kategoris.filter((k) => k.id !== id));
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: data.message || "Terjadi kesalahan",
          confirmButtonColor: "#06B6D4",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan",
        text: "Tidak dapat terhubung ke server.",
      });
    }
  }

  return (
    <div className="min-h-screen bg-[#F0F9FF] flex font-sans overflow-hidden">
      {/* --- SIDEBAR --- */}
      <aside
        className={`bg-[#0F172A] text-white transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-[280px] p-8 opacity-100" : "w-0 p-0 opacity-0"
        } overflow-hidden hidden md:flex flex-col shadow-2xl sticky top-0 h-screen`}
      >
        <div className={`${sidebarOpen ? "block" : "hidden"}`}>
          <div className="mb-12">
            <Link href="/dashboard">
              <h1 className="text-4xl font-extrabold whitespace-nowrap tracking-tight">
                LAPOR<span className="text-[#06B6D4]">!</span>
              </h1>
            </Link>
            <p className="text-cyan-400 text-sm font-medium mt-1 uppercase tracking-wider whitespace-nowrap">
              Super Admin Panel
            </p>
          </div>

          <nav className="flex flex-col gap-3">
            <Link href="/superAdmin/home">
              <button className="hover:bg-slate-800 px-6 py-4 rounded-2xl text-left transition whitespace-nowrap w-full text-slate-300 hover:text-white font-medium">
                Home
              </button>
            </Link>
            <Link href="/superAdmin/dashboard">
              <button className="hover:bg-slate-800 px-6 py-4 rounded-2xl text-left transition whitespace-nowrap w-full text-slate-300 hover:text-white font-medium">
                Dashboard
              </button>
            </Link>

            <button className="bg-[#06B6D4] text-white px-6 py-4 rounded-2xl text-left font-bold whitespace-nowrap shadow-lg shadow-cyan-900/20 w-full">
              Kategori
            </button>

            <Link href="/superAdmin/monitoring">
              <button className="hover:bg-slate-800 px-6 py-4 rounded-2xl text-left transition whitespace-nowrap w-full text-slate-300 hover:text-white font-medium">
                Monitoring
              </button>
            </Link>
            <Link href={`/superAdmin/profile/${userId}`}>
              <button className="hover:bg-slate-800 px-6 w-full py-4 rounded-2xl text-left transition whitespace-nowrap text-slate-300 hover:text-white font-medium">
                Profile
              </button>
            </Link>
          </nav>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* HEADER TOP - Fixed at top */}
        <div className="p-6 md:p-10 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="bg-white shadow-md shadow-cyan-100 p-3 rounded-xl hover:bg-cyan-50 transition border border-cyan-50"
            >
              <div className="flex flex-col gap-1">
                <span className="w-5 h-[2px] bg-[#06B6D4] rounded"></span>
                <span className="w-3 h-[2px] bg-[#0891B2] rounded"></span>
                <span className="w-5 h-[2px] bg-[#06B6D4] rounded"></span>
              </div>
            </button>
            <div>
              <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">
                Manajemen Kategori
              </h1>
              <p className="text-slate-500 text-sm font-medium">
                Pantau dan setujui kategori sistem
              </p>
            </div>
          </div>

          <Link href="/superAdmin/kategori/addKategori">
            <button className="bg-[#0F172A] hover:bg-cyan-700 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 shadow-xl transition-all active:scale-95 text-xs uppercase tracking-widest">
              <span className="text-lg">+</span> Tambah Kategori
            </button>
          </Link>
        </div>

        {/* TWO COLUMN LAYOUT - Scrollable content area */}
        <div className="flex-1 px-6 md:px-10 pb-10 overflow-hidden">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-full">
            {/* LEFT COLUMN: DAFTAR KATEGORI AKTIF (4/12) */}
            <div className="xl:col-span-4 flex flex-col h-full overflow-hidden">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-black text-[#0F172A] uppercase text-xs tracking-[0.2em]">
                  Kategori Aktif
                </h3>
                <span className="bg-cyan-100 text-cyan-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {kategoris.length} Total
                </span>
              </div>

              {/* Internal Scroll Left */}
              <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar bg-white/30 rounded-[32px] p-2">
                {kategoris
                  .slice()
                  .reverse()
                  .map((kat) => (
                    <div
                      key={kat.id}
                      className="bg-white p-4 rounded-[20px] shadow-sm flex items-center justify-between border border-transparent hover:border-cyan-100 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 group-hover:scale-150 transition-transform"></div>
                        <span className="font-bold text-slate-700">
                          {kat.nama_kategori}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDelete(kat.id)}
                        className="text-slate-300 hover:text-rose-500 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* RIGHT COLUMN: DAFTAR REQUEST (8/12) */}
            <div className="xl:col-span-8 flex flex-col h-full overflow-hidden">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-black text-[#0F172A] uppercase text-xs tracking-[0.2em]">
                  Permintaan Terbaru
                </h3>
              </div>

              {/* Internal Scroll Right */}
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {requests
                    .slice()
                    .sort((a, b) => b.id - a.id)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-100 transition-all hover:shadow-md group relative flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-500 font-black text-sm">
                                {item.username?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                                  Admin: {item.username}
                                </p>
                                <h2 className="text-lg font-black text-[#0F172A] group-hover:text-cyan-600 transition-colors">
                                  {item.nama_kategori}
                                </h2>
                              </div>
                            </div>
                            <span
                              className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter ${
                                item.status === "disetujui"
                                  ? "bg-emerald-50 text-emerald-600"
                                  : item.status === "ditolak"
                                    ? "bg-rose-50 text-rose-600"
                                    : "bg-amber-50 text-amber-600"
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>

                          <div className="bg-slate-50/80 rounded-2xl p-4 mb-4 border border-slate-50">
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 opacity-50">
                              Alasan:
                            </p>
                            <p className="text-slate-600 text-xs italic leading-relaxed font-medium">
                              "{item.alasan}"
                            </p>
                          </div>
                        </div>

                        {item.status === "menunggu" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdate(item.id, "disetujui")}
                              className="flex-1 bg-[#0F172A] hover:bg-emerald-600 text-white py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-slate-200"
                            >
                              Setujui
                            </button>
                            <button
                              onClick={() => handleUpdate(item.id, "ditolak")}
                              className="flex-1 bg-white border border-slate-200 hover:border-rose-200 hover:text-rose-600 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all text-slate-400"
                            >
                              Tolak
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                </div>

                {/* Empty State */}
                {requests.length === 0 && (
                  <div className="bg-white/40 border-2 border-dashed border-slate-200 rounded-[32px] py-12 text-center">
                    <p className="text-slate-400 font-bold italic">
                      Tidak ada permintaan kategori masuk.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
