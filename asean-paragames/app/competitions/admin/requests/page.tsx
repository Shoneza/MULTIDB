"use client";

import { useState } from "react";

type Athlete = {
  id: number;
  date: string;
  name: string;
  sex: string;
  weight: number;
  height: number;
  disability: string;
};

/* ================= MOCK DATA (MANY ROWS FOR SCROLL TEST) ================= */
const mockData: Athlete[] = Array.from({ length: 35 }, (_, i) => ({
  id: i + 1,
  date: i % 2 ? "16/01/2028" : "17/01/2028",
  name: `Athlete Full Name Example ${i + 1}`, // long name to expand width
  sex: i % 2 ? "Male" : "Female",
  weight: 55 + (i % 10),
  height: 160 + (i % 20),
  disability: i % 2 ? "Visual Impair" : "Hearing Impair",
}));

export default function AdminTicketPage() {
  const [athletes, setAthletes] = useState<Athlete[]>(mockData);
  const [selected, setSelected] = useState<number[]>([]);
  const [showFilter, setShowFilter] = useState(false);

  const toggleSelect = (id: number) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(v => v !== id)
        : [...prev, id]
    );
  };

  const removeSelected = (action: "accept" | "deny") => {
    if (selected.length === 0) {
      alert("No selection");
      return;
    }

    setAthletes(prev => prev.filter(a => !selected.includes(a.id)));
    setSelected([]);
    alert(action === "accept" ? "Accepted" : "Denied");
  };

  return (
    <div className="grid grid-cols-[1fr_320px] h-screen bg-[#0e0f12] text-gray-200">

      {/* ================= MAIN ================= */}
      <main className="p-8 relative">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-wide">REQUEST</h1>

            {selected.length > 0 && (
              <span className="text-sm text-gray-400">
                {selected.length} item{selected.length > 1 ? "s" : ""} selected
              </span>
            )}
          </div>

          <button
            onClick={() => setShowFilter(!showFilter)}
            className="bg-[#2a2d33] hover:bg-[#3a3f46] px-4 py-2 rounded"
          >
            FILTER
          </button>
        </div>

        {/* FILTER PANEL */}
        {showFilter && (
          <div className="absolute right-8 top-16 w-64 bg-[#2a2d33] p-5 rounded-lg shadow-xl z-50">

            <p className="text-gray-300 font-semibold mb-2">Date</p>
            <label className="block text-sm">
              <input type="checkbox" className="mr-2" /> Ascending
            </label>
            <label className="block text-sm">
              <input type="checkbox" className="mr-2" /> Descending
            </label>

            <hr className="my-3 border-gray-600" />

            <p className="text-gray-300 font-semibold mb-2">Disability</p>
            <label className="block text-sm">
              <input type="checkbox" className="mr-2" /> Visual Impair
            </label>
            <label className="block text-sm">
              <input type="checkbox" className="mr-2" /> Hearing Impair
            </label>

            <hr className="my-3 border-gray-600" />

            <p className="text-gray-300 font-semibold mb-2">Gender</p>
            <label className="block text-sm">
              <input type="checkbox" className="mr-2" /> Male
            </label>
            <label className="block text-sm">
              <input type="checkbox" className="mr-2" /> Female
            </label>
          </div>
        )}

        {/* ================= TABLE CONTAINER (SCROLLABLE) ================= */}
        <div className="border border-[#2a2d33] rounded-lg overflow-hidden mt-4 max-h-[520px] overflow-y-auto">

          <table className="w-full border-collapse">

            <thead className="bg-[#2a2d33] text-sm text-gray-300 sticky top-0 z-10">
              <tr>
                <th className="p-3 w-12"></th>
                <th className="p-3 text-left w-[140px]">Date</th>
                <th className="p-3 text-left min-w-[320px]">Name</th>
                <th className="p-3 text-left w-[120px]">Sex</th>
                <th className="p-3 text-left w-[100px]">Weight</th>
                <th className="p-3 text-left w-[100px]">Height</th>
                <th className="p-3 text-left min-w-[160px]">Disability</th>
              </tr>
            </thead>

            <tbody>
              {athletes.map(a => (
                <tr
                  key={a.id}
                  className="border-t border-gray-800 hover:bg-[#15171b]"
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(a.id)}
                      onChange={() => toggleSelect(a.id)}
                    />
                  </td>
                  <td className="p-3">{a.date}</td>
                  <td className="p-3">{a.name}</td>
                  <td className="p-3">{a.sex}</td>
                  <td className="p-3">{a.weight}</td>
                  <td className="p-3">{a.height}</td>
                  <td className="p-3">{a.disability}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-5 space-x-3">
          <button
            onClick={() => removeSelected("accept")}
            className="bg-sky-300 text-black px-6 py-2 rounded font-semibold hover:bg-sky-400"
          >
            ACCEPT
          </button>

          <button
            onClick={() => removeSelected("deny")}
            className="bg-sky-300 text-black px-6 py-2 rounded font-semibold hover:bg-sky-400"
          >
            DENY
          </button>
        </div>
      </main>

      {/* ================= RIGHT PANEL ================= */}
      <aside className="border-l border-gray-800 p-6">
        <p className="text-gray-400 text-sm mb-3">UPCOMING TOURNAMENT</p>
        <p>Tournament Name</p>
        <p>Location</p>
        <p className="text-yellow-400 font-bold">Timer</p>

        <p className="text-gray-400 text-sm mt-6 mb-2">ANNOUNCEMENT</p>
        <div className="bg-[#2a2d33] h-12 rounded mb-2"></div>
        <div className="bg-[#2a2d33] h-12 rounded mb-2"></div>
        <div className="bg-[#2a2d33] h-12 rounded"></div>
      </aside>

      {/* LOGOUT BUTTON */}
      <button
        onClick={async () => {
          const { logout } = await import("@/app/actions/auth");
          await logout();
        }}
        className="fixed bottom-4 left-4 px-4 py-2 bg-red-500 text-white rounded-full font-semibold hover:bg-red-400 transition"
      >
        Logout
      </button>

    </div>
  );
}

