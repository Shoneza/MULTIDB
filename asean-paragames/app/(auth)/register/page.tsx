"use client";

import { useState,useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/app/actions/auth";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(register, undefined)
  const router = useRouter();
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
            <form action={formAction}>
              <div className="mb-3">
                <input
                  name="username"
                  type="text"
                  placeholder="USERNAME"
                  className="w-full bg-gray-200 text-black rounded px-3 py-2 text-sm"
                />
              </div>
              {state?.errors?.username && <p className="text-red-400 text-xs mt-1">{state.errors.username[0]}</p>}
              <div className="mb-3">
                <input
                  name="email"
                  type="email"
                  placeholder="EMAIL"
                  className="w-full bg-gray-200 text-black rounded px-3 py-2 text-sm">
                  </input>
                  {state?.errors?.email && <p className="text-red-400 text-xs mt-1">{state.errors.email[0]}</p>}
              </div>
              
              <div className="mb-3">
                <input
                  name="password"
                  type="password"
                  placeholder="PASSWORD"
                  className="w-full bg-gray-200 text-black rounded px-3 py-2 text-sm"
                />
                {state?.errors?.password && <p className="text-red-400 text-xs mt-1">{state.errors.password[0]}</p>}
              </div>
              <div className="mb-4">
                <input
                name="confirmPassword"
                  type="password"
                  placeholder="CONFIRM PASSWORD"
                  className="w-full bg-gray-200 text-black rounded px-3 py-2 text-sm"
                />
                {state?.errors?.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">{state.errors.confirmPassword[0]}</p>
                )}
              </div>
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
                  disabled={pending}
                  className="px-4 py-2 bg-gray-300 text-black rounded-full text-sm"
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