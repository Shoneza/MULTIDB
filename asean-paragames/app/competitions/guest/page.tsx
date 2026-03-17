"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type Section = "tournament" | "announcement" | "location";

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

export interface Competition {
  id: string;
  sportName: string;
  competitionName: string;
  gender: string;
  schedule: string;
  status: boolean;
}

export default function GuestDashboard() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [activeSection, setActiveSection] =
    useState<Section>("tournament");

  const router = useRouter();

  const tournamentRef = useRef<HTMLElement | null>(null);
  const announcementRef = useRef<HTMLElement | null>(null);
  const locationRef = useRef<HTMLElement | null>(null);

  const fetchCompetitions = async () => {
    try {
      const res = await fetch("/api/competitions");
      if (!res.ok) throw new Error("network");
      const data = await res.json();

      const formatted = data.map((comp: any) => ({
        id: comp.competition_id.toString(),
        sportName: comp.sport_name,
        competitionName: comp.competition_name,
        gender: comp.gender,
        schedule: new Date(comp.date_time).toISOString(),
        status: comp.is_finished ?? false,
      }));

      setCompetitions(formatted);
    } catch {
      setCompetitions([]);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  // ⭐ Observer for active navbar
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
        rootMargin: "-40% 0px -50% 0px",
      }
    );

    if (tournamentRef.current) observer.observe(tournamentRef.current);
    if (announcementRef.current) observer.observe(announcementRef.current);
    if (locationRef.current) observer.observe(locationRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex bg-black text-white min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 p-6 border-r border-gray-800 sticky top-0 h-screen">
        <h2 className="text-cyan-400 text-xl font-bold mb-8">
          ASEAN PARAGAMES 2025
        </h2>

        <nav className="space-y-4 text-sm">
          <button
            onClick={() =>
              tournamentRef.current?.scrollIntoView({ behavior: "smooth" })
            }
            className={`block w-full text-left px-3 py-2 rounded ${
              activeSection === "tournament"
                ? "bg-cyan-500 text-black"
                : "text-gray-400"
            }`}
          >
            TOURNAMENT
          </button>

          <button
            onClick={() =>
              announcementRef.current?.scrollIntoView({ behavior: "smooth" })
            }
            className={`block w-full text-left px-3 py-2 rounded ${
              activeSection === "announcement"
                ? "bg-cyan-500 text-black"
                : "text-gray-400"
            }`}
          >
            ANNOUNCEMENT
          </button>

          <button
            onClick={() =>
              locationRef.current?.scrollIntoView({ behavior: "smooth" })
            }
            className={`block w-full text-left px-3 py-2 rounded ${
              activeSection === "location"
                ? "bg-cyan-500 text-black"
                : "text-gray-400"
            }`}
          >
            LOCATION
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 px-16 py-12 pt-24 space-y-32 relative">
        {/* BACK BUTTON */}
        <div className="absolute top-6 right-10">
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 rounded bg-cyan-600 text-black hover:bg-cyan-500 transition"
          >
            BACK
          </button>
        </div>

        {/* Tournament */}
        <section
          id="tournament"
          ref={tournamentRef}
          className="scroll-mt-32"
        >
          <div className="bg-gray-900 p-10 rounded-2xl">
            <h2 className="text-3xl mb-8">UPCOMING TOURNAMENT</h2>

            {/* Ongoing */}
            <div className="mb-10">
              <h3 className="text-2xl text-cyan-300 mb-4">
                Ongoing Competitions
              </h3>

              {competitions.filter((c) => !c.status).length === 0 ? (
                <p className="text-gray-400">No available competition</p>
              ) : (
                competitions
                  .filter((c) => !c.status)
                  .map((c) => (
                    <div
                      key={c.id}
                      onClick={() =>
                        router.push(`/competitions/guest/${c.id}`)
                      }
                      className="bg-gray-800 p-6 mb-4 rounded-lg cursor-pointer hover:border-cyan-400 border border-gray-700"
                    >
                      <h4 className="text-xl text-cyan-300">
                        {c.competitionName}
                      </h4>
                      <p>Sport: {c.sportName}</p>
                      <p>Gender: {c.gender}</p>
                      <p>
                        When: {new Date(c.schedule).toLocaleString()}
                      </p>
                      <p className="text-yellow-400">Ongoing</p>
                    </div>
                  ))
              )}
            </div>

            {/* Finished */}
            <div>
              <h3 className="text-2xl text-cyan-300 mb-4">
                Finished Competitions
              </h3>

              {competitions.filter((c) => c.status).length === 0 ? (
                <p className="text-gray-400">No available competition</p>
              ) : (
                competitions
                  .filter((c) => c.status)
                  .map((c) => (
                    <div
                      key={c.id}
                      onClick={() =>
                        router.push(`/competitions/guest/${c.id}`)
                      }
                      className="bg-gray-800 p-6 mb-4 rounded-lg cursor-pointer hover:border-cyan-400 border border-gray-700"
                    >
                      <h4 className="text-xl text-cyan-300">
                        {c.competitionName}
                      </h4>
                      <p>Sport: {c.sportName}</p>
                      <p>Gender: {c.gender}</p>
                      <p>
                        When: {new Date(c.schedule).toLocaleString()}
                      </p>
                      <p className="text-green-400">Finished</p>
                    </div>
                  ))
              )}
            </div>
          </div>
        </section>

        {/* Announcement */}
        <section
          id="announcement"
          ref={announcementRef}
          className="scroll-mt-32"
        >
          <div className="bg-gray-900 p-10 rounded-2xl">
            <h2 className="text-3xl mb-8">ANNOUNCEMENT</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {mockAnnouncements.map((a) => (
                <div
                  key={a.id}
                  className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700"
                >
                  <p className="text-cyan-400 text-sm">{a.date}</p>
                  <h3 className="text-xl mb-2">{a.title}</h3>
                  <p className="text-gray-400 text-sm">
                    {a.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Location */}
        <section
          id="location"
          ref={locationRef}
          className="scroll-mt-32"
        >
          <div className="bg-gray-900 p-10 rounded-2xl">
            <h2 className="text-3xl mb-6">LOCATION</h2>

            <p className="text-lg">{mockLocation.venue}</p>
            <p className="text-gray-400">{mockLocation.address}</p>
            <p className="text-gray-400 mb-6">
              {mockLocation.description}
            </p>

            <div className="h-64 bg-gray-700 flex items-center justify-center rounded-lg">
              MAP PLACEHOLDER
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}