"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [laporan, setLaporan] = useState([]);
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    const role = localStorage.getItem("role");
    setUserId(id);

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

    fetch(`http://localhost:5000/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setUser(json.data[0]);
      });

    fetch("http://localhost:5000/api/laporan", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setLaporan(json.data);
      });
  }, [id]);

  return (
    <main className="flex min-h-screen bg-[#F0F9FF] font-sans">
      {/* SIDEBAR - Tetap diam di kiri */}
      <aside
        className={`bg-[#0F172A] text-white transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-[280px] p-8 opacity-100" : "w-0 p-0 opacity-0"
        } overflow-hidden hidden md:flex flex-col shadow-2xl sticky top-0 h-screen z-50`}
      >
        <div
          className={`${sidebarOpen ? "block" : "hidden"} flex flex-col h-full`}
        >
          <div className="mb-12">
            <Link href="/home">
              <h1 className="text-4xl font-extrabold whitespace-nowrap tracking-tight cursor-pointer">
                LAPOR<span className="text-[#06B6D4]">!</span>
              </h1>
            </Link>
            <p className="text-cyan-400 text-sm font-medium mt-1 uppercase tracking-wider whitespace-nowrap">
              Pengaduan Masyarakat
            </p>
          </div>

          <nav className="flex flex-col gap-3 flex-grow">
            <Link href="/home">
              <button className="bg-[#06B6D4] text-white px-6 py-4 rounded-2xl text-left font-bold whitespace-nowrap shadow-lg shadow-cyan-900/20 w-full transition-all">
                Home
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="hover:bg-slate-800 px-6 py-4 rounded-2xl text-left transition whitespace-nowrap w-full text-slate-300 hover:text-white font-medium">
                Dashboard
              </button>
            </Link>
            <Link href={`/laporan-saya/${userId}`}>
              <button className="hover:bg-slate-800 px-6 w-full py-4 rounded-2xl text-left transition whitespace-nowrap text-slate-300 hover:text-white font-medium">
                Laporan Saya
              </button>
            </Link>
            <Link href={`/profil/${userId}`}>
              <button className="hover:bg-slate-800 px-6 w-full py-4 rounded-2xl text-left transition whitespace-nowrap text-slate-300 hover:text-white font-medium">
                Profile
              </button>
            </Link>
          </nav>

          <div className="mt-auto">
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
              <p className="text-xs text-slate-400 leading-relaxed">
                Butuh bantuan teknis? <br />
                <span className="text-cyan-400 hover:underline cursor-pointer">
                  Hubungi admin pusat
                </span>
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <section className="flex-1 min-w-0">
        {/* STICKY TOPBAR */}
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
            <h1 className="text-2xl md:text-3xl font-black text-[#0F172A] tracking-tight hidden sm:block">
              Beranda Utama
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-slate-400 uppercase">
                Selamat Datang
              </p>
              <p className="text-sm font-black text-[#0F172A]">
                {user?.username}
              </p>
            </div>
            <div className="w-12 h-12 bg-cyan-500 rounded-full border-2 border-white shadow-sm overflow-hidden">
              <img
                src={
                  user?.fotoProfile
                    ? `http://localhost:5000/gambar/${user.fotoProfile}`
                    : "https://i.pinimg.com/736x/96/e2/a7/96e2a7d987ce19f693d39f131cda092a.jpg"
                }
                alt="avatar"
              />
            </div>
          </div>
        </div>

        <div className="p-6 md:p-10">
          {/* HERO SECTION */}
          <div className="relative bg-white rounded-[40px] p-8 md:p-12 shadow-xl shadow-cyan-100/50 flex flex-col lg:flex-row items-center justify-between gap-12 border border-cyan-50 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50 rounded-bl-[100px] -z-0"></div>
            <div className="max-w-xl relative z-10">
              <span className="bg-cyan-100 text-cyan-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                E-Reporting System
              </span>
              <h1 className="text-5xl font-extrabold leading-[1.1] text-[#0F172A] mt-6">
                Sampaikan Laporan <br />
                <span className="text-[#06B6D4]">Mudah & Cepat</span>
              </h1>
              <p className="text-slate-500 mt-6 text-xl leading-relaxed">
                Suara Anda adalah awal perubahan. Laporkan kendala fasilitas
                publik di lingkungan Anda secara transparan.
              </p>
              <Link href={`/laporan-saya/${userId}`}>
                <button className="mt-10 bg-[#06B6D4] text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-[#0891B2] transform hover:-translate-y-1 transition shadow-lg shadow-cyan-200">
                  Buat Pengaduan Sekarang
                </button>
              </Link>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-cyan-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
              <img
                src="https://i.pinimg.com/736x/80/73/ea/8073eaad6ae560aad84571a92505daa7.jpg"
                alt="city"
                className="w-full lg:w-[400px] h-[350px] object-cover rounded-[32px] shadow-2xl relative z-10 border-8 border-white"
              />
            </div>
          </div>

          {/* FEED PENGADUAN TERBARU */}
          <div className="mt-20">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-black text-[#0F172A]">
                  Pengaduan Terbaru
                </h2>
                <p className="text-slate-400 mt-1">
                  Pantau perkembangan laporan di lingkungan sekitar
                </p>
              </div>
              <button className="bg-white px-5 py-2.5 rounded-xl text-[#0891B2] font-bold shadow-sm border border-cyan-100 hover:bg-cyan-50 transition flex items-center gap-2">
                Lihat Semua <span className="text-xl">→</span>
              </button>
            </div>

            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-8 transition-all duration-500 ${
                sidebarOpen ? "lg:grid-cols-3" : "lg:grid-cols-4"
              }`}
            >
              {[...laporan]
                .sort((a, b) => new Date(b.create_at) - new Date(a.create_at))
                .slice(0, 6)
                .map((item) => (
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
          </div>
        </div>
      </section>
    </main>
  );
}
