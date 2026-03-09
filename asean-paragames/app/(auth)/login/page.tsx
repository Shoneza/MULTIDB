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
    const stored = localStorage.getItem('registeredUsers');
    const users: Record<string, string> = stored ? JSON.parse(stored) : {};
    if (!users[username] || users[username] !== password) {
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      return;
    }
    // mark active user and fake an ID if none exists
    // store active user + resolve their numeric id
    localStorage.setItem('activeUser', username);
    const idsStored = localStorage.getItem('userIds');
    const userIds: Record<string, number> = idsStored ? JSON.parse(idsStored) : {};
    let id = userIds[username];
    if (!id) {
      // assign a new id now so we can track this user even before profile fill
      const next = Number(localStorage.getItem('nextUserId') || '1');
      id = next;
      userIds[username] = id;
      localStorage.setItem('userIds', JSON.stringify(userIds));
      localStorage.setItem('nextUserId', String(next + 1));
      // update reverse map as well
      const idMapStored = localStorage.getItem('idToUser');
      const idMap: Record<number, string> = idMapStored ? JSON.parse(idMapStored) : {};
      idMap[id] = username;
      localStorage.setItem('idToUser', JSON.stringify(idMap));
    }
    localStorage.setItem('activeUserId', String(id));

    // determine next page based on profile
    const storedProfiles = localStorage.getItem('userProfiles');
    const profiles: Record<string, any> = storedProfiles ? JSON.parse(storedProfiles) : {};
    alert(`Logged in as ${username}`);
    if (!profiles[username]) {
      router.push("/athlete-form");
    } else {
      // go straight to athlete dashboard rather than homepage
      router.push("/athlete/beforeJoin");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-6xl p-8">
        <div className="flex items-center gap-8">
          <div className="flex-1 text-left">
            <h1 className="text-5xl font-bold text-cyan-400 underline decoration-cyan-400/80 mb-6 leading-tight">
              ASEAN
              <br />
              PARAGAMES
              <br />
              2025
            </h1>
          </div>

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