"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [laporan, setLaporan] = useState([]);
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [statistik, setStatistik] = useState({});
  const [statistikBulanan, setStatistikBulanan] = useState([]);
  const namaBulan = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

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

    // Fetch User
    fetch(`http://localhost:5000/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => setUser(json.data[0]));

    // Fetch Laporan
    fetch("http://localhost:5000/api/laporan", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => setLaporan(json.data));

    // Fetch Statistik
    fetch("http://localhost:5000/api/laporan/total", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => setStatistik(json));

    // Fetch Grafik
    fetch("http://localhost:5000/api/laporan/statistik", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => setStatistikBulanan(json.data || []));
  }, []);

  return (
    <main className="flex h-screen bg-[#F0F9FF] font-sans overflow-hidden">
      {/* SIDEBAR */}
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
            <button className="bg-[#06B6D4] text-white px-6 py-4 rounded-2xl text-left font-bold whitespace-nowrap shadow-lg shadow-cyan-900/20 w-full">
              Home
            </button>

            <Link href="/superAdmin/dashboard">
              <button className="hover:bg-slate-800 px-6 py-4 rounded-2xl text-left transition whitespace-nowrap w-full text-slate-300 hover:text-white font-medium">
                Dashboard
              </button>
            </Link>
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

      {/* MAIN CONTENT AREA */}
      <section className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* STICKY TOPBAR */}
        <header className="sticky top-0 z-40 bg-[#F0F9FF]/80 backdrop-blur-md px-6 md:px-10 py-5 flex items-center justify-between border-b border-cyan-100/50">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="bg-white shadow-sm p-4 rounded-2xl border border-cyan-50 hover:bg-cyan-50 transition-all active:scale-90"
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
            <div>
              <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">
                Dashboard Overview
              </h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                Selamat datang, {user?.username || "Admin"}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center bg-white p-1.5 pr-6 rounded-full shadow-sm border border-cyan-100 hover:border-cyan-300 hover:shadow-md transition-all duration-300 group">
            <Link
              href={`/superAdmin/profile/${userId}`}
              className="flex items-center gap-3 w-full"
            >
              {/* Avatar Container */}
              <div className="relative">
                <div className="w-10 h-10 bg-cyan-500 rounded-full border-2 border-white overflow-hidden shadow-inner group-hover:ring-2 group-hover:ring-cyan-100 transition-all">
                  <img
                    src={
                      user?.fotoProfile
                        ? `http://localhost:5000/gambar/${user.fotoProfile}`
                        : "https://i.pinimg.com/736x/96/e2/a7/96e2a7d987ce19f693d39f131cda092a.jpg"
                    }
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt="avatar"
                  />
                </div>
              </div>

              {/* Text Info */}
              <div className="flex flex-col">
                <span className="text-sm font-black text-[#0F172A] tracking-tight leading-none group-hover:text-cyan-600 transition-colors">
                  {user?.username || "Admin"}
                </span>
              </div>
            </Link>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="p-6 md:p-10">
          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              {
                label: "Total Laporan",
                val: statistik.total || 0,
                trend: "+12%",
                icon: "📊",
                color: "text-[#0F172A]",
                bg: "bg-white",
              },
              {
                label: "Diproses",
                val: statistik.proses || 0,
                trend: "-5%",
                icon: "⏳",
                color: "text-amber-600",
                bg: "bg-white",
              },
              {
                label: "Selesai",
                val: statistik.selesai || 0,
                trend: "+18%",
                icon: "✅",
                color: "text-emerald-600",
                bg: "bg-white",
              },
              {
                label: "Ditolak",
                val: statistik.ditolak || 0,
                trend: "+2%",
                icon: "❌",
                color: "text-rose-500",
                bg: "bg-white",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className={`${stat.bg} rounded-[32px] p-6 shadow-lg shadow-cyan-900/5 border border-white hover:-translate-y-1 transition-all duration-300`}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="p-3 bg-slate-50 rounded-2xl text-xl">
                    {stat.icon}
                  </div>
                  <span
                    className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.trend.startsWith("+") ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
                  >
                    {stat.trend}
                  </span>
                </div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.1em]">
                  {stat.label}
                </p>
                <h2 className={`text-3xl font-black mt-1 ${stat.color}`}>
                  {stat.val}
                </h2>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* ANALYTICS CHART */}
            <div className="xl:col-span-2 bg-white rounded-[40px] p-8 border border-white shadow-lg shadow-cyan-900/5">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-[#0F172A]">
                  Tren Pengaduan
                </h3>
                <select className="text-xs font-bold bg-slate-50 border-none rounded-xl px-4 py-2 text-slate-500 outline-none">
                  <option>Tahun 2026</option>
                </select>
              </div>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={namaBulan.slice(1).map((bulan, index) => {
                      const found = statistikBulanan.find(
                        (item) => item.bulan === index + 1,
                      );

                      return {
                        bulan,
                        total: found?.total || 0,
                      };
                    })}
                    margin={{
                      top: 20,
                      right: 20,
                      left: -10,
                      bottom: 0,
                    }}
                  >
                    <defs>
                      <linearGradient
                        id="purpleGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8B5CF6"
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8B5CF6"
                          stopOpacity={0.03}
                        />
                      </linearGradient>
                    </defs>

                    {/* Grid */}
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={true}
                      stroke="#E5E7EB"
                    />

                    {/* X Axis */}
                    <XAxis
                      dataKey="bulan"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 12,
                        fill: "#94A3B8",
                        fontWeight: 600,
                      }}
                    />

                    {/* Y Axis */}
                    <YAxis
                      allowDecimals={false}
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 12,
                        fill: "#94A3B8",
                        fontWeight: 600,
                      }}
                    />

                    {/* Tooltip */}
                    <Tooltip
                      contentStyle={{
                        borderRadius: "16px",
                        border: "none",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      }}
                    />

                    {/* Legend Manual */}
                    <text
                      x="50%"
                      y={15}
                      textAnchor="middle"
                      fill="#64748B"
                      fontSize="14"
                      fontWeight="700"
                    >
                      Laporan Masuk
                    </text>

                    {/* Chart */}
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#8B5CF6"
                      strokeWidth={4}
                      fill="url(#purpleGradient)"
                      dot={{
                        r: 4,
                        fill: "#8B5CF6",
                        strokeWidth: 0,
                      }}
                      activeDot={{
                        r: 6,
                        fill: "#8B5CF6",
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-white rounded-[40px] p-8 border border-white shadow-lg shadow-cyan-900/5">
              <h3 className="text-xl font-black text-[#0F172A] mb-6">
                Aksi Cepat
              </h3>
              <div className="space-y-3">
                <button className="w-full bg-[#0F172A] text-white p-4 rounded-2xl font-bold text-sm flex items-center justify-between hover:bg-[#06B6D4] transition-all group">
                  Cetak Rekap Laporan{" "}
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </button>
                <button className="w-full bg-cyan-50 text-[#0891B2] p-4 rounded-2xl font-bold text-sm flex items-center justify-between hover:bg-cyan-100 transition-all">
                  Verifikasi Laporan
                  <span className="bg-cyan-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                    5 Baru
                  </span>
                </button>

                <div className="pt-6 mt-6 border-t border-slate-50">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">
                    Aktivitas Sistem
                  </p>
                  <div className="space-y-4">
                    {[1, 2].map((_, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                        <div>
                          <p className="text-xs font-bold text-[#0F172A]">
                            Laporan #882 diverifikasi
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            2 menit yang lalu
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="mt-12">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
                  Laporan Masuk
                </h2>
                <p className="text-slate-400 text-xs font-bold">
                  Menampilkan 5 aktivitas terbaru
                </p>
              </div>
              <Link href="/superAdmin/dashboard">
                <button className="text-xs font-black text-[#0891B2] hover:bg-cyan-50 px-4 py-2 rounded-xl transition-all">
                  LIHAT SEMUA
                </button>
              </Link>
            </div>

            <div className="bg-white rounded-[35px] shadow-lg shadow-cyan-900/5 border border-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-100">
                      <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Judul & Lokasi
                      </th>

                      <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Tanggal
                      </th>

                      <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Kategori
                      </th>

                      <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Status
                      </th>

                      <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Opsi
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {laporan
                      .sort(
                        (a, b) => new Date(b.create_at) - new Date(a.create_at),
                      )
                      .slice(0, 5)
                      .map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-cyan-50/30 transition-all duration-200"
                        >
                          {/* Judul & Lokasi */}
                          <td className="px-8 py-5">
                            <p className="font-bold text-slate-800 text-sm line-clamp-1">
                              {item.judul}
                            </p>

                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-1">
                              {item.lokasi}
                            </p>
                          </td>

                          {/* Tanggal */}
                          <td className="px-8 py-5 whitespace-nowrap">
                            <span className="text-xs font-semibold text-slate-500">
                              {new Date(item.create_at).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </td>

                          {/* Kategori */}
                          <td className="px-8 py-5">
                            <span className="inline-flex items-center rounded-xl bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-700">
                              {item.nama_kategori || "-"}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-8 py-5">
                            <span
                              className={`inline-flex px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider
                    ${
                      item.status === "Selesai"
                        ? "bg-emerald-50 text-emerald-600"
                        : item.status === "Diproses"
                          ? "bg-amber-50 text-amber-600"
                          : item.status === "Ditolak"
                            ? "bg-rose-50 text-rose-600"
                            : "bg-slate-100 text-slate-600"
                    }
                  `}
                            >
                              {item.status || "Menunggu"}
                            </span>
                          </td>

                          {/* Button */}
                          <td className="px-8 py-5 text-right">
                            <button
                              onClick={() =>
                                router.push(`/detailLaporan/${item.id}`)
                              }
                              className="bg-slate-600 hover:bg-[#0F172A] hover:text-white px-4 py-2 rounded-xl text-[10px] font-black transition-all duration-200 active:scale-95"
                            >
                              DETAIL
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
