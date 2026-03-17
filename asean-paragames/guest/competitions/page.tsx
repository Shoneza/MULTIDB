"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface Competition {
  id: string;
  sportName: string;
  competitionName: string;
  disability_type?: string;
  gender: string;
  schedule: string;
  status: boolean;
}

export default function GuestCompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const router = useRouter();

  const fetchCompetitions = async () => {
    try {
      const res = await fetch("/api/competitions");
      if (!res.ok) throw new Error("network");
      const data = await res.json();

      const formatted = data.map((comp: any) => {
        const id = comp.competition_id.toString();
        return {
          id,
          sportName: comp.sport_name,
          competitionName: comp.competition_name,
          gender: comp.gender,
          schedule: new Date(comp.date_time).toISOString(),
          status: comp.is_finished ?? false,
        };
      });
      setCompetitions(formatted);
    } catch (err) {
      console.error("failed to load competitions", err);
      setCompetitions([
        { id: "1", sportName: "Athletics", competitionName: "Sample Event", gender: "Mixed", schedule: new Date().toISOString(), status: false },
      ]);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  return (
    <div className="flex h-full w-full bg-gray-900 text-white">
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">UPCOMING TOURNAMENT</h1>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-cyan-400 text-black rounded"
          >
            Back
          </button>
        </div>
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-4">Ongoing Competitions</h2>
            <div className="space-y-4">
              {competitions.filter(c => !c.status).length === 0 ? (
                <p className="text-gray-400">No available competition</p>
              ) : (
                competitions.filter(c => !c.status).map((c) => (
                  <div
                    key={c.id}
                    onClick={() => router.push(`/guest/competitions/${c.id}`)}
                    className="bg-gray-800 rounded-lg p-6 flex items-center gap-6 border border-gray-700 cursor-pointer hover:border-cyan-400 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-cyan-300">
                        {c.competitionName}
                      </h3>
                      <p className="text-gray-200">Sport: {c.sportName}</p>
                      <p className="text-gray-200">Gender: {c.gender}</p>
                      <p className="text-gray-200">
                        When: {new Date(c.schedule).toLocaleString()}
                      </p>
                      <p className="text-gray-200">
                        Status:{' '}
                        <span className="text-yellow-400">Ongoing</span>
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-4">Finished Competitions</h2>
            <div className="space-y-4">
              {competitions.filter(c => c.status).length === 0 ? (
                <p className="text-gray-400">No available competition</p>
              ) : (
                competitions.filter(c => c.status).map((c) => (
                  <div
                    key={c.id}
                    onClick={() => router.push(`/guest/competitions/${c.id}`)}
                    className="bg-gray-800 rounded-lg p-6 flex items-center gap-6 border border-gray-700 cursor-pointer hover:border-cyan-400 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-cyan-300">
                        {c.competitionName}
                      </h3>
                      <p className="text-gray-200">Sport: {c.sportName}</p>
                      <p className="text-gray-200">Gender: {c.gender}</p>
                      <p className="text-gray-200">
                        When: {new Date(c.schedule).toLocaleString()}
                      </p>
                      <p className="text-gray-200">
                        Status:{' '}
                        <span className="text-green-400">Finished</span>
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}