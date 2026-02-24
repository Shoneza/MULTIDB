"use client";


import React, { useState } from "react";

type Athlete = {
  id: number;
  name: string;
  nationality: string;
  attempts: number[];
};

const initialAthletes: Athlete[] = [
  { id: 1, name: "Somchai DDDD", nationality: "Thailand", attempts: [8.5, 9.1, 9.3] },
  { id: 2, name: "BOB XXXX", nationality: "Myanmar", attempts: [8.7, 8.9, 9.0] },
  { id: 3, name: "Sombut XX", nationality: "Laos", attempts: [7.5, 8.1, 8.0] },
];

export default function AttemptListPage() {
  const [athletes, setAthletes] = useState<Athlete[]>(initialAthletes);
  const maxAttempts = Math.max(...athletes.map(a => a.attempts.length));

  const handleAddAttempt = (athleteId: number) => {
    const score = prompt("กรอกคะแนน Attempt ใหม่:");
    if (score) {
      setAthletes(athletes =>
        athletes.map(a =>
          a.id === athleteId
            ? { ...a, attempts: [...a.attempts, parseFloat(score)] }
            : a
        )
      );
    }
  };

  // Score edit state
  const [editing, setEditing] = useState<{ athleteId: number; attemptIdx: number } | null>(null);
  const [editValue, setEditValue] = useState("");

  function handleEditScore(athleteId: number, attemptIdx: number, currentScore: number | undefined) {
    setEditing({ athleteId, attemptIdx });
    setEditValue(currentScore !== undefined ? String(currentScore) : "");
  }

  function handleSaveScore() {
    if (!editing) return;
    setAthletes((athletes) =>
      athletes.map((a) => {
        if (a.id === editing.athleteId) {
          const newAttempts = [...a.attempts];
          newAttempts[editing.attemptIdx] = parseFloat(editValue);
          return { ...a, attempts: newAttempts };
        }
        return a;
      })
    );
    setEditing(null);
    setEditValue("");
  }

  return (
    <div className="min-h-screen bg-[#0f1720] py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-cyan-300 mb-6 text-center drop-shadow">Attempt List</h2>
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="w-full border-separate border-spacing-0 bg-[#1a2233] text-white">
            <thead>
              <tr className="bg-gradient-to-r from-cyan-700 to-blue-500 text-cyan-100">
                <th className="py-3 px-4 border-b border-cyan-800 text-left w-12">No.</th>
                <th className="py-3 px-6 border-b border-cyan-800 text-left w-56 min-w-[180px]">Name</th>
                <th className="py-3 px-4 border-b border-cyan-800 text-left w-32">Nationality</th>
                {[...Array(maxAttempts)].map((_, i) => (
                  <th key={i} className="py-3 px-4 border-b border-cyan-800 text-center">Attempt {i + 1}</th>
                ))}
                <th className="py-3 px-4 border-b border-cyan-800 text-center"></th>
              </tr>
            </thead>
            <tbody>
              {athletes.map((athlete, idx) => (
                <tr key={athlete.id} className="even:bg-[#182030] hover:bg-[#22304a] transition-colors">
                  <td className="py-3 px-4 border-b border-[#22304a] text-center">{idx + 1}</td>
                  <td className="py-3 px-6 border-b border-[#22304a] font-semibold text-cyan-200 whitespace-nowrap">{athlete.name}</td>
                  <td className="py-3 px-4 border-b border-[#22304a] text-cyan-100">{athlete.nationality}</td>
                  {[...Array(maxAttempts)].map((_, i) => (
                    <td key={i} className="py-3 px-4 border-b border-[#22304a] text-center">
                      {editing && editing.athleteId === athlete.id && editing.attemptIdx === i ? (
                        <div className="flex flex-col items-center gap-2">
                          <input
                            type="number"
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            className="bg-gray-200 text-black rounded px-2 py-1 w-16 text-sm mb-1"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleSaveScore}
                              className="bg-cyan-400 text-black px-2 py-1 rounded text-xs font-bold"
                            >Save</button>
                            <button
                              onClick={() => setEditing(null)}
                              className="bg-gray-400 text-black px-2 py-1 rounded text-xs font-bold"
                            >Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          {athlete.attempts[i] !== undefined ? (
                            <>
                              <span>{athlete.attempts[i]}</span>
                              <button
                                onClick={() => handleEditScore(athlete.id, i, athlete.attempts[i])}
                                className="mt-1 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold"
                              >Edit</button>
                            </>
                          ) : (
                            <>
                              <span className="text-gray-500">-</span>
                              <button
                                onClick={() => handleEditScore(athlete.id, i, undefined)}
                                className="mt-1 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold"
                              >Edit</button>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  ))}
                  <td className="py-3 px-4 border-b border-[#22304a] text-center">
                    <button
                      onClick={() => handleAddAttempt(athlete.id)}
                      className="bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 text-[#0f1720] font-bold px-4 py-2 rounded-full shadow transition-colors"
                    >
                      + Add Attempt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
