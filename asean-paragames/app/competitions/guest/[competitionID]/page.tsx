"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { mapDisabilityCodeToName } from "../../../tool/disability";
type Section = "description" | "athletes" | "scoreboard";

interface Competition {
  id: string;
  sportName: string;
  competitionName: string;
  disability_type?: string;
  gender: string;
  schedule: string;
  isFinished: boolean;
}

interface Athlete {
  id: number;
  firstName: string;
  surname: string;
  nationality: string;
  attempts: number[];
  best_score?: number;
  medal?: "gold" | "silver" | "bronze" | "none";
}

export default function GuestCompetitionDetail() {
  let { competitionID } = useParams();
  // Ensure competitionID is string and not undefined
  const id = Array.isArray(competitionID) ? competitionID[0] : competitionID ?? "";
  const router = useRouter();
  const [competitionInfo, setCompetitionInfo] = useState<Competition | null>(null);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [maxAttempts, setMaxAttempts] = useState(0);
  const descriptionRef = useRef<HTMLElement | null>(null);
  const athletesRef = useRef<HTMLElement | null>(null);
  const scoreboardRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    fetchCompetitionInfo();
  }, [competitionID]);

  useEffect(() => {
    if (competitionInfo) fetchParticipations();
  }, [competitionInfo]);

  async function fetchCompetitionInfo() {
    try {
      const res = await fetch(`/api/competitions?competitionId=${id}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setCompetitionInfo({
        id: data.competition_id,
        sportName: data.sport_name,
        competitionName: data.competition_name,
        disability_type: data.disability_type || data.disabilityType,
        gender: data.gender,
        schedule: data.date_time,
        isFinished: data.is_finished,
      });
    } catch {}
  }

  async function fetchParticipations() {
    const searchParams = new URLSearchParams({ competitionId: id });
    const res = await fetch(`/api/participations?${searchParams.toString()}`, { cache: "no-store" });
    const data = await res.json();
    const grouped: Record<number, Athlete> = {};
    let maxAttempt = 0;
    for (const p of data) {
      if (p.attempt_number > maxAttempt) maxAttempt = p.attempt_number;
    }
    data.forEach((p: any) => {
      if (!grouped[p.athlete_id]) {
        const attemptsArray = new Array(maxAttempt).fill(undefined);
        grouped[p.athlete_id] = {
          id: p.athlete_id,
          firstName: p.name_en,
          surname: p.surname_en,
          attempts: attemptsArray,
          nationality: p.nationality,
          best_score: p.best_score,
          medal: p.attempt_number === 1 ? (p.medal || "none") : undefined,
        };
        grouped[p.athlete_id].attempts[p.attempt_number - 1] = p.score;
      } else {
        grouped[p.athlete_id].attempts[p.attempt_number - 1] = p.score;
        if (p.attempt_number === 1) grouped[p.athlete_id].medal = p.medal || "none";
      }
    });
    setAthletes(Object.values(grouped));
    setMaxAttempts(maxAttempt);
  }

  return (
    <div className="flex bg-black text-white min-h-0 max-h-full">
      <main className="flex-1 px-16 py-12 space-y-32 overflow-y-auto">
        <div className="mb-4">
          <button
            onClick={() => router.push('/competitions/guest')}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
          >
            Back
          </button>
        </div>
        <h1 className="text-3xl font-bold text-center mb-12">
          {competitionInfo ? competitionInfo.competitionName : "Loading..."}
        </h1>
        {/* =============================== DESCRIPTION =============================== */}
        <section id="description" ref={descriptionRef}>
          <div className="bg-gray-900 p-10 rounded-2xl max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl">DESCRIPTION</h2>
              <div className="flex items-center gap-4">
                <span className="text-gray-400">Status:</span>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${competitionInfo?.isFinished ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
                  {competitionInfo?.isFinished ? 'Finished' : 'Ongoing'}
                </span>
              </div>
            </div>
            <p className="text-gray-400 mb-2">
              SPORT TYPE: {competitionInfo?.sportName || "Loading..."}
            </p>
            <p className="text-gray-400 mb-2">
              DISABILITY TYPE: {competitionInfo?.disability_type ? mapDisabilityCodeToName(competitionInfo?.disability_type) : "Loading..."}
            </p>
            <p className="text-gray-400 mb-2">
              GENDER: {
                competitionInfo?.gender === 'M'
                  ? 'Male'
                  : competitionInfo?.gender === 'F'
                  ? 'Female'
                  : competitionInfo?.gender
                  ? 'Other'
                  : 'Loading...'
              }
            </p>
            <p className="text-gray-400 mb-2">
              SCHEDULE: {competitionInfo ? new Date(competitionInfo.schedule).toLocaleString() : "Loading..."}
            </p>
          </div>
        </section>
        {/* =============================== ATHLETES =============================== */}
        <section id="athletes" ref={athletesRef}>
          <div className="bg-gray-900 p-10 rounded-2xl max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl">ATHLETES</h2>
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
                  {athletes.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-gray-400">
                        No athletes registered for this competition
                      </td>
                    </tr>
                  ) : (
                    athletes.map((a, idx) => (
                      <tr key={a.id} className="border-t border-gray-800">
                        <td className="py-3">{idx + 1}</td>
                        <td className="py-3">{a.firstName} {a.surname}</td>
                        <td className="py-3">{a.nationality}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        {/* =============================== SCOREBOARD =============================== */}
        <section id="scoreboard" ref={scoreboardRef}>
          <div className="bg-gray-900 p-10 rounded-2xl max-w-3xl mx-auto">
            <h2 className="text-2xl mb-6">SCOREBOARD</h2>
            <div className="overflow-x-auto rounded-xl shadow-lg">
              <table className="w-full border-separate border-spacing-0 bg-[#1a2233] text-white">
                <thead>
                  <tr className="bg-linear-to-r from-cyan-700 to-blue-500 text-cyan-100">
                    <th className="py-3 px-4 border-b border-cyan-800 text-left w-12">No.</th>
                    <th className="py-3 px-6 border-b border-cyan-800 text-left w-56 min-w-45">Name</th>
                    <th className="py-3 px-4 border-b border-cyan-800 text-left w-32">Nationality</th>
                    {[...Array(maxAttempts)].map((_, i) => (
                      <th key={i} className="py-3 px-4 border-b border-cyan-800 text-center">Attempt {i + 1}</th>
                    ))}
                    <th className="py-3 px-4 border-b border-cyan-800 text-center w-32">Best score</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Sort athletes by best score descending if finished */}
                  {(() => {
                    let sortedAthletes = athletes;
                    if (competitionInfo?.isFinished) {
                      sortedAthletes = [...athletes].sort((a, b) => {
                        const bestA = Math.max(...a.attempts.filter(s => s !== undefined && s !== null && s !== 0), 0);
                        const bestB = Math.max(...b.attempts.filter(s => s !== undefined && s !== null && s !== 0), 0);
                        return bestB - bestA;
                      });
                    }
                    if (sortedAthletes.length === 0) {
                      return (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-gray-400">
                            No athletes available
                          </td>
                        </tr>
                      );
                    }
                    return sortedAthletes.map((athlete, idx) => (
                      <tr key={athlete.id} className="even:bg-[#182030] hover:bg-[#22304a] transition-colors">
                        <td className="py-3 px-4 border-b border-[#22304a] text-center">
                          {athlete.medal === "gold" && <span title="Gold Medal">🥇</span>}
                          {athlete.medal === "silver" && <span title="Silver Medal">🥈</span>}
                          {athlete.medal === "bronze" && <span title="Bronze Medal">🥉</span>}
                          <span>{idx + 1}</span>
                        </td>
                        <td className="py-3 px-6 border-b border-[#22304a] font-semibold text-cyan-200 whitespace-nowrap">{athlete.firstName} {athlete.surname}</td>
                        <td className="py-3 px-4 border-b border-[#22304a] text-cyan-100">{athlete.nationality}</td>
                        {[...Array(maxAttempts)].map((_, i) => (
                          <td key={i} className="py-3 px-4 border-b border-[#22304a] text-center">
                            {athlete.attempts[i] !== undefined && athlete.attempts[i] !== 0 && athlete.attempts[i] !== null ? (
                              <span>{athlete.attempts[i]}</span>
                            ) : (
                              <span className="text-gray-500">No recorded</span>
                            )}
                          </td>
                        ))}
                        <td className="py-3 px-4 border-b border-[#22304a] text-center w-32">
                          {(() => {
                            const validScores = athlete.attempts.filter(s => s !== undefined && s !== null && s !== 0);
                            const best = validScores.length > 0 ? Math.max(...validScores) : null;
                            if (best === null) {
                              return <span className="text-gray-500">ไม่มีข้อมูลคะแนน</span>;
                            }
                            return <span className="text-white">{best}</span>;
                          })()}
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
