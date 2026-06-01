"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

export default function GantiPassword() {
  const router = useRouter();
  const [passwordForm, setPasswordForm] = useState({
    password_lama: "",
    password_baru: "",
    konfirmasi_password: "",
  });

  async function handleGantiPassword() {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");

    if (
      !passwordForm.password_lama ||
      !passwordForm.password_baru ||
      !passwordForm.konfirmasi_password
    ) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Semua field wajib diisi",
      });
      return;
    }

    if (passwordForm.password_baru !== passwordForm.konfirmasi_password) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Password baru tidak cocok!",
      });
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/users/ganti-password/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            password_lama: passwordForm.password_lama,
            password_baru: passwordForm.password_baru,
            konfirmasi_password: passwordForm.konfirmasi_password,
          }),
        },
      );

      const data = await res.json();

      if (data.ok) {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Password berhasil diubah!",
        });
        router.push(`/profil/${id}`);
        setPasswordForm({
          password_lama: "",
          password_baru: "",
          konfirmasi_password: "",
        });
      } else {
        Swal.fire({ icon: "error", title: "Gagal", text: data.message });
      }
    } catch (error) {
      console.log("error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Tidak dapat terhubung ke server",
      });
    }
  }
  return (
    <div className="min-h-screen bg-[#F0F9FF] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-[30px] shadow-xl shadow-cyan-900/5 mb-4 border border-cyan-50">
            <span className="text-4xl">🔐</span>
          </div>
          <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">
            Keamanan Akun
          </h2>
          <p className="text-slate-500 font-medium mt-2">
            Perbarui password Anda secara berkala
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[40px] p-10 shadow-2xl shadow-cyan-900/10 border border-white relative overflow-hidden">
          {/* Dekorasi Aksen */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>

          <div className="space-y-6 relative z-10">
            {/* Input Password Lama */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1">
                Password Saat Ini
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 font-bold text-slate-700 focus:border-cyan-500 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                value={passwordForm.password_lama}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    password_lama: e.target.value,
                  })
                }
              />
            </div>

            <hr className="border-slate-100" />

            {/* Input Password Baru */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1">
                Password Baru
              </label>
              <input
                type="password"
                placeholder="Minimal 8 karakter"
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 font-bold text-slate-700 focus:border-cyan-500 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                value={passwordForm.password_baru}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    password_baru: e.target.value,
                  })
                }
              />
            </div>

            {/* Input Konfirmasi Password */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1">
                Konfirmasi Password Baru
              </label>
              <input
                type="password"
                placeholder="Ulangi password baru"
                className={`w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-bold text-slate-700 focus:bg-white outline-none transition-all placeholder:text-slate-300 ${
                  passwordForm.password_baru && passwordForm.konfirmasi_password
                    ? passwordForm.password_baru ===
                      passwordForm.konfirmasi_password
                      ? "border-emerald-100 focus:border-emerald-500"
                      : "border-rose-100 focus:border-rose-500"
                    : "border-slate-50 focus:border-cyan-500"
                }`}
                value={passwordForm.konfirmasi_password}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    konfirmasi_password: e.target.value,
                  })
                }
              />
            </div>

            {/* Action Button */}
            <button
              onClick={handleGantiPassword}
              className="w-full bg-[#0F172A] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-cyan-600 shadow-xl shadow-cyan-900/10 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-3 group"
            >
              <span>Simpan Perubahan</span>
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
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center mt-8 text-slate-400 text-sm font-medium">
          Lupa password lama?{" "}
          <button className="text-cyan-600 font-bold hover:underline">
            Hubungi IT Support
          </button>
        </p>
      </div>
    </div>
  );
}
