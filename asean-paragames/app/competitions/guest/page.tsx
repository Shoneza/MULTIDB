"use client";

import { useState, useEffect, useRef } from "react";
const mockAnnouncements = [
  {
    id: 1,
    title: "Competition Schedule Updated",
    date: "5 April 2025",
    description:
      "Please check the updated match schedules due to venue adjustment.",
  },
  {
    id: 2,
    title: "Athlete Registration Deadline Extended",
    date: "8 April 2025",
    description:
      "Registration deadline has been extended until 20 April 2025.",
  },
  {
    id: 3,
    title: "Opening Ceremony Details",
    date: "12 April 2025",
    description:
      "Opening ceremony will take place at National Stadium at 6PM.",
  },
];

const mockLocation = {
  venue: "National Stadium Bangkok",
  address: "123 Rama 1 Road, Pathumwan, Bangkok 10330",
  description:
    "Main venue for track & field, swimming, and opening ceremony events.",
};
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


export default function GuestDashboard() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const router = useRouter();

  // refs for scrolling
  const tournamentRef = useRef<HTMLElement | null>(null);
  const announcementRef = useRef<HTMLElement | null>(null);
  const locationRef = useRef<HTMLElement | null>(null);

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
      setCompetitions([]);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  return (
    <div className="flex bg-black text-white min-h-screen">
      <aside className="w-64 p-6 border-r border-gray-800 sticky top-0 h-screen">
        <h2 className="text-cyan-400 text-xl font-bold mb-8">
          ASEAN PARAGAMES 2025
        </h2>
        <nav className="space-y-4 text-sm">
          <button
            onClick={() => {
              if (tournamentRef.current) tournamentRef.current.scrollIntoView({ behavior: "smooth" });
            }}
            className="block w-full text-left px-3 py-2 rounded bg-cyan-500 text-black"
          >
            TOURNAMENT
          </button>
          <button
            onClick={() => {
              if (announcementRef.current) announcementRef.current.scrollIntoView({ behavior: "smooth" });
            }}
            className="block w-full text-left px-3 py-2 rounded bg-cyan-500 text-black"
          >
            ANNOUNCEMENT
          </button>
          <button
            onClick={() => {
              if (locationRef.current) locationRef.current.scrollIntoView({ behavior: "smooth" });
            }}
            className="block w-full text-left px-3 py-2 rounded bg-cyan-500 text-black"
          >
            LOCATION
          </button>
          <button
            onClick={() => router.push("/")}
            className="block w-full text-left px-3 py-2 rounded bg-cyan-600 text-black"
          >
            BACK TO HOME
          </button>
        </nav>
      </aside>
      <main className="flex-1 px-16 py-12 space-y-32">
        <section id="tournament" ref={tournamentRef}>
          <div className="bg-gray-900 p-10 rounded-2xl">
            <h2 className="text-3xl mb-8 text-white">UPCOMING TOURNAMENT</h2>
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
          </div>
        </section>
        <section id="announcement" ref={announcementRef}>
          <div className="bg-gray-900 p-10 rounded-2xl">
            <h2 className="text-3xl mb-8">ANNOUNCEMENT</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {mockAnnouncements.map((a) => (
                <div
                  key={a.id}
                  className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition"
                >
                  <p className="text-sm text-cyan-400 mb-2">{a.date}</p>
                  <h3 className="text-xl font-semibold mb-3">{a.title}</h3>
                  <p className="text-gray-400 text-sm">{a.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="location" ref={locationRef}>
          <div className="bg-gray-900 p-10 rounded-2xl">
            <h2 className="text-3xl mb-6">LOCATION</h2>
            <p className="text-lg text-white mb-2">{mockLocation.venue}</p>
            <p className="text-gray-400 mb-4">{mockLocation.address}</p>
            <p className="text-gray-400 mb-8">
              {mockLocation.description}
            </p>
            <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
              MAP PLACEHOLDER
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}