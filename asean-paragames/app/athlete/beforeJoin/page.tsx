"use client";

import { useEffect, useRef, useState } from "react";

type Section = "tournament" | "announcement" | "location";

export default function AthleteDashboard() {
  const [activeSection, setActiveSection] = useState<Section>("tournament");
  const [joinMode, setJoinMode] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);

  const tournamentRef = useRef<HTMLElement | null>(null);
  const announcementRef = useRef<HTMLElement | null>(null);
  const locationRef = useRef<HTMLElement | null>(null);

  // ===============================
  // Scroll Spy
  // ===============================
  useEffect(() => {
    if (joinMode) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as Section);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );

    if (tournamentRef.current) observer.observe(tournamentRef.current);
    if (announcementRef.current) observer.observe(announcementRef.current);
    if (locationRef.current) observer.observe(locationRef.current);

    return () => observer.disconnect();
  }, [joinMode]);

  // ===============================
  // Checkbox Logic
  // ===============================
  const toggleSport = (sport: string) => {
    setSelectedSports((prev) =>
      prev.includes(sport)
        ? prev.filter((s) => s !== sport)
        : [...prev, sport]
    );
  };

  const [toast, setToast] = useState<{
  message: string;
  type: "success" | "error";
} | null>(null);

const handleSubmit = async () => {
  try {
    // Simulate backend request
    await new Promise((resolve) => setTimeout(resolve, 800));

    setSubmitted(true);

    setToast({
      message: submitted ? "Changes saved successfully!" : "Successfully joined competition!",
      type: "success",
    });

  } catch (err) {
    setToast({
      message: "Something went wrong. Please try again.",
      type: "error",
    });
  }

  // Auto remove after 3 seconds
  setTimeout(() => {
    setToast(null);
  }, 3000);
};

  return (
    <div className="flex bg-black text-white min-h-screen">

      {/* ===============================
          SIDEBAR
      =============================== */}
      <aside className="w-64 p-6 border-r border-gray-800 sticky top-0 h-screen">

        <h2 className="text-cyan-400 text-xl font-bold mb-8">
          ASEAN PARAGAMES 2025
        </h2>

        <nav className="space-y-4 text-sm">

          {!joinMode && (
            <>
              <button
                onClick={() => tournamentRef.current?.scrollIntoView({ behavior: "smooth" })}
                className={`block w-full text-left px-3 py-2 rounded ${
                  activeSection === "tournament"
                    ? "bg-cyan-500 text-black"
                    : "text-gray-400"
                }`}
              >
                TOURNAMENT
              </button>

              <button
                onClick={() => announcementRef.current?.scrollIntoView({ behavior: "smooth" })}
                className={`block w-full text-left px-3 py-2 rounded ${
                  activeSection === "announcement"
                    ? "bg-cyan-500 text-black"
                    : "text-gray-400"
                }`}
              >
                ANNOUNCEMENT
              </button>

              <button
                onClick={() => locationRef.current?.scrollIntoView({ behavior: "smooth" })}
                className={`block w-full text-left px-3 py-2 rounded ${
                  activeSection === "location"
                    ? "bg-cyan-500 text-black"
                    : "text-gray-400"
                }`}
              >
                LOCATION
              </button>
            </>
          )}

          <button
            onClick={() => setJoinMode(true)}
            className="block w-full text-left px-3 py-2 rounded bg-cyan-600 text-black"
          >
            JOIN COMPETITIONS
          </button>

          {joinMode && (
            <button
              onClick={() => setJoinMode(false)}
              className="block w-full text-left px-3 py-2 text-gray-400"
            >
              ← BACK
            </button>
          )}
        </nav>
      </aside>

      {/* ===============================
          CONTENT
      =============================== */}
      <main className="flex-1 px-16 py-12 space-y-32">

        {!joinMode ? (
          <>
            <section id="tournament" ref={tournamentRef}>
              <div className="bg-gray-900 p-10 rounded-2xl">
                <h2 className="text-2xl mb-6">UPCOMING TOURNAMENT</h2>
                <p className="text-gray-400">Tournament content here...</p>
              </div>
            </section>

            <section id="announcement" ref={announcementRef}>
              <div className="bg-gray-900 p-10 rounded-2xl">
                <h2 className="text-2xl mb-6">ANNOUNCEMENT</h2>
                <p className="text-gray-400">Announcement content here...</p>
              </div>
            </section>

            <section id="location" ref={locationRef}>
              <div className="bg-gray-900 p-10 rounded-2xl">
                <h2 className="text-2xl mb-6">LOCATION</h2>
                <div className="h-64 bg-gray-700 rounded-lg" />
              </div>
            </section>
          </>
        ) : (
          <div className="bg-gray-900 p-10 rounded-2xl max-w-3xl">
            <h2 className="text-3xl text-cyan-400 mb-10">
              JOIN COMPETITION
            </h2>

            {["Swimming", "Cycling", "Badminton", "Tennis", "Track Running"].map((sport) => (
              <label key={sport} className="flex items-center gap-4 mb-6 text-lg">
                <input
                  type="checkbox"
                  checked={selectedSports.includes(sport)}
                  onChange={() => toggleSport(sport)}
                  className="w-5 h-5"
                />
                {sport}
              </label>
            ))}

            <button
              onClick={handleSubmit}
              className="mt-10 bg-cyan-500 text-black px-6 py-2 rounded-full"
            >
              {submitted ? "SAVE" : "SUBMIT"}
            </button>
          </div>
        )}

      </main>
      {toast && (
        <div
            className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg transition-all duration-300
            ${toast.type === "success"
                ? "bg-green-500 text-black"
                : "bg-red-500 text-white"}
            `}
        >
            {toast.message}
        </div>
        )}
    </div>
  );
}