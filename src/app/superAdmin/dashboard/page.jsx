"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [laporan, setLaporan] = useState([]);
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [kategoriAktif, setKategoriAktif] = useState(null);
  const [statistik, setStatistik] = useState({});

  const laporanFilter = kategoriAktif
    ? laporan.filter((item) => item.nama_kategori === kategoriAktif)
    : laporan;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    const role = localStorage.getItem("role");
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

    fetch("http://localhost:5000/api/laporan", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setLaporan(json.data);
      });

    fetch("http://localhost:5000/api/laporan/total", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setStatistik(json);
      });
  }, []);

  return (
    <main className="flex h-screen bg-[#F0F9FF] font-sans">
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
              <button className="bg-[#06B6D4] text-white px-6 py-4 rounded-2xl text-left font-bold whitespace-nowrap shadow-lg shadow-cyan-900/20 w-full">
                Dashboard
              </button>
            <Link href="/superAdmin/kategori">
              <button className="hover:bg-slate-800 px-6 py-4 rounded-2xl text-left transition whitespace-nowrap w-full text-slate-300 hover:text-white font-medium">
                Kategori
              </button>
            </Link>
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

      <section className="flex-1 min-w-0 overflow-y-auto">
        {/* --- STICKY TOPBAR DISINI --- */}
        <div className="sticky top-0 z-50 bg-[#F0F9FF]/90 backdrop-blur-md px-6 md:px-10 py-6 flex items-center justify-between border-b border-cyan-100/50 shadow-sm">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="bg-white shadow-md shadow-cyan-100 p-4 rounded-2xl border border-cyan-50 hover:bg-cyan-50 transition-colors"
            >
              <div className="flex flex-col gap-1.5">
                <span
                  className={`h-[2.5px] bg-[#06B6D4] rounded transition-all ${sidebarOpen ? "w-6" : "w-4"}`}
                ></span>
                <span className="w-6 h-[2.5px] bg-[#0891B2] rounded"></span>
                <span
                  className={`h-[2.5px] bg-[#06B6D4] rounded transition-all ${sidebarOpen ? "w-4" : "w-6"}`}
                ></span>
              </div>
            </button>
            <h1 className="text-2xl md:text-3xl font-black text-[#0F172A] tracking-tight">
              Eksplorasi Laporan
            </h1>
          </div>
        </div>

        {/* COMMUNITY HIGHLIGHTS (Stats Publik) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 mt-5 m-3">
          {[
            { label: "Total Laporan", val: statistik.total || 0, icon: "🌎" },
            { label: "Selesai", val: statistik.selesai || 0, icon: "✅" },
            { label: "Peroses", val: statistik.proses || 0, icon: "📈" },
            { label: "Ditolak", val: statistik.ditolak || 0, icon: "📍" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white/60 backdrop-blur-sm border border-white rounded-[24px] p-5"
            >
              <span className="text-xl">{stat.icon}</span>
              <h4 className="text-2xl font-black text-[#0F172A] mt-2">
                {stat.val}
              </h4>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* FEED FILTER (Pilihan kategori laporan) */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide m-3">
          <button
            onClick={() => setKategoriAktif(null)}
            className={`px-6 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              kategoriAktif === null
                ? "bg-[#06B6D4] text-white shadow-lg shadow-cyan-200"
                : "bg-white text-slate-400 hover:bg-cyan-50"
            }`}
          >
            Semua
          </button>
          {[...new Set(laporan.map((item) => item.nama_kategori))].map(
            (kategori) => (
              <button
                key={kategori}
                onClick={() =>
                  setKategoriAktif(kategoriAktif === kategori ? null : kategori)
                }
                className={`px-6 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  kategoriAktif === kategori
                    ? "bg-[#06B6D4] text-white shadow-lg shadow-cyan-200"
                    : "bg-white text-slate-400 hover:bg-cyan-50"
                }`}
              >
                {kategori}
              </button>
            ),
          )}
        </div>

        {/* MAIN FEED: LAPORAN DARI SEMUA USER */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 gap-8 transition-all duration-500 m-3 ${
            sidebarOpen ? "lg:grid-cols-3" : "lg:grid-cols-4"
          }`}
        >
          {laporanFilter.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-[32px] overflow-hidden shadow-lg shadow-cyan-100/40 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white flex flex-col"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={`http://localhost:5000/gambar/${item.gambar}`}
                  alt={item.judul}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-[#06B6D4] text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-lg uppercase tracking-widest">
                  {item.nama_kategori || "Umum"}
                </div>
              </div>

              <div className="p-7 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 overflow-hidden text-[10px] flex items-center justify-center font-bold text-slate-400">
                    ID
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    User #{item.id_user}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#0F172A] line-clamp-2 leading-tight group-hover:text-[#06B6D4] transition-colors">
                  {item.judul}
                </h3>

                <div className="mt-4 flex items-center justify-between text-xs font-medium border-t border-slate-50 pt-4">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <span className="text-cyan-500">📍</span>
                    {item.lokasi}
                  </div>
                  <div className="text-slate-400 italic">
                    {new Date(item.create_at).toLocaleDateString("id-ID")}
                  </div>
                </div>

                <button
                  onClick={() => router.push(`/detailLaporan/${item.id}`)}
                  className="mt-6 w-full py-3.5 rounded-2xl font-bold text-sm bg-slate-50 text-slate-600 group-hover:bg-[#06B6D4] group-hover:text-white group-hover:shadow-lg group-hover:shadow-cyan-200 transition-all duration-300"
                >
                  Detail Laporan
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
