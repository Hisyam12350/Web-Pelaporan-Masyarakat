"use client";
import { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function AddAdmin() {
  const router = useRouter();
  const [admin, setAdmin] = useState({
    username: "",
    email: "",
    password: "",
    role: "admin",
  });

  async function createAdmin(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Proteksi Route
    if (!token || role === "admin" || role === "users") {
      window.location.href = "/";
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: admin.username,
          email: admin.email,
          password: admin.password,
          role: admin.role,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Admin baru telah didaftarkan!",
          confirmButtonColor: "#06B6D4",
        });
        router.push("/superAdmin/monitoring");
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
      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* TOP BAR / NAV */}
        <div className="p-6 md:p-10 pb-0 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 group text-slate-500 hover:text-cyan-600 transition-all"
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:bg-cyan-500 group-hover:text-white transition-all">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </div>
            <span className="font-black uppercase text-xs tracking-[0.2em]">
              Kembali
            </span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Authority
            </span>
            <span className="bg-rose-100 text-rose-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">
              Super Admin Only
            </span>
          </div>
        </div>

        {/* FORM CONTAINER */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-5xl bg-white rounded-[40px] shadow-xl shadow-cyan-900/5 border border-slate-100 overflow-hidden flex flex-col md:flex-row">
            {/* LEFT SIDE: INFO */}
            <div className="w-full md:w-5/12 bg-[#0F172A] p-10 md:p-12 text-white flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-cyan-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-cyan-500/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tighter leading-tight mb-4">
                  Tambah <br />
                  <span className="text-cyan-400">Administrator</span>
                </h2>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  Daftarkan staf baru untuk membantu mengelola sistem. Admin
                  baru akan memiliki akses terbatas sesuai kebijakan sistem.
                </p>
              </div>

              <div className="mt-12 space-y-4">
                <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-[0.1em]">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  Sistem Keamanan Aktif
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: FORM */}
            <div className="w-full md:w-7/12 p-10 md:p-16">
              <form onSubmit={createAdmin} className="space-y-6">
                {/* USERNAME */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Username Admin
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: alif_admin"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-[#0F172A] focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all"
                    value={admin.username}
                    onChange={(e) =>
                      setAdmin({ ...admin, username: e.target.value })
                    }
                  />
                </div>

                {/* EMAIL */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="admin@valoria.com"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-[#0F172A] focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all"
                    value={admin.email}
                    onChange={(e) =>
                      setAdmin({ ...admin, email: e.target.value })
                    }
                  />
                </div>

                {/* PASSWORD */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-[#0F172A] focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all"
                    value={admin.password}
                    onChange={(e) =>
                      setAdmin({ ...admin, password: e.target.value })
                    }
                  />
                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-cyan-500 hover:bg-[#0F172A] text-white font-black uppercase text-xs tracking-[0.2em] py-5 rounded-2xl shadow-lg shadow-cyan-500/20 transition-all transform active:scale-[0.98]"
                  >
                    Daftarkan Admin Sekarang
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
