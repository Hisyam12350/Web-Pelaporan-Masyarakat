"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function handleLogin(r) {
    r.preventDefault();

    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Email dan Password Tidak Boleh Kosong",
        confirmButtonColor: "#06B6D4",
      });
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.token) {
        const playLoad = JSON.parse(atob(data.token.split(".")[1]));
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Login Berhasil!",
          timer: 1500,
          showConfirmButton: false,
        });

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("id", playLoad.id);

        if (data.role === "admin") {
          router.push("/admin/home");
        } else if (data.role === "super admin") {
          router.push("/superAdmin/home");
        } else {
          router.push("/home");
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal Login",
          confirmButtonColor: "#06B6D4",
          text: data.message || "Email atau password salah!",
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
    <div className="min-h-screen bg-[#F0F9FF] flex flex-col items-center justify-center px-4 font-sans">
      {/* Title dengan warna Slate-900 */}
      <h1 className="text-[#0F172A] text-6xl font-extrabold mb-12 tracking-tight">
        Lapor <span className="text-[#06B6D4]">!</span>
      </h1>

      {/* Card Putih Bersih dengan Shadow Lembut */}
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl shadow-cyan-100 p-10 border border-cyan-100">
        <form onSubmit={handleLogin}>
          {/* Input Email */}
          <div className="mb-6">
            <label className="block text-[#0F172A] font-semibold mb-2 ml-1">
              Email Address
            </label>
            <input
              onChange={(f) => setEmail(f.target.value)}
              type="email"
              placeholder="name@example.com"
              className="w-full border-2 border-gray-100 rounded-2xl px-5 py-4 outline-none bg-gray-50 text-[#0F172A] text-lg focus:border-[#06B6D4] focus:bg-white transition-all duration-200"
            />
          </div>

          {/* Input Password */}
          <div className="mb-10">
            <label className="block text-[#0F172A] font-semibold mb-2 ml-1">
              Password
            </label>
            <input
              onChange={(f) => setPassword(f.target.value)}
              type="password"
              placeholder="••••••••"
              className="w-full border-2 border-gray-100 rounded-2xl px-5 py-4 outline-none bg-gray-50 text-[#0F172A] text-lg focus:border-[#06B6D4] focus:bg-white transition-all duration-200"
            />
          </div>

          {/* Button Primary (Cyan-500) ke Secondary (Cyan-600) */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-[#06B6D4] hover:bg-[#0891B2] text-white text-2xl font-bold py-4 rounded-2xl shadow-lg shadow-cyan-200 hover:shadow-cyan-300 transform hover:-translate-y-1 transition duration-300"
            >
              Login
            </button>
          </div>
        </form>

        {/* Register Text */}
        <p className="text-center text-slate-500 mt-8 text-lg">
          Don’t have an account?{" "}
          <Link href="/register">
            <button className="text-[#0891B2] font-bold hover:text-[#06B6D4] hover:underline transition-colors">
              Register
            </button>
          </Link>
        </p>
      </div>
    </div>
  );
}
