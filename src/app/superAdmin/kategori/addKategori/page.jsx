"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function AddKategori() {
  const [form, setForm] = useState({
    name: "",
  });
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      window.location.href = "/login";
    }
    if (role === "admin" || role === "users") {
      window.location.href = "/";
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nama_kategori", form.name);

      const res = await fetch(`http://localhost:5000/api/kategori/create-category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nama_kategori: form.name }),
      });

      const data = await res.json();

      if (data.ok) {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data berhasil diubah!",
          confirmButtonColor: "#06B6D4",
        });
        router.push("/superAdmin/kategori");
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
    <div className="min-h-screen bg-[#F0F9FF] flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        {/* Tombol Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-cyan-600 font-bold mb-8 transition-colors group"
        >
          <div className="bg-white p-2 rounded-lg shadow-sm group-hover:shadow-md transition-all">
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
          <span>Kembali</span>
        </button>

        {/* Card Form */}
        <div className="bg-white rounded-[40px] p-10 shadow-2xl shadow-cyan-900/5 border border-white relative overflow-hidden">
          {/* Dekorasi Aksen */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50 rounded-full -mr-16 -mt-16 blur-2xl"></div>

          <div className="relative z-10">
            <div className="mb-8">
              <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">
                Kategori Baru
              </h1>
              <p className="text-slate-400 font-medium mt-2">
                Tambahkan kategori pengaduan baru ke sistem.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block ml-1">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  placeholder="Misal: Perbaikan Jalan"
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 font-bold text-slate-700 focus:border-cyan-500 focus:bg-white outline-none transition-all placeholder:text-slate-300 shadow-sm"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0F172A] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-cyan-600 shadow-xl shadow-cyan-900/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
              >
                <span>Simpan Kategori</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center mt-8 text-slate-400 text-xs font-medium">
          Pastikan nama kategori belum terdaftar untuk menghindari duplikasi.
        </p>
      </div>
    </div>
  );
}
