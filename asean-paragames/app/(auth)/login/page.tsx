"use client";

import { useState, useActionState } from "react";
import { login } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined)
  const router = useRouter();
  const [error, setError] = useState("");


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
            <form action={formAction}>
              <div className="mb-4">
                <label className="text-xs text-cyan-300 block mb-1">EMAIL</label>
                <input
                  
                  name="email"
                  type="email"
            
                  className="w-full bg-gray-200 text-black rounded px-3 py-2 focus:outline-none"
                />
              </div>
              {state?.errors?.email && <p className="text-red-400 text-xs mt-1">{state.errors.email[0]}</p>}
              <div className="mb-4">
                <label className="text-xs text-cyan-300 block mb-1">PASSWORD</label>
                <input
                name="password"
                  type="password"
                  className="w-full bg-gray-200 text-black rounded px-3 py-2 focus:outline-none"
                />
              </div>

             {state?.errors?.password && <p className="text-red-400 text-xs mt-1">{state.errors.password[0]}</p>}

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
                  disabled={pending}
                  className="px-4 py-2 bg-gray-300 text-black rounded-full"
                >
                  {pending ? "REGISTERING..." : "CONFIRM"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}