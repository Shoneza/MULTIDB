"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      return;
    }
    // Front-end only: simulate success and redirect
    alert(`Logged in as ${username} (front-end only)`);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-6xl p-8">
        <div className="flex items-center gap-8">
          {/* Left large title */}
          <div className="flex-1 text-left">
            <h1 className="text-5xl font-bold text-cyan-400 underline decoration-cyan-400/80 mb-6 leading-tight">
              ASEAN
              <br />
              PARAGAMES
              <br />
              2025
            </h1>
          </div>

          {/* Right login card */}
          <div className="w-96 bg-gray-800 rounded-2xl p-8 shadow-xl">
            <h2 className="text-4xl font-semibold text-gray-200 mb-6 text-center">LOGIN</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="text-xs text-cyan-300 block mb-1">USERNAME</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-200 text-black rounded px-3 py-2 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="text-xs text-cyan-300 block mb-1">PASSWORD</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-200 text-black rounded px-3 py-2 focus:outline-none"
                />
              </div>

              {error && <div className="text-red-400 text-sm mb-3">{error}</div>}

              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => router.push('/register')}
                  className="px-4 py-2 bg-gray-200 text-black rounded-full"
                >
                  Register
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-300 text-black rounded-full"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}