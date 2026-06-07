"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function TambahLaporan() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { id } = useParams();
  const router = useRouter();
  const [kategori, setKategori] = useState([]);
  const [form, setForm] = useState({
    judul: "",
    deskripsi: "",
    lokasi: "",
    kategori_id: "",
    status: "menunggu",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      window.location.href = "/login";
      return;
    } else if (role === "admin") {
      window.location.href = "/admin/home";
      return;
    } else if (role === "super admin") {
      window.location.href = "/superAdmin/home";
      return;
    }

    fetch("http://localhost:5000/api/kategori", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setKategori(json.data || []);
      });
  }, []);

  async function tambahLaporan() {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const formData = new FormData();
      formData.append("judul", form.judul);
      formData.append("deskripsi", form.deskripsi);
      formData.append("lokasi", form.lokasi);
      formData.append("kategori_id", form.kategori_id);
      formData.append("status", form.status);
      if (form.image) formData.append("image", form.image);

      const res = await fetch(`http://localhost:5000/api/laporan`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (data.ok) {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data berhasil ditambahkan!",
          confirmButtonColor: "#06B6D4",
        });
        router.push(`/laporan-saya/${id}`);
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
    <main className="flex min-h-screen bg-[#F0F9FF] font-sans">
      {/* SIDEBAR (Konsisten) */}
      <aside
        className={`bg-[#0F172A] text-white transition-all duration-300 ease-in-out ${sidebarOpen ? "w-[280px] p-8 opacity-100" : "w-0 p-0 opacity-0"} overflow-hidden hidden md:flex flex-col shadow-2xl sticky top-0 h-screen`}
      >
        <div className={`${sidebarOpen ? "block" : "hidden"}`}>
          <div className="mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight">
              LAPOR<span className="text-[#06B6D4]">!</span>
            </h1>
            <p className="text-cyan-400 text-sm font-medium mt-1 uppercase tracking-wider">
              Pengaduan Masyarakat
            </p>
          </div>
          <nav className="flex flex-col gap-3">
            <Link href="/home">
              <button className="hover:bg-slate-800 px-6 py-4 rounded-2xl text-left transition w-full text-slate-300 hover:text-white font-medium">
                Home
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="hover:bg-slate-800 px-6 py-4 rounded-2xl text-left transition w-full text-slate-300 hover:text-white font-medium">
                Dashboard
              </button>
            </Link>
            <Link href={`/laporan-saya/${id}`}>
              <button className="hover:bg-slate-800 w-full px-6 py-4 rounded-2xl text-left transition text-slate-300 hover:text-white font-medium">
                Laporan Saya
              </button>
            </Link>
            <Link href={`/profile/${id}`}>
              <button className="hover:bg-slate-800 w-full px-6 py-4 rounded-2xl text-left transition text-slate-300 hover:text-white font-medium">
                Profile
              </button>
            </Link>
          </nav>
        </div>
      </aside>

      <section className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* TOPBAR */}
        <div className="flex items-center gap-6 mb-10">
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
          <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">
            Buat Laporan
          </h1>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[40px] shadow-xl shadow-cyan-100/50 overflow-hidden border border-cyan-50">
            {/* Header Form */}
            <div className="bg-[#0F172A] p-8 md:p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-black italic">
                  Sampaikan Keluhan Anda
                </h2>
                <p className="text-slate-400 mt-2 font-medium">
                  Laporan yang lengkap mempercepat proses tindak lanjut.
                </p>
              </div>
            </div>

            {/* Body Form */}
            <form className="p-8 md:p-12 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Judul Laporan */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-[#0F172A] uppercase tracking-[0.2em] ml-1">
                    Judul Laporan
                  </label>
                  <input
                    type="text"
                    onChange={(e) =>
                      setForm({ ...form, judul: e.target.value })
                    }
                    placeholder="Contoh: Jalan Berlubang di Jl. Merdeka"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-cyan-400 outline-none transition-all font-semibold text-[#0F172A]"
                  />
                </div>

                {/* Lokasi Kejadian */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-[#0F172A] uppercase tracking-[0.2em] ml-1">
                    Lokasi Kejadian
                  </label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg">
                      📍
                    </span>
                    <input
                      type="text"
                      onChange={(e) =>
                        setForm({ ...form, lokasi: e.target.value })
                      }
                      placeholder="Masukkan alamat lengkap"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 focus:ring-2 focus:ring-cyan-400 outline-none transition-all font-semibold text-[#0F172A]"
                    />
                  </div>
                </div>
              </div>

              {/* Isi Laporan */}
              <div className="space-y-3">
                <label className="text-xs font-black text-[#444954] uppercase tracking-[0.2em] ml-1">
                  Detail Laporan
                </label>
                <textarea
                  rows="5"
                  onChange={(e) =>
                    setForm({ ...form, deskripsi: e.target.value })
                  }
                  placeholder="Ceritakan kronologi atau detail masalah secara lengkap..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-[30px] px-6 py-5 focus:ring-2 focus:ring-cyan-400 outline-none transition-all font-semibold text-[#0F172A] resize-none"
                ></textarea>
              </div>
              {/* Tambahkan ini di dalam <form> sebelum bagian Upload Gambar */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Dropdown Kategori */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-[#0F172A] uppercase tracking-[0.2em] ml-1">
                    Kategori Laporan
                  </label>
                  <div className="relative">
                    <select
                      onChange={(e) =>
                        setForm({ ...form, kategori_id: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-cyan-400 outline-none transition-all font-semibold text-[#0F172A] appearance-none cursor-pointer"
                    >
                      <option value="">Pilih Kategori</option>
                      {kategori.map((k) => (
                        <option key={k.id} value={k.id}>
                          {k.nama_kategori}
                        </option>
                      ))}
                    </select>
                    {/* Custom Arrow Icon */}
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      ▼
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload Gambar */}
              <div className="group relative border-2 border-dashed border-slate-200 rounded-[30px] p-10 flex flex-col items-center justify-center hover:border-cyan-400 hover:bg-cyan-50/30 transition-all cursor-pointer">
                <input
                  type="file"
                  onChange={(e) =>
                    setForm({ ...form, image: e.target.files[0] })
                  }
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />

                {/* Preview gambar kalau sudah dipilih */}
                {form.image ? (
                  <img
                    src={URL.createObjectURL(form.image)}
                    alt="preview"
                    className="w-full h-48 object-cover rounded-2xl"
                  />
                ) : (
                  <>
                    <div className="w-16 h-16 bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                      📸
                    </div>
                    <p className="font-bold text-[#0F172A]">
                      Klik atau seret foto ke sini
                    </p>
                    <p className="text-xs text-slate-400 mt-1 font-medium">
                      Format JPG, PNG atau JPEG (Maks. 5MB)
                    </p>
                  </>
                )}
              </div>

              {/* Tombol Aksi */}
              <div className="pt-6 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    tambahLaporan();
                  }}
                  className="flex-1 bg-[#06B6D4] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-cyan-200 hover:bg-[#0891B2] hover:-translate-y-1 transition-all"
                >
                  Kirim Laporan Sekarang
                </button>
                <Link href={`/laporan-saya/${id}`}>
                  <button
                    type="button"
                    className="px-10 py-5 bg-slate-100 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-50 hover:text-red-500 transition-all"
                  >
                    Batalkan
                  </button>
                </Link>
              </div>
            </form>
          </div>

          {/* Footer Info */}
          <div className="mt-8 bg-amber-50 border border-amber-100 rounded-3xl p-6 flex gap-4 items-center">
            <span className="text-2xl">💡</span>
            <p className="text-xs font-bold text-amber-700 leading-relaxed">
              PENTING: Pastikan laporan Anda tidak mengandung unsur SARA,
              pornografi, atau ujaran kebencian. Setiap laporan akan
              diverifikasi oleh admin sebelum dipublikasikan.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
