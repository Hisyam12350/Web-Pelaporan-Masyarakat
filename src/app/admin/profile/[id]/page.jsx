"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [users, setUsers] = useState(null);
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    nomor_telepon: "",
    alamat: "",
    bio: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (role !== "admin") {
      window.location.href = "/home";
      return;
    }

    if (role === "admin") {
      router.push(`/admin/profile/${id}`);
      return;
    }

    fetch(`http://localhost:5000/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })

      .then((json) => {
        if (json.data && json.data.length > 0) {
          setUsers(json.data[0]);
        } else {
          console.warn("User not found");
          window.location.href = "/login";
        }
      })
      .catch(() => {
        window.location.href = "/login";
      });
  }, [id]);

  async function editUser() {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
          nomor_telepon: form.nomor_telepon,
          alamat: form.alamat,
          bio: form.bio,
        }),
      });

      const data = await res.json();

      if (data.ok) {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data Berhasil Diubah!",
          confirmButtonColor: "#06B6D4",
        });
        setEditOpen(false);
        window.location.reload();
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

  async function handleUpdateGambar() {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", form.image);

      const res = await fetch(`http://localhost:5000/api/users/edit/${id}`, {
        method: "PUT",
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
          text: "Gambar Berhasil Diubah!",
          confirmButtonColor: "#06B6D4",
        });
        setEditOpen(false);
        window.location.reload();
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

  async function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    router.push("/login");
  }

  return (
    <main className="flex min-h-screen bg-[#F0F9FF] font-sans">
      {/* SIDEBAR (Sticky & Full Height) */}
      <aside
        className={`
    bg-[#0F172A] text-white
    transition-all duration-300 ease-in-out
    ${sidebarOpen ? "w-[280px] p-8 opacity-100" : "w-0 p-0 opacity-0"}
    overflow-hidden
    hidden md:flex flex-col shadow-2xl sticky top-0 h-screen
  `}
      >
        <div className={`${sidebarOpen ? "block" : "hidden"}`}>
          <div className="mb-12">
            <Link href="/admin/home">
              <h1 className="text-4xl font-extrabold whitespace-nowrap tracking-tight">
                LAPOR<span className="text-[#06B6D4]">!</span>
              </h1>
            </Link>
            <p className="text-cyan-400 text-sm font-medium mt-1 uppercase tracking-wider whitespace-nowrap">
              Super Admin Panel
            </p>
          </div>

          <nav className="flex flex-col gap-3">
            {/* Tombol Home - Mengikuti style tombol pasif agar konsisten dengan yang atas jika sedang di Dashboard */}
            <Link href="/admin/home">
              <button className="hover:bg-slate-800 px-6 py-4 rounded-2xl text-left transition whitespace-nowrap w-full text-slate-300 hover:text-white font-medium">
                Home
              </button>
            </Link>

            {/* Tombol Dashboard - Menjadi tombol Aktif (Biru) sesuai struktur kode pertama */}
            <Link href="/admin/dashboard">
              <button className="hover:bg-slate-800 px-6 py-4 rounded-2xl text-left transition whitespace-nowrap w-full text-slate-300 hover:text-white font-medium">
                Dashboard
              </button>
            </Link>

            <Link href="/admin/requestKategori">
              <button className="hover:bg-slate-800 px-6 py-4 rounded-2xl text-left transition whitespace-nowrap w-full text-slate-300 hover:text-white font-medium">
                Request Kategori
              </button>
            </Link>

            <button className="bg-[#06B6D4] text-white px-6 py-4 rounded-2xl text-left font-bold whitespace-nowrap shadow-lg shadow-cyan-900/20 w-full">
              Profile
            </button>
          </nav>
        </div>
      </aside>

      <section className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* TOPBAR */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-6">
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
              My Profile
            </h1>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-cyan-50 hidden sm:flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              System Online
            </span>
          </div>
        </div>

        {/* PROFILE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN - Personal Info (4 Cols) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[40px] shadow-xl shadow-cyan-100/50 p-10 border border-cyan-50 relative overflow-hidden">
              {/* Background Decor */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50 rounded-bl-[100px] -z-0"></div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="relative group cursor-pointer">
                  <div className="absolute -inset-2 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <img
                    src={
                      users?.fotoProfile
                        ? `http://localhost:5000/gambar/${users.fotoProfile}`
                        : "https://i.pinimg.com/736x/96/e2/a7/96e2a7d987ce19f693d39f131cda092a.jpg"
                    }
                    alt="profile"
                    className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-2xl"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <label
                      htmlFor="upload-gambar"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <span className="text-white text-[10px] font-bold uppercase tracking-tighter">
                        Ganti Foto
                      </span>
                    </label>
                    <input
                      id="upload-gambar"
                      type="file"
                      accept="image/*"
                      className="hidden" // ← input disembunyikan
                      onChange={(e) =>
                        setForm({ ...form, image: e.target.files[0] })
                      }
                    />
                  </div>
                </div>
                {form.image && (
                  <div className="space-x-2">
                    <button
                      onClick={() => setForm({ ...form, image: null })}
                      className="mt-2 text-xs text-red-500 font-bold"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleUpdateGambar}
                      className="mt-2 text-xs text-cyan-500 font-bold"
                    >
                      Simpan Foto
                    </button>
                  </div>
                )}

                <h2 className="text-2xl font-black mt-6 text-[#0F172A]">
                  {users?.username}
                </h2>
                <p className="text-[#06B6D4] font-bold text-sm tracking-wide">
                  {users?.email}
                </p>
              </div>
            </div>

            {/* Contact Info Card */}
            <div className="bg-white rounded-[40px] p-8 shadow-lg shadow-slate-200/50 border border-slate-100 space-y-6">
              <h4 className="text-sm font-black text-[#0F172A] uppercase tracking-widest px-2">
                Informasi Kontak
              </h4>
              <div className="space-y-4">
                {[
                  { label: "Telepon", value: users?.nomor_telepon, icon: "📞" },
                  { label: "Domisili", value: users?.alamat, icon: "📍" },
                  {
                    label: "Member Since",
                    value: new Date(users?.bergabung).toLocaleDateString(
                      "id-ID",
                      { day: "numeric", month: "long", year: "numeric" },
                    ),
                    icon: "📅",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        {item.label}
                      </p>
                      <p className="text-sm font-bold text-[#0F172A]">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 bg-red-50 text-red-700 py-4 rounded-2xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-red-200 active:scale-95"
                >
                  <span className="text-lg"></span>
                  Keluar dari Akun
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Hero & Settings (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-[#0F172A] rounded-[50px] shadow-2xl p-12 md:p-16 relative overflow-hidden border-b-8 border-[#06B6D4] min-h-[400px] flex items-center">
              {/* Animated Glow Decor */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#06B6D4]/20 rounded-full blur-[100px] animate-pulse"></div>
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"></div>

              <div className="relative z-10 w-full">
                <span className="inline-block bg-cyan-500/10 text-cyan-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-cyan-500/20">
                  Account Control Panel
                </span>
                <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter">
                  Manage Your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                    Identity.
                  </span>
                </h2>
                <p className="text-slate-400 mt-8 text-lg leading-relaxed max-w-xl font-medium">
                  Sesuaikan data diri Anda agar kami dapat memberikan pelayanan
                  yang lebih personal dan cepat dalam menangani setiap aduan
                  Anda.
                </p>

                <div className="flex flex-wrap gap-4 mt-12">
                  <button
                    onClick={() => {
                      setForm({ ...users });
                      setEditOpen(true);
                    }}
                    className="group bg-[#06B6D4] text-white px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-[#0F172A] transition-all duration-500 shadow-2xl shadow-cyan-900/40 flex items-center gap-3"
                  >
                    Ubah Data Profil
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </button>
                  <Link href="/gantiPassword">
                    <button className="px-8 py-5 rounded-2xl font-black te xt-xs uppercase tracking-widest text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 transition-all">
                      Keamanan Akun
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Bio Card */}
            <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-cyan-100/30 border border-cyan-50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-[#0F172A]">
                  Biografi Singkat
                </h3>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">
                  Verified Account
                </span>
              </div>
              <p className="text-slate-500 leading-loose font-medium italic">
                "
                {users?.bio ||
                  "Belum ada biografi yang ditambahkan. Tambahkan biografi untuk mempermudah koordinasi aduan."}
                "
              </p>
            </div>
          </div>
        </div>

        {/* MODAL EDIT */}
        {editOpen && (
          <div className="fixed inset-0 bg-[#0F172A]/90 backdrop-blur-xl flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-2xl rounded-[48px] p-8 md:p-12 relative shadow-2xl border border-white/20 overflow-y-auto max-h-[90vh]">
              {/* CLOSE BUTTON */}
              <button
                onClick={() => setEditOpen(false)}
                className="absolute top-8 right-8 w-12 h-12 rounded-full bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all font-bold flex items-center justify-center"
              >
                ✕
              </button>

              <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-[#0F172A]">
                  Update Info
                </h2>
                <p className="text-slate-400 text-sm mt-2">
                  Perbarui data Anda untuk sistem verifikasi
                </p>
              </div>

              {/* FORM GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">
                    Username
                  </label>
                  <input
                    type="text"
                    value={form.username || ""}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                    className="w-full bg-slate-50 border-none rounded-3xl px-6 py-4 focus:ring-2 focus:ring-cyan-400 transition-all font-bold text-[#0F172A]"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email || ""}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full bg-slate-50 border-none rounded-3xl px-6 py-4 focus:ring-2 focus:ring-cyan-400 transition-all font-bold text-[#0F172A]"
                  />
                </div>

                {/* Telepon - TAMBAHAN BARU */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">
                    Nomor Telepon
                  </label>
                  <input
                    type="text"
                    value={form.nomor_telepon || ""}
                    onChange={(e) =>
                      setForm({ ...form, nomor_telepon: e.target.value })
                    }
                    placeholder="Contoh: 0812..."
                    className="w-full bg-slate-50 border-none rounded-3xl px-6 py-4 focus:ring-2 focus:ring-cyan-400 transition-all font-bold text-[#0F172A]"
                  />
                </div>

                {/* Domisili - TAMBAHAN BARU */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">
                    Domisili Kota
                  </label>
                  <input
                    type="text"
                    value={form.alamat || ""}
                    onChange={(e) =>
                      setForm({ ...form, alamat: e.target.value })
                    }
                    placeholder="Contoh: Jakarta Selatan"
                    className="w-full bg-slate-50 border-none rounded-3xl px-6 py-4 focus:ring-2 focus:ring-cyan-400 transition-all font-bold text-[#0F172A]"
                  />
                </div>
              </div>

              {/* Bio Field */}
              <div className="mt-6 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">
                  Biografi
                </label>
                <textarea
                  rows="3"
                  value={form.bio || ""}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full bg-slate-50 border-none rounded-3xl px-6 py-4 focus:ring-2 focus:ring-cyan-400 transition-all font-bold text-[#0F172A] resize-none"
                />
              </div>

              {/* ACTION BUTTONS */}
              <div className="grid grid-cols-2 gap-4 mt-10">
                <button
                  onClick={editUser}
                  className="bg-[#06B6D4] text-white py-5 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-cyan-200 hover:bg-[#0891B2] transition-all"
                >
                  Simpan Data
                </button>
                <button
                  onClick={() => setEditOpen(false)}
                  className="bg-slate-100 text-slate-400 py-5 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-200 transition-all"
                >
                  Batalkan
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
