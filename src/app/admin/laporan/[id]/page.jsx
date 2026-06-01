"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Link from "next/link";

export default function DetailLaporanAdmin() {
  const { id } = useParams();
  const [laporan, setLaporan] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [komentar, setKomentar] = useState([]);
  const [isi, setIsi] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      router.push("/login");
      return;
    }
    if (role !== "admin") {
      router.push("/home");
      return;
    }

    fetch(`http://localhost:5000/api/laporan/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          setLaporan(json.data[0]);
          setStatus(json.data[0].status);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch(`http://localhost:5000/api/komentar/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => setKomentar(json.data || []));
  }, [id, router]);

  const handleEditStatus = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:5000/api/laporan/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();
    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Status Laporan Berhasil Diubah!",
        confirmButtonColor: "#06B6D4",
        customClass: {
          popup: "rounded-[32px]",
        },
      });
    }
  };

  const handleKomentar = async () => {
    if (!isi) return;

    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5000/api/komentar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id_laporan: id, isi_komentar: isi }),
    });

    const data = await res.json();

    if (res.ok) {
      setIsi("");
      const token = localStorage.getItem("token");
      fetch(`http://localhost:5000/api/komentar/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((json) => setKomentar(json.data || []));
    }
  };

  const handleDelete = async (komentarId) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5000/api/komentar/${komentarId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    // refresh komentar
    fetch(`http://localhost:5000/api/komentar/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => setKomentar(json.data || []));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F0F9FF]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-cyan-500"></div>
      </div>
    );
  }

  if (!laporan) return null;

  return (
    <main className="min-h-screen bg-[#F0F9FF] p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Tombol Kembali */}
        <Link
          href="/admin/dashboard"
          className="mb-8 flex items-center gap-2 text-slate-500 font-bold hover:text-cyan-600 transition-colors"
        >
          <span>←</span> Kembali ke Dashboard
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom Kiri: Gambar Laporan */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[40px] overflow-hidden shadow-xl shadow-cyan-900/5 border border-white">
              <div className="relative h-[400px] w-full">
                <img
                  src={`http://localhost:5000/gambar/${laporan.gambar}`}
                  alt={laporan.judul}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 left-6 z-10">
                  <div
                    className={`px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] shadow-xl backdrop-blur-md border border-white/20 transition-all duration-500 flex items-center gap-2 ${
                      status === "Selesai"
                        ? "bg-emerald-500/90 text-white"
                        : status === "Ditolak"
                          ? "bg-rose-500/90 text-white"
                          : status === "Diproses"
                            ? "bg-blue-500/90 text-white"
                            : "bg-amber-500/90 text-white"
                    }`}
                  >
                    {/* Lampu Indikator Kedip */}
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>

                    {status || "Menunggu"}
                  </div>
                </div>
              </div>

              <div className="p-10">
                <h1 className="text-3xl font-black text-[#0F172A] mb-4 leading-tight">
                  {laporan.judul}
                </h1>
                <div className="flex flex-wrap gap-6 mb-8 text-sm font-bold text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📍</span> {laporan.lokasi}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👤</span> {laporan.username}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📅</span>{" "}
                    {new Date(laporan.create_at).toLocaleDateString("id-ID", {
                      dateStyle: "long",
                    })}
                  </div>
                </div>
                <hr className="border-slate-50 mb-8" />
                <p className="text-slate-600 leading-relaxed text-lg">
                  {laporan.deskripsi}
                </p>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Aksi Admin */}
          <div className="space-y-6">
            <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-cyan-900/5 border border-white">
              <h3 className="text-xl font-black text-[#0F172A] mb-6">
                Manajemen Status
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block ml-1">
                    Pilih Status Laporan:
                  </label>
                  <div className="relative">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-700 focus:border-cyan-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer shadow-sm hover:shadow-md"
                    >
                      <option value="">-- Pilih Status --</option>
                      <option value="Selesai">Selesai</option>
                      <option value="Menunggu">Menunggu</option>
                      <option value="Diproses">Diproses</option>
                      <option value="Ditolak">Ditolak</option>
                    </select>
                    {/* Ikon Panah Kustom */}
                    <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-slate-400">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleEditStatus}
                  className="w-full bg-[#0F172A] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-cyan-600 shadow-lg shadow-slate-200 transition-all active:scale-95"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>

            {/* Card Info Tambahan */}
            <div className="bg-[#0F172A] rounded-[40px] p-8 text-white">
              <h4 className="text-cyan-400 text-xs font-black uppercase tracking-widest mb-4">
                Catatan Super Admin
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Pastikan foto dan lokasi laporan valid sebelum mengubah status
                menjadi <b>Diproses</b> atau <b>Selesai</b>.
              </p>
              <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                <p className="text-[10px] text-slate-500 font-medium">
                  ID LAPORAN
                </p>
                <p className="font-mono text-sm">
                  #LPR-{id.toString().padStart(4, "0")}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-cyan-100/50 border border-cyan-50 mt-10">
          <h3 className="text-lg font-bold text-[#0F172A] mb-8 flex items-center gap-2">
            <span className="w-2 h-6 bg-cyan-500 rounded-full"></span>
            Diskusi Laporan
          </h3>

          {/* Daftar Komentar */}
          <div className="space-y-4 mb-6">
            {komentar.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-[24px] border border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">
                  Belum ada komentar untuk laporan ini.
                </p>
              </div>
            ) : (
              <>
                {/* Kita potong array komentar sesuai jumlah visibleCount */}
                {komentar.slice(0, visibleCount).map((item) => (
                  <div
                    key={item.id}
                    className="group bg-slate-50 hover:bg-white hover:shadow-md hover:border-cyan-100 border border-transparent rounded-[24px] p-5 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-cyan-500 rounded-full border-2 border-white shadow-sm overflow-hidden">
                          <img
                            src={
                              item?.fotoProfile
                                ? `http://localhost:5000/gambar/${item.fotoProfile}`
                                : "https://i.pinimg.com/736x/96/e2/a7/96e2a7d987ce19f693d39f131cda092a.jpg"
                            }
                            alt="avatar"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-black text-[#0F172A]">
                            {item.username}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                            {new Date(item.create_at).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      >
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
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed ml-12">
                      {item.isi_komentar}
                    </p>
                  </div>
                ))}

                {/* Button Tampilkan Lebih Banyak */}
                {visibleCount < komentar.length && (
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 5)}
                    className="w-full py-4 mt-2 border-2 border-dashed border-slate-200 rounded-[24px] text-slate-400 font-bold text-sm hover:border-cyan-300 hover:text-cyan-500 hover:bg-cyan-50/50 transition-all duration-300"
                  >
                    Tampilkan Lebih Banyak ({komentar.length - visibleCount}{" "}
                    lagi)
                  </button>
                )}
              </>
            )}
          </div>

          <div className="relative pt-4 border-t border-slate-100">
            <div className="flex gap-3 bg-slate-50 p-2 rounded-[24px] border-2 border-transparent focus-within:border-cyan-400 focus-within:bg-white transition-all shadow-inner">
              <input
                type="text"
                value={isi}
                onChange={(e) => setIsi(e.target.value)}
                placeholder="Tuliskan Komentar Anda"
                className="flex-1 bg-transparent border-none px-4 py-3 outline-none text-sm font-bold text-slate-700"
              />
              <button
                onClick={handleKomentar}
                className="bg-[#0F172A] text-white px-8 py-3 rounded-[18px] font-black text-xs uppercase tracking-widest hover:bg-cyan-600 shadow-lg active:scale-95 transition-all flex items-center gap-2"
              >
                Kirim
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
