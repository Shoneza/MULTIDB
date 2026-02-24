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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    try {
      const res = await fetch("/api/sports");
      if (!res.ok) throw new Error("Failed to fetch sports");

      const data = await res.json();
      setSports(data);
      return data;
    } catch (err) {
      console.error(err);
      setError("Failed to load sports.");
      return [];
    }
  };

  const fetchCompetitions = async (sportId: string) => {
    try {
      const res = await fetch(`/api/competitions?sportId=${sportId}`);
      if (!res.ok) throw new Error("Failed to fetch competitions");

      const data = await res.json();

      const formatted = data.map((comp: any) => ({
        id: comp.competition_id.toString(),
        sportName: comp.sport_name,
        competitionName: comp.competition_name,
        gender: comp.gender,
        schedule: new Date(comp.date_time).toISOString(),
      }));

      setCompetitions(formatted);
    } catch (err) {
      console.error(err);
      setError("Failed to load competitions.");
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        setError(null);

        const sportsData = await fetchSports();

        if (sportsData.length > 0) {
          await fetchCompetitions(
            sportsData[0].sport_id.toString()
          );
        }
      } catch (err) {
        console.error(err);
        setError("Failed to initialize page.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  /* =========================
     FORM
  ========================= */

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
      if (sports.length > 0) {
        await fetchCompetitions(
          sports[0].sport_id.toString()
        );
      }

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

  const handleDeleteCompetition = async (id: string) => {
    const response = await fetch(
      `/api/competitions?id=${id}`,
      { method: "DELETE" }
    );

    if (response.ok && sports.length > 0) {
      await fetchCompetitions(
        sports[0].sport_id.toString()
      );
    }
  };

  const handleDeleteSelected = async () => {
    await Promise.all(
      selectedIds.map((id) =>
        handleDeleteCompetition(id)
      )
    );

    if (sports.length > 0) {
      await fetchCompetitions(
        sports[0].sport_id.toString()
      );
    }

    setSelectedIds([]);
    setDeleteMode(false);
  };

  const cancelDeleteMode = () => {
    setDeleteMode(false);
    setSelectedIds([]);
  };

  /* =========================
     LOADING / ERROR UI
  ========================= */

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Loading tournaments...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-red-400">
        {error}
      </div>
    );
  }

  /* =========================
     MAIN UI
  ========================= */

  return (
    <div className="flex h-full w-full bg-gray-900 text-white">
      <main className="flex-1 p-8 overflow-y-auto">
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

        <div className="space-y-4">
          {competitions.map((c) => {
            const selected =
              selectedIds.includes(c.id);

            return (
              <div
                key={c.id}
                onClick={() => toggleSelect(c.id)}
                className={`bg-gray-800 rounded-lg p-6 flex items-center gap-6 border transition cursor-pointer
                  ${
                    selected
                      ? "border-cyan-400 bg-gray-700"
                      : "border-gray-700 hover:border-gray-600"
                  }`}
              >
                <div className="flex-1 grid grid-cols-4 gap-4">
                  <p className="text-gray-400 text-sm">
                    {c.sportName}
                  </p>

                  <p className="text-gray-400 text-sm">
                    {c.competitionName}
                  </p>

                  <p className="text-gray-400 text-sm">
                    {c.gender}
                  </p>

                  <div className="text-right text-gray-400 text-sm">
                    <p>
                      {new Date(
                        c.schedule
                      ).toLocaleDateString()}
                    </p>
                    <p>
                      {new Date(
                        c.schedule
                      ).toLocaleTimeString([], {
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

      {/* Floating Buttons */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-12 h-12 bg-cyan-400 text-black rounded-full text-2xl font-bold shadow-lg"
      >
        +
      </button>

      {!deleteMode && (
        <button
          onClick={() => setDeleteMode(true)}
          className="fixed bottom-24 right-8 w-12 h-12 bg-cyan-400 text-black rounded-full text-2xl font-bold shadow-lg"
        >
          -
        </button>
      )}

      {/* Modal unchanged (your original UI stays here) */}
    </div>
  );
}