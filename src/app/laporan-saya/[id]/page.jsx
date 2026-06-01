"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function LaporanSayaPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [laporan, setLaporan] = useState([]);
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const [userId, setUserId] = useState(null);
  const router = useRouter();
  const [statistik, setStatistik] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (role !== "users") {
      window.location.href = "/admin/home";
      return;
    }

    if (role !== "users") {
      window.location.href = "/superAdmin/dashboard";
      return;
    }

    const id = localStorage.getItem("id");
    setUserId(id);

    fetch(`http://localhost:5000/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.data) setUser(json.data[0]);
      });

    fetch(`http://localhost:5000/api/laporan/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          setLaporan(json.data);
          setUser(json.data[0]);
        }
      });

    fetch(`http://localhost:5000/api/laporan/total/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.ok) setStatistik(json);
      });
  }, [id]);

  return (
    <main className="flex min-h-screen bg-[#F0F9FF] font-sans">
      {/* SIDEBAR - Tetap Konsisten */}
      <aside
        className={`bg-[#0F172A] text-white transition-all duration-300 ease-in-out ${sidebarOpen ? "w-[280px] p-8 opacity-100" : "w-0 p-0 opacity-0"} overflow-hidden hidden md:flex flex-col shadow-2xl`}
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
              <button className="hover:bg-slate-800 px-6 py-4 rounded-2xl text-left transition text-slate-300 hover:text-white font-medium w-full">
                Home
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="hover:bg-slate-800 px-6 py-4 rounded-2xl text-left transition text-slate-300 hover:text-white font-medium w-full">
                Dashboard
              </button>
            </Link>
            <Link href="/laporan-saya">
              <button className="bg-[#06B6D4] w-full text-white px-6 py-4 rounded-2xl text-left font-bold shadow-lg shadow-cyan-900/20">
                Laporan Saya
              </button>
            </Link>
            <Link href={`/profil/${userId}`}>
              <button className="hover:bg-slate-800 px-6 py-4 rounded-2xl text-left transition text-slate-300 hover:text-white font-medium w-full">
                Profile
              </button>
            </Link>
          </nav>
        </div>
      </aside>

      <section className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* TOPBAR USER */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="bg-white shadow-md shadow-cyan-100 p-4 rounded-2xl border border-cyan-50"
            >
              <div className="flex flex-col gap-1.5">
                <span className="w-6 h-[2.5px] bg-[#06B6D4] rounded"></span>
                <span className="w-4 h-[2.5px] bg-[#0891B2] rounded"></span>
                <span className="w-6 h-[2.5px] bg-[#06B6D4] rounded"></span>
              </div>
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-[#0F172A] tracking-tight">
                Halo, {user?.username}! 👋
              </h1>
              <p className="text-slate-500 text-sm font-medium">
                Apa yang ingin Anda laporkan hari ini?
              </p>
            </div>
          </div>
        </div>

        {/* QUICK ACTION CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Tombol Buat Laporan - Paling Menonjol */}
          <div className="lg:col-span-2 bg-[#0F172A] rounded-[40px] p-10 relative overflow-hidden group border-b-8 border-[#06B6D4]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-cyan-500/20 transition-all duration-700"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-black text-white leading-tight">
                Punya Keluhan <br /> Terkait Fasilitas Umum?
              </h2>
              <p className="text-slate-400 mt-4 max-w-sm">
                Sampaikan aspirasi atau keluhan Anda. Kami akan menghubungkan
                Anda dengan instansi terkait.
              </p>
              <Link href="/tambahLaporan">
                <button className="mt-8 bg-[#06B6D4] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-[#0F172A] transition-all duration-300 shadow-xl shadow-cyan-900/40">
                  Buat Laporan Baru
                </button>
              </Link>
            </div>
          </div>

          {/* Ringkasan Laporan User */}
          <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-cyan-100/50 border border-cyan-50 flex flex-col justify-center">
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-6">
              Status Laporan Saya
            </p>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold">
                    ⏳
                  </span>
                  <span className="text-sm font-bold text-slate-600">
                    Menunggu Verifikasi
                  </span>
                </div>
                <span className="text-lg font-black text-[#0F172A]">
                  {statistik.menunggu || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold">
                    ⏳
                  </span>
                  <span className="text-sm font-bold text-slate-600">
                    Sedang Diproses
                  </span>
                </div>
                <span className="text-lg font-black text-[#0F172A]">
                  {statistik.proses || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center font-bold">
                    ✅
                  </span>
                  <span className="text-sm font-bold text-slate-600">
                    Selesai
                  </span>
                </div>
                <span className="text-lg font-black text-[#0F172A]">
                  {statistik.selesai || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* MONITORING LAPORAN TERAKHIR */}
        <div className="mt-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-[#0F172A]">
                Laporan Terakhir Saya
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Pantau perkembangan laporan yang telah Anda kirim.
              </p>
            </div>
          </div>

          {/* List Laporan User (Horizontal Scroll on Mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {laporan.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 hover:border-cyan-200 transition-all group flex gap-6"
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                  <img
                    src={`http://localhost:5000/gambar/${item.gambar}`}
                    className="w-full h-full object-cover"
                    alt="laporan"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter ${
                        item.status === "Diterima"
                          ? "bg-green-50 text-green-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {item.status || "Diproses"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(item.create_at).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  <h3
                    key={item.judul}
                    className="font-bold text-[#0F172A] text-sm line-clamp-1 group-hover:text-[#06B6D4] transition-colors"
                  >
                    {item.judul}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    Terima kasih atas laporan Anda. Saat ini tim kami sedang
                    melakukan verifikasi lapangan...
                  </p>
                  <button
                    onClick={() => router.push(`/detailLaporan/${item.id}`)}
                    className="mt-3 text-[11px] font-black text-[#0891B2] uppercase tracking-wider hover:text-cyan-600"
                  >
                    Lihat Detail →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
