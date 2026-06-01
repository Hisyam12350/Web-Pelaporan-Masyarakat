"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DetailLaporanUsers() {
  const { id } = useParams();
  const router = useRouter();
  const [laporan, setLaporan] = useState(null);
  const [komentar, setKomentar] = useState([]);
  const [isi, setIsi] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);
  const [currentUserId, setCurrentUserId] = useState(null);

  const statusStyles = {
    Diterima: "bg-green-50 text-green-600 border-green-100 dot-green-500",
    Ditolak: "bg-red-50 text-red-600 border-red-100 dot-red-500",
    Diproses: "bg-amber-50 text-amber-600 border-amber-100 dot-amber-500",
    Pending: "bg-gray-50 text-gray-400 border-gray-100 dot-gray-400",
  };

  // Ambil style berdasarkan status, default ke Pending jika tidak ditemukan

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    setCurrentUserId(localStorage.getItem("id"));

    if (!token) {
      router.push("/login");
      return;
    }
    if (role === "admin") {
      router.push(`/admin/laporan/${id}`);
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
        }
      });

    fetch(`http://localhost:5000/api/komentar/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => {
        console.log("komentar:", json);
        setKomentar(json.data || []);
      });
  }, [id]);

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

    try {
      const res = await fetch(
        `http://localhost:5000/api/komentar/${komentarId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await res.json();

      if (data.ok || res.ok) {
        // refresh komentar
        fetch(`http://localhost:5000/api/komentar/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((json) => setKomentar(json.data || []));
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  if (!laporan) {
    return <div>Loading...</div>;
  }

  const currentStyle = statusStyles[laporan.status] || statusStyles.Pending;

  return (
    <div className="min-h-screen bg-[#F0F9FF] flex font-sans">
      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* HEADER TOP (Sidebar dihapus, diganti tombol Back) */}
        <div className="flex items-center gap-6 mb-8">
          <button
            onClick={() => window.history.back()}
            className="bg-white shadow-md shadow-cyan-100 p-4 rounded-2xl hover:bg-cyan-50 transition border border-cyan-50 group"
          >
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#06B6D4] group-hover:-translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </div>
          </button>
          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Detail Laporan
          </h1>
        </div>

        {/* Header Card (Judul & ID) */}
        <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-cyan-100/50 mb-8 border border-cyan-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-cyan-100 text-[#0891B2] text-xs font-bold px-3 py-1 rounded-lg">
                ID: #{laporan.id}
              </span>
              <span className="text-slate-400 text-sm font-medium">
                {new Date(laporan.create_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <h1 className="text-3xl font-black text-[#0F172A] leading-tight">
              {laporan.judul}
            </h1>
          </div>

          <div
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all ${currentStyle.split(" ").slice(0, 3).join(" ")}`}
          >
            {/* Dot Animation */}
            <span className="relative flex h-3 w-3">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentStyle.split(" ").pop().replace("dot-", "bg-")}`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${currentStyle.split(" ").pop().replace("dot-", "bg-")}`}
              ></span>
            </span>

            {/* Text Status */}
            <span className="font-bold text-sm uppercase tracking-wider">
              {laporan.status || "Menunggu"}
            </span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content (Image & Description) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Image */}
            <div className="bg-white p-4 rounded-[40px] shadow-xl shadow-cyan-100/50 border border-cyan-50 overflow-hidden">
              <img
                src={`http://localhost:5000/gambar/${laporan.gambar}`}
                alt="laporan"
                className="rounded-[32px] w-full h-[450px] object-cover transition-transform duration-700 hover:scale-[1.02]"
              />
            </div>

            {/* Description Box */}
            <div className="bg-white p-8 rounded-[32px] shadow-lg shadow-cyan-100/50 border border-cyan-50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center text-cyan-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#0F172A]">
                  Deskripsi Lengkap
                </h3>
              </div>
              <p className="text-slate-600 text-lg leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100">
                {laporan.deskripsi}
              </p>
            </div>
          </div>

          {/* Right Info Panels */}
          <div className="space-y-8">
            {/* Panel Informasi Laporan */}
            <div className="bg-[#0F172A] p-8 rounded-[32px] shadow-2xl text-white relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl"></div>

              <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
                <span className="w-2 h-6 bg-cyan-400 rounded-full"></span>
                Detail Kejadian
              </h3>

              <div className="space-y-6">
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
                    Kategori
                  </p>
                  <p className="text-cyan-400 font-bold text-lg">
                    {laporan.nama_kategori}
                  </p>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
                    Lokasi
                  </p>
                  <p className="text-white font-bold text-lg">
                    📍 {laporan.lokasi || "Lokasi tidak terinci"}
                  </p>
                </div>
              </div>
            </div>

            {/* Panel Informasi Pelapor */}
            <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-cyan-100/50 border border-cyan-50">
              <h3 className="text-lg font-bold text-[#0F172A] mb-8 flex items-center gap-2">
                <span className="w-2 h-6 bg-[#06B6D4] rounded-full"></span>
                Profil Pelapor
              </h3>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-cyan-200">
                  {laporan.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-black text-[#0F172A] text-lg">
                    {laporan.username}
                  </p>
                  <p className="text-slate-400 text-sm font-medium">
                    Citizen Reporter
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-cyan-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="font-medium truncate">{laporan.email}</p>
                </div>

                <button className="w-full py-4 bg-[#F0F9FF] text-[#0891B2] font-bold rounded-2xl hover:bg-cyan-100 transition-colors duration-300">
                  Hubungi Pelapor
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- SECTION KOMENTAR --- */}
        <div className="mt-10 grid grid-cols-1 xl:grid-cols-12 gap-8 items-start h-[650px] overflow-hidden">
          {/* KOLOM KIRI: STATS & INFORMASI (4/12) */}
          <div className="xl:col-span-4 flex flex-col gap-4 h-full">
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col justify-center flex-1">
              <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-cyan-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-[#0F172A] leading-tight mb-2">
                Diskusi <br /> Laporan
              </h3>
              <p className="text-slate-400 text-sm font-medium">
                Ruang komunikasi untuk meninjau, memberikan instruksi, atau
                klarifikasi terkait laporan ini.
              </p>
            </div>

            {/* Stat Card */}
            <div className="bg-[#0F172A] p-8 rounded-[32px] text-white shadow-xl shadow-slate-200">
              <p className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                Status Diskusi
              </p>
              <h4 className="text-4xl font-black">
                {komentar.length}{" "}
                <span className="text-lg text-slate-400 font-bold ml-1 uppercase">
                  Komentar
                </span>
              </h4>
            </div>
          </div>

          {/* KOLOM KANAN: DAFTAR KOMENTAR & INPUT (8/12) */}
          <div className="xl:col-span-8 flex flex-col h-full bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
            {/* Header List */}
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-md">
              <h3 className="font-black text-[#0F172A] uppercase text-xs tracking-[0.2em]">
                Timeline Diskusi
              </h3>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="w-2 h-2 rounded-full bg-slate-200"></span>
                <span className="w-2 h-2 rounded-full bg-slate-200"></span>
              </div>
            </div>

            {/* Scrollable Comments Area */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
              {komentar.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-40">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mb-4 text-slate-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <p className="text-slate-500 font-bold italic text-sm">
                    Belum ada percakapan dimulai.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {komentar.slice(0, visibleCount).map((item) => (
                    <div
                      key={item.id}
                      className="group relative flex gap-4 transition-all"
                    >
                      {/* Avatar Side */}
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden bg-slate-200 shrink-0">
                          <img
                            src={
                              item?.fotoProfile
                                ? `http://localhost:5000/gambar/${item.fotoProfile}`
                                : "https://i.pinimg.com/736x/96/e2/a7/96e2a7d987ce19f693d39f131cda092a.jpg"
                            }
                            alt="avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="w-0.5 h-full bg-slate-100 my-2"></div>
                      </div>

                      {/* Bubble Content */}
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-[#0F172A]">
                              {item.username}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold">
                              {new Date(item.create_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          {String(item.id_user) === String(currentUserId) && (
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="opacity-0 group-hover:opacity-100 p-1.5 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
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
                          )}
                        </div>
                        <div className="bg-slate-50 group-hover:bg-cyan-50/30 border border-slate-100 group-hover:border-cyan-100 p-4 rounded-2xl rounded-tl-none transition-all">
                          <p className="text-slate-600 text-sm leading-relaxed">
                            {item.isi_komentar}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {visibleCount < komentar.length && (
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 5)}
                      className="w-full py-3 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 font-black text-[10px] uppercase tracking-widest hover:border-cyan-200 hover:text-cyan-500 hover:bg-cyan-50/30 transition-all"
                    >
                      Lihat {komentar.length - visibleCount} Komentar Sebelumnya
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Sticky Input Area */}
            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <div className="flex gap-3 bg-white p-2 rounded-[24px] border-2 border-transparent focus-within:border-cyan-400 shadow-sm transition-all">
                <input
                  type="text"
                  value={isi}
                  onChange={(e) => setIsi(e.target.value)}
                  placeholder="Ketik pesan diskusi..."
                  className="flex-1 bg-transparent border-none px-4 py-3 outline-none text-sm font-medium text-slate-700 placeholder:text-slate-300"
                  onKeyPress={(e) => e.key === "Enter" && handleKomentar()}
                />
                <button
                  onClick={handleKomentar}
                  className="bg-[#0F172A] text-white px-6 py-3 rounded-[18px] font-black text-[10px] uppercase tracking-widest hover:bg-cyan-600 shadow-md active:scale-95 transition-all flex items-center gap-2"
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
      </div>
    </div>
  );
}
