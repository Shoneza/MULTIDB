"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim() || !confirm.trim()) {
      setError("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    if (password !== confirm) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }
    // save to localStorage only as pending until profile completed
    const stored = localStorage.getItem('registeredUsers');
    const users: Record<string, string> = stored ? JSON.parse(stored) : {};
    if (users[username]) {
      setError('ชื่อผู้ใช้นี้ได้รับการลงทะเบียนแล้ว');
      return;
    }
    // store pending info
    localStorage.setItem('pendingRegistration', JSON.stringify({ username, password }));
    localStorage.setItem('activeUser', username);
    alert(`Registered ${username}, please complete your athlete profile`);
    router.push('/athlete-form');
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-6xl p-8">
        <div className="flex items-center gap-8">
          <div className="flex-1 text-left">
            <h1 className="text-4xl font-bold text-cyan-400 mb-6 leading-tight">
              ASEAN
              <br />
              PARAGAMES
              <br />
              2025
            </h1>
          </div>

          <div className="w-80 bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-200 mb-4 text-center">REGISTER</h2>
            <form onSubmit={handleConfirm}>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="USERNAME"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-200 text-black rounded px-3 py-2 text-sm"
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  placeholder="PASSWORD"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-200 text-black rounded px-3 py-2 text-sm"
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  placeholder="CONFIRM PASSWORD"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full bg-gray-200 text-black rounded px-3 py-2 text-sm"
                />
              </div>

              {error && <div className="text-red-400 text-sm mb-3">{error}</div>}

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="px-4 py-2 bg-gray-200 text-black rounded-full text-sm"
                >
                  LOGIN
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-300 text-black rounded-full text-sm"
                >
                  CONFIRM
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}