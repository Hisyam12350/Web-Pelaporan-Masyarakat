"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("users");
  async function handleRegister(r) {
    r.preventDefault();

    if (!username || !email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        confirmButtonColor: "#06B6D4",
        text: "Username, Email dan Password Tidak Boleh Kosong",
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role: "users" }),
      });

      const data = await res.json();

      if (res.ok) {
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Register Berhasil!",
          timer: 1500,
          showConfirmButton: false,
        });
        router.push("/login");
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
      {/* Title */}
      <h1 className="text-[#0F172A] text-6xl font-extrabold mb-12 tracking-tight">
        Lapor <span className="text-[#06B6D4]">!</span>
      </h1>

      {/* Card Putih Bersih */}
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl shadow-cyan-100 p-10 border border-cyan-100">
        <form onSubmit={handleRegister}>
          {/* Input Username */}
          <div className="mb-5">
            <label className="block text-[#0F172A] font-semibold mb-2 ml-1">
              Username
            </label>
            <input
              onChange={(r) => setUsername(r.target.value)}
              type="text"
              placeholder="Choose a username"
              className="w-full border-2 border-gray-100 rounded-2xl px-5 py-4 outline-none bg-gray-50 text-[#0F172A] text-lg focus:border-[#06B6D4] focus:bg-white transition-all duration-200"
            />
          </div>

          {/* Input Email */}
          <div className="mb-5">
            <label className="block text-[#0F172A] font-semibold mb-2 ml-1">
              Email
            </label>
            <input
              onChange={(r) => setEmail(r.target.value)}
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
              onChange={(r) => setPassword(r.target.value)}
              type="password"
              placeholder="••••••••"
              className="w-full border-2 border-gray-100 rounded-2xl px-5 py-4 outline-none bg-gray-50 text-[#0F172A] text-lg focus:border-[#06B6D4] focus:bg-white transition-all duration-200"
            />
          </div>

          {/* Hidden Input Role */}
          <input onChange={(r) => setRole(r.target.value)} type="hidden" />

          {/* Button Register */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-[#06B6D4] hover:bg-[#0891B2] text-white text-2xl font-bold py-4 rounded-2xl shadow-lg shadow-cyan-200 hover:shadow-cyan-300 transform hover:-translate-y-1 transition duration-300"
            >
              Create Account
            </button>
          </div>
        </form>

        {/* Login Link */}
        <p className="text-center text-slate-500 mt-8 text-lg">
          Already have an account?{" "}
          <Link href="/login">
            <button className="text-[#0891B2] font-bold hover:text-[#06B6D4] hover:underline transition-colors">
              Login
            </button>
          </Link>
        </p>
      </div>
    </div>
  );
}
