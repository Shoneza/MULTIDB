"use client";

import { useEffect, useState, useRef } from "react";

type Section = "description" | "athletes" | "scoreboard";

type Athlete = {
  id: number;
  firstName: string;
  surname: string;
  nationality: string;
  disability: string;
  attempts: number[];
};

const DISABILITY_OPTIONS = [
  "None",
  "Visual",
  "Hearing",
  "Physical",
  "Intellectual",
];

export default function TournamentDetailPage() {

  const [activeSection, setActiveSection] = useState<Section>("description");

  const [athletes, setAthletes] = useState<Athlete[]>([]);

  const [available, setAvailable] = useState<Athlete[]>([
    { id: 1, firstName: "Somchai", surname: "Somsri", nationality: "Thailand", disability: "T", attempts: [] },
    { id: 2, firstName: "Aung", surname: "Tin", nationality: "Myanmar", disability: "T", attempts: [] },
    { id: 3, firstName: "Test1", surname: "Test1", nationality: "Thailand", disability: "T", attempts: [] },
    { id: 4, firstName: "Test2", surname: "Test2", nationality: "Myanmar", disability: "T", attempts: [] },
    { id: 5, firstName: "Test3", surname: "Test3", nationality: "Myanmar", disability: "T", attempts: [] },
    { id: 6, firstName: "Test4", surname: "Test4", nationality: "Vietnam", disability: "T", attempts: [] },
    { id: 7, firstName: "Test5", surname: "Test5", nationality: "Thailand", disability: "T", attempts: [] },
    { id: 8, firstName: "Test6", surname: "Test6", nationality: "Thailand", disability: "T", attempts: [] },
    { id: 9, firstName: "Test7", surname: "Test7", nationality: "Laos", disability: "T", attempts: [] },
    { id: 10, firstName: "Test8", surname: "Test8", nationality: "Laos", disability: "T", attempts: [] },
    { id: 11, firstName: "Test9", surname: "Test9", nationality: "Laos", disability: "T", attempts: [] },
  ]);

  const [showSelectionModal, setShowSelectionModal] = useState(false);

  const [selected, setSelected] = useState<Record<number, boolean>>({});

  const maxAttempts = Math.max(...athletes.map(a => a.attempts.length), 0);

  const [editing, setEditing] = useState<{ athleteId: number; attemptIdx: number } | null>(null);

  const [editValue, setEditValue] = useState("");

  const descriptionRef = useRef<HTMLElement | null>(null);
  const athletesRef = useRef<HTMLElement | null>(null);
  const scoreboardRef = useRef<HTMLElement | null>(null);

  // ===============================
  // SCROLL SPY (auto highlight sidebar)
  // ===============================
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as Section);
          }
        });
      },
      {
        rootMargin: "-40% 0px -50% 0px", // trigger when near middle
        threshold: 0
      }
    );

    if (descriptionRef.current) observer.observe(descriptionRef.current);
    if (athletesRef.current) observer.observe(athletesRef.current);
    if (scoreboardRef.current) observer.observe(scoreboardRef.current);

    return () => observer.disconnect();
  }, []);

  // ===============================
  // SCROLL TO SECTION
  // ===============================
  const scrollTo = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  function toggleSelect(id: number) {
    const currently = !!selected[id];
    const count = Object.values(selected).filter(Boolean).length;
    if (!currently && count >= 8) {
      alert("เลือกได้สูงสุด 8 รายการ");
      return;
    }
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
    <div className="flex bg-black text-white max-h-f-full">

      {/* ===============================
          SIDEBAR
      =============================== */}
      <aside className="w-64 p-6 border-r border-gray-800 sticky top-0 h-screen">

        <h2 className="text-cyan-400 text-xl font-bold mb-8">
          ASEAN PARAGAMES 2025
        </h2>

        <nav className="space-y-4 text-sm">

          <button
            onClick={() => scrollTo(descriptionRef)}
            className={`block border-l-4 pl-3 ${
              activeSection === "description"
                ? "border-cyan-400 text-white"
                : "border-transparent text-gray-400"
            }`}
          >
            DESCRIPTION
          </button>

          <button
            onClick={() => scrollTo(athletesRef)}
            className={`block border-l-4 pl-3 ${
              activeSection === "athletes"
                ? "border-cyan-400 text-white"
                : "border-transparent text-gray-400"
            }`}
          >
            ATHLETE LIST
          </button>

          <button
            onClick={() => scrollTo(scoreboardRef)}
            className={`block border-l-4 pl-3 ${
              activeSection === "scoreboard"
                ? "border-cyan-400 text-white"
                : "border-transparent text-gray-400"
            }`}
          >
            SCOREBOARD
          </button>

        </nav>
      </aside>

      {/* ===============================
          CONTENT
      =============================== */}
      <main className="flex-1 px-16 py-12 space-y-32 overflow-y-auto">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center mb-12">
          [COMPETITION NAME]
        </h1>

        {/* ===============================
            DESCRIPTION
        =============================== */}
        <section id="description" ref={descriptionRef}>
          <div className="bg-gray-900 p-10 rounded-2xl max-w-3xl mx-auto">
            <h2 className="text-2xl mb-6">DESCRIPTION</h2>

            <p className="text-gray-400 mb-2">
              SPORT TYPE: [SPORT NAME]
            </p>
            <p className="text-gray-400 mb-2">
              DISABILITY TYPE: [DISABILITY]
            </p>
            <p className="text-gray-400 mb-2">
              GENDER: [GENDER]
            </p>
            <p className="text-gray-400 mb-2">
              SCHEDULE: [DATE & TIME]
            </p>
            
          </div>
        </section>

        {/* ===============================
            ATHLETES
        =============================== */}
        <section id="athletes" ref={athletesRef}>
          <div className="bg-gray-900 p-10 rounded-2xl max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl">ATHLETES</h2>
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
        </section>

        {/* ===============================
            SCOREBOARD
        =============================== */}
        <section id="scoreboard" ref={scoreboardRef}>
          <div className="bg-gray-900 p-10 rounded-2xl max-w-3xl mx-auto">
            <h2 className="text-2xl mb-6">SCOREBOARD</h2>

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
                      <td className="py-3 px-6 border-b border-[#22304a] font-semibold text-cyan-200 whitespace-nowrap">{athlete.firstName} {athlete.surname}</td>
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
        </section>

      </main>

      {showSelectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-40">
          <div className="relative bg-[#4a5960] rounded-2xl p-4 w-full max-w-4xl border-4 border-[#3b4a51]">
            <button onClick={() => setShowSelectionModal(false)} className="absolute top-3 right-3 text-white">X</button>
            <div className="flex items-center justify-between px-3 pb-3">
              <div className={`text-sm uppercase ${selectedCount >= 8 ? 'text-red-400' : 'text-cyan-200'}`}>{selectedCount} LISTS SELECTED</div>
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
                            disabled={selectedCount >= 8 && !selected[a.id]}
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
