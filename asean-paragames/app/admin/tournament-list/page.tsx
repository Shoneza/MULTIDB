"use client";

import { useState, useEffect } from "react";

interface Competition {
  id: string;
  sportName: string;
  competitionName: string;
  gender: string;
  schedule: string;
}

interface Sport {
  sport_id: number;
  sport_name: string;
}

export default function HomePage() {

  /* =========================
     STATE
  ========================= */

  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // DELETE MODE
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    sportName: "",
    competitionName: "",
    gender: "",
    disabilityType: "",
    schedule: "",
  });

  /* =========================
     FETCH DATA
  ========================= */

  const fetchSports = async () => {
    const res = await fetch("/api/sports");
    const data = await res.json();
    setSports(data);
  };

  const fetchCompetitions = async () => {
    const res = await fetch("/api/competitions");
    const data = await res.json();

    const formatted = data.map((comp: any) => ({
      id: comp.competition_id.toString(),
      sportName: comp.sport_name,
      competitionName: comp.competition_name,
      gender: comp.gender,
      schedule: new Date(comp.date_time).toISOString(),
    }));

    setCompetitions(formatted);
  };

  useEffect(() => {
    fetchSports();
    fetchCompetitions();
  }, []);

  /* =========================
     FORM
  ========================= */

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCompetition = async () => {
    const res = await fetch("/api/competitions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      fetchCompetitions();
      setIsModalOpen(false);
      setFormData({
        sportName: "",
        competitionName: "",
        gender: "",
        disabilityType: "",
        schedule: "",
      });
    }
  };

  /* =========================
     DELETE MODE LOGIC
  ========================= */

  const toggleSelect = (id: string) => {
    if (!deleteMode) return;

    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    await Promise.all(
      selectedIds.map((id) =>
        fetch(`/api/competitions/${id}`, { method: "DELETE" })
      )
    );

    fetchCompetitions();
    setSelectedIds([]);
    setDeleteMode(false);
  };

  const cancelDeleteMode = () => {
    setDeleteMode(false);
    setSelectedIds([]);
  };

  /* =========================
     UI
  ========================= */

  return (
    <div className="flex h-full w-full bg-gray-900 text-white">

      {/* =========================
         MAIN
      ========================= */}

      <main className="flex-1 p-8 overflow-y-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">

          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">
              UPCOMING TOURNAMENT
            </h1>

            {deleteMode && (
              <span className="text-sm text-gray-400">
                {selectedIds.length} tournaments selected
              </span>
            )}
          </div>

          {deleteMode && (
            <div className="flex gap-3">
              <button
                onClick={cancelDeleteMode}
                className="px-4 py-2 border border-cyan-400 text-cyan-400 rounded"
              >
                CANCEL
              </button>

              <button
                onClick={handleDeleteSelected}
                className="px-4 py-2 bg-cyan-400 text-black font-semibold rounded"
              >
                DELETE
              </button>
            </div>
          )}
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {competitions.map((c) => {

            const selected = selectedIds.includes(c.id);

            return (
              <div
                key={c.id}
                onClick={() => toggleSelect(c.id)}
                className={`
                  bg-gray-800 rounded-lg p-6 flex items-center gap-6 border transition cursor-pointer
                  ${selected
                    ? "border-cyan-400 bg-gray-700"
                    : "border-gray-700 hover:border-gray-600"}
                `}
              >
                <div className="flex-1 grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">{c.sportName}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">{c.competitionName}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">{c.gender}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-gray-400 text-sm">
                      {new Date(c.schedule).toLocaleDateString()}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {new Date(c.schedule).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* =========================
         FLOAT BUTTONS
      ========================= */}

      {/* CREATE */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-12 h-12 bg-cyan-400 text-black rounded-full text-2xl font-bold shadow-lg"
      >
        +
      </button>

      {/* DELETE MODE ENTER */}
      {!deleteMode && (
        <button
          onClick={() => setDeleteMode(true)}
          className="fixed bottom-24 right-8 w-12 h-12 bg-cyan-400 text-black rounded-full text-2xl font-bold shadow-lg"
        >
          -
        </button>
      )}

      {/* =========================
         CREATE MODAL (UNCHANGED)
      ========================= */}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md border border-gray-700">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                [Admin] Added Competition Popup CREATE
              </h2>
              <button onClick={() => setIsModalOpen(false)}>×</button>
            </div>

            <div className="space-y-4">

              {/* SPORT */}
              <select
                value={formData.sportName}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, sportName: e.target.value }))
                }
                className="w-full bg-gray-700 rounded px-3 py-2"
              >
                <option value="">Select a sport</option>
                {sports.map((s) => (
                  <option key={s.sport_id} value={s.sport_id}>
                    {s.sport_name}
                  </option>
                ))}
              </select>

              {/* GENDER */}
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, gender: e.target.value }))
                }
                className="w-full bg-gray-700 rounded px-3 py-2"
              >
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>

              <input
                name="competitionName"
                value={formData.competitionName}
                onChange={handleInputChange}
                placeholder="Competition name"
                className="w-full bg-gray-700 rounded px-3 py-2"
              />

              <select
                value={formData.disabilityType}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    disabilityType: e.target.value,
                  }))
                }
                className="w-full bg-gray-700 rounded px-3 py-2"
              >
                <option value="">Select Disability Type</option>
                <option>Lower Limb Deficiency</option>
                <option>Upper Limb Deficiency</option>
              </select>

              <input
                type="datetime-local"
                name="schedule"
                value={formData.schedule}
                onChange={handleInputChange}
                className="w-full bg-gray-700 rounded px-3 py-2"
              />

              <div className="flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button
                  onClick={handleAddCompetition}
                  className="bg-cyan-400 text-black px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
