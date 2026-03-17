"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ เพิ่ม

export interface Competition {
  id: string;
  sportName: string;
  competitionName: string;
  disability_type: string;
  gender: string;
  schedule: string;
  isFinished: boolean;
}

interface Sport {
  sport_id: number;
  sport_name: string;
}

export default function AdminDashboard() {

  const router = useRouter(); // ✅ เพิ่ม

  /* =========================
     STATE
  ========================= */

  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      isFinished: comp.is_finished ?? false,
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
    const { sportName, competitionName, gender, disabilityType, schedule } = formData;
    const res = await fetch("/api/competitions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: 'add',
        competitionName,
        sportID: sportName,
        gender,
        disabilityType,
        schedule,
      }),
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
     DELETE MODE
  ========================= */

  const toggleSelect = (id: string) => {
    if (!deleteMode) return;

    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const handleDeleteCompetition = async (id: string) => {
    await fetch('/api/competitions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', competitionId: id })
    });
  };

  const handleDeleteSelected = async () => {
    await Promise.all(selectedIds.map(id => handleDeleteCompetition(id)));

    fetchCompetitions();
    setSelectedIds([]);
    setDeleteMode(false);
  };

  const handleClickCompetition = (id:string) => {
    if (!deleteMode) {
      router.push(`/competitions/admin/${id}`); // ✅ ใช้ router
    }
  };

  const cancelDeleteMode = () => {
    setDeleteMode(false);
    setSelectedIds([]);
  };

  return (
    <div className="flex h-full w-full bg-gray-900 text-white relative">

      {/* ✅ BACK BUTTON */}
      <div className="absolute top-6 right-10">
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 rounded bg-cyan-600 text-black hover:bg-cyan-500 transition"
        >
          BACK
        </button>
      </div>

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
        <div className="space-y-8">

          {/* ONGOING */}
          <div>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-4">
              Ongoing Competitions
            </h2>

            <div className="space-y-4">
              {competitions.filter(c => !c.isFinished).length === 0 ? (
                <p className="text-gray-400">No available competition</p>
              ) : (
                competitions.filter(c => !c.isFinished).map((c) => {
                  const selected = selectedIds.includes(c.id);

                  return (
                    <div
                      key={c.id}
                      onClick={() => {
                        toggleSelect(c.id);
                        handleClickCompetition(c.id);
                      }}
                      className={`bg-gray-800 rounded-lg p-6 flex items-center gap-6 border transition cursor-pointer
                      ${selected
                        ? "border-cyan-400 bg-gray-700"
                        : "border-gray-700 hover:border-gray-600"}`}
                    >
                      <div className="flex-1 grid grid-cols-4 gap-4">
                        <p className="text-gray-400 text-sm">{c.sportName}</p>
                        <p className="text-gray-400 text-sm">{c.competitionName}</p>
                        <p className="text-gray-400 text-sm">{c.gender}</p>
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
                })
              )}
            </div>
          </div>

          {/* FINISHED */}
          <div>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-4">
              Finished Competitions
            </h2>

            <div className="space-y-4">
              {competitions.filter(c => c.isFinished).length === 0 ? (
                <p className="text-gray-400">No available competition</p>
              ) : (
                competitions.filter(c => c.isFinished).map((c) => {
                  const selected = selectedIds.includes(c.id);

                  return (
                    <div
                      key={c.id}
                      onClick={() => {
                        toggleSelect(c.id);
                        handleClickCompetition(c.id);
                      }}
                      className={`bg-gray-800 rounded-lg p-6 flex items-center gap-6 border transition cursor-pointer
                      ${selected
                        ? "border-cyan-400 bg-gray-700"
                        : "border-gray-700 hover:border-gray-600"}`}
                    >
                      <div className="flex-1 grid grid-cols-4 gap-4">
                        <p className="text-gray-400 text-sm">{c.sportName}</p>
                        <p className="text-gray-400 text-sm">{c.competitionName}</p>
                        <p className="text-gray-400 text-sm">{c.gender}</p>
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
                })
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}