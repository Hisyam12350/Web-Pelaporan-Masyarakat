"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useState } from "react";

export default function Monitoring() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("id");
    setUserId(id);

    if (!token) {
      window.location.href = "/";
      return;
    } else if (role === "admin") {
      window.location.href = "/";
      return;
    } else if (role === "users") {
      window.location.href = "/";
      return;
    }

    fetch("http://localhost:5000/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      });
  }, []);

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
            <Link href="/superAdmin/kategori">
              <button className="hover:bg-slate-800 px-6 py-4 rounded-2xl text-left transition whitespace-nowrap w-full text-slate-300 hover:text-white font-medium">
                Kategori
              </button>
            </Link>
            <button className="bg-[#06B6D4] text-white px-6 py-4 rounded-2xl text-left font-bold whitespace-nowrap shadow-lg shadow-cyan-900/20 w-full">
              Monitoring
            </button>
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
        {/* HEADER TOP (Dengan Toggle Button) */}
        <div className="p-6 md:p-10 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* Burger/Toggle Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-600 hover:text-cyan-500 transition-all"
            >
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-black text-[#0F172A] tracking-tight uppercase">
                Monitoring User & Admin
              </h1>
              <p className="text-slate-500 text-sm font-medium">
                Pemisahan data berdasarkan otoritas sistem.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Total Nodes
              </p>
              <p className="text-xl font-black text-cyan-600">
                {users.data?.length || 0}
              </p>
            </div>
          </div>
        </div>

        {/* TWO COLUMN LAYOUT (SCROLLABLE) */}
        <div className="flex-1 px-6 md:px-10 pb-10 overflow-hidden">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full">
            {/* KOLOM KIRI: ADMINISTRATOR */}
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-black text-[#0F172A] uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                  <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                  Staff Otoritas
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                {users.data &&
                  users.data
                    .filter((u) => u.role?.toLowerCase().includes("admin"))
                    .map((user) => (
                      <div
                        key={user.id}
                        className="group bg-[#0F172A] p-5 rounded-[28px] shadow-lg border border-slate-800 hover:border-rose-500/50 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl border-2 border-slate-700 overflow-hidden bg-slate-800 shrink-0 group-hover:scale-105 transition-all">
                            <img
                              src={
                                user?.fotoProfile
                                  ? `http://localhost:5000/gambar/${user.fotoProfile}`
                                  : "https://i.pinimg.com/736x/96/e2/a7/96e2a7d987ce19f693d39f131cda092a.jpg"
                              }
                              alt="avatar"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-black text-white uppercase tracking-tight italic">
                                {user.username}
                              </h4>
                              <span className="text-[8px] bg-rose-500 text-white px-2 py-0.5 rounded font-black uppercase tracking-widest">
                                {user.role}
                              </span>
                            </div>
                            <p className="text-slate-500 text-[11px] font-medium tracking-wide">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            </div>

            {/* KOLOM KANAN: REGULAR USERS */}
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-black text-[#0F172A] uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                  Public Access
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                {users.data &&
                  users.data
                    .filter(
                      (u) =>
                        u.role?.toLowerCase().includes("user") &&
                        u.role?.toLowerCase() !== "superadmin",
                    )
                    .map((user) => (
                      <div
                        key={user.id}
                        className="group bg-white p-5 rounded-[28px] shadow-sm hover:shadow-md transition-all border border-slate-100 hover:border-cyan-100"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl border-2 border-slate-50 overflow-hidden bg-slate-100 shrink-0 group-hover:scale-105 transition-all">
                            <img
                              src={
                                user?.fotoProfile
                                  ? `http://localhost:5000/gambar/${user.fotoProfile}`
                                  : "https://i.pinimg.com/736x/96/e2/a7/96e2a7d987ce19f693d39f131cda092a.jpg"
                              }
                              alt="avatar"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-black text-[#0F172A] uppercase tracking-tight">
                                {user.username}
                              </h4>
                              <div className="flex items-center gap-1">
                                <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                                <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">
                                  Active
                                </span>
                              </div>
                            </div>
                            <p className="text-slate-400 text-[11px] font-medium tracking-wide">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
