"use client";

import { useState } from "react";

type Athlete = {
  id: number;
  firstName: string;
  surname: string;
  nationality: string;
  disability: string;
};

const DISABILITY_OPTIONS = [
  "None",
  "Visual",
  "Hearing",
  "Physical",
  "Intellectual",
];

export default function AthleteListPage() {
  const [athletes, setAthletes] = useState<Athlete[]>([]);

  // pool of athletes shown inside the selection modal
  const [available, setAvailable] = useState<Athlete[]>([
    { id: 1, firstName: "Somchai", surname: "Somsri", nationality: "Thailand", disability: "T" },
    { id: 2, firstName: "Aung", surname: "Tin", nationality: "Myanmar", disability: "T" },
    { id: 3, firstName: "Test1", surname: "Test1", nationality: "Thailand", disability: "T" },
    { id: 4, firstName: "Test2", surname: "Test2", nationality: "Myanmar", disability: "T" },
    { id: 5, firstName: "Test3", surname: "Test3", nationality: "Myanmar", disability: "T" },
    { id: 6, firstName: "Test4", surname: "Test4", nationality: "Vietnam", disability: "T" },
    { id: 7, firstName: "Test5", surname: "Test5", nationality: "Thailand", disability: "T" },
    { id: 8, firstName: "Test6", surname: "Test6", nationality: "Thailand", disability: "T" },
    { id: 9, firstName: "Test7", surname: "Test7", nationality: "Laos", disability: "T" },
    { id: 10, firstName: "Test8", surname: "Test8", nationality: "Laos", disability: "T" },
    { id: 11, firstName: "Test9", surname: "Test9", nationality: "Laos", disability: "T" },
  ]);

  const [showSelectionModal, setShowSelectionModal] = useState(false);

  const [selected, setSelected] = useState<Record<number, boolean>>({});

  

  function toggleSelect(id: number) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  const selectedCount = Object.values(selected).filter(Boolean).length;

  function addSelectedToList() {
    const ids = Object.entries(selected).filter(([, v]) => v).map(([k]) => Number(k));
    if (ids.length === 0) {
      setShowSelectionModal(false);
      return;
    }

    const toAdd = available.filter((a) => ids.includes(a.id) && !athletes.some((x) => x.id === a.id));
    if (toAdd.length) {
      setAthletes((cur) => [...toAdd, ...cur]);
      setAvailable((cur) => cur.filter((a) => !ids.includes(a.id)));
    }
    setSelected({});
    setShowSelectionModal(false);
  }

  return (
    <div className="min-h-screen p-8 bg-black text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Athlete List</h1>
          <button onClick={() => setShowSelectionModal(true)} className="bg-cyan-400 text-black px-4 py-2 rounded-full">Add Athlete</button>
        </div>

        <div className="bg-[#0f1720] rounded-xl p-4">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="text-gray-300 text-sm">
                <th className="w-16 py-2">No.</th>
                <th className="py-2">Name</th>
                <th className="py-2">Nationality</th>
              </tr>
            </thead>
            <tbody>
              {athletes.map((a, idx) => (
                <tr key={a.id} className="border-t border-gray-800">
                  <td className="py-3">{idx + 1}</td>
                  <td className="py-3">{a.firstName} {a.surname}</td>
                  <td className="py-3">{a.nationality}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showSelectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-40">
          <div className="relative bg-[#4a5960] rounded-2xl p-4 w-full max-w-4xl border-4 border-[#3b4a51]">
            <button onClick={() => setShowSelectionModal(false)} className="absolute top-3 right-3 text-white">X</button>
            <div className="flex items-center justify-between px-3 pb-3">
              <div className="text-sm uppercase text-cyan-200">{selectedCount} LISTS SELECTED</div>
              <button onClick={addSelectedToList} className="bg-cyan-400 text-black px-3 py-1 rounded-full text-sm">Add</button>
            </div>

            <div className="bg-black rounded-md p-2">
              <div className="w-full overflow-y-auto max-h-64">
                <table className="w-full text-left table-fixed">
                  <thead>
                    <tr className="text-gray-300 text-sm">
                      <th className="w-10"> </th>
                      <th className="w-16 py-2">No.</th>
                      <th className="py-2">Name</th>
                      <th className="w-40 py-2">Nationality</th>
                    </tr>
                  </thead>
                  <tbody>
                    {available.map((a, idx) => (
                      <tr key={a.id} className="border-t border-gray-800">
                        <td className="p-2">
                          <input
                            type="checkbox"
                            checked={!!selected[a.id]}
                            onChange={() => toggleSelect(a.id)}
                          />
                        </td>
                        <td className="p-2">{idx + 1}</td>
                        <td className="p-2">{a.firstName} {a.surname}</td>
                        <td className="p-2">{a.nationality}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
}
