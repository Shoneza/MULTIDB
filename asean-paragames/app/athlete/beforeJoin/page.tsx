"use client";

import { useEffect, useRef, useState } from "react";

type Section = "tournament" | "announcement" | "location" | "mycompetition";

export default function AthleteDashboard() {
  const [activeSection, setActiveSection] = useState<Section>("tournament");
  const [joinMode, setJoinMode] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ ADD: Replace with real logged-in athlete id
  const currentAthleteId = 1;

  // ✅ ADD: Sport name → sport_id mapping
  const sportMap: Record<string, number> = {
    Swimming: 1,
    Cycling: 2,
    Badminton: 3,
    Tennis: 4,
    "Track Running": 5,
  };

  const tournamentRef = useRef<HTMLElement | null>(null);
  const announcementRef = useRef<HTMLElement | null>(null);
  const locationRef = useRef<HTMLElement | null>(null);
  const myCompetitionRef = useRef<HTMLElement | null>(null);

  // ===============================
  // Scroll Spy (UNCHANGED)
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
    if (myCompetitionRef.current) observer.observe(myCompetitionRef.current);

    return () => observer.disconnect();
  }, [joinMode, submitted, selectedSports]);

  // ===============================
  // Checkbox Logic (UNCHANGED)
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

  // ===============================
  // ✅ UPDATED SUBMIT (REAL API CALL)
  // ===============================
  const handleSubmit = async () => {
    if (selectedSports.length === 0) {
      setToast({
        message: "Please select at least one competition.",
        type: "error",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      await Promise.all(
        selectedSports.map((sportName) =>
          fetch("/api/registrations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              athlete_id: currentAthleteId,
              registered_sport_id: sportMap[sportName],
            }),
          })
        )
      );

      setSubmitted(true);

      setToast({
        message: submitted
          ? "Changes saved successfully!"
          : "Successfully joined competition!",
        type: "success",
      });

    } catch (err) {
      setToast({
        message: "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);

      setTimeout(() => {
        setToast(null);
      }, 3000);
    }
  };

  // ===============================
  // MOCK DATA (UNCHANGED)
  // ===============================
  const mockTournaments = [
    {
      id: 1,
      sport: "Swimming",
      competition: "100m Freestyle S8",
      disability: "Physical Impairment",
      date: "10 May 2025 · 09:00 AM",
    },
    {
      id: 2,
      sport: "Cycling",
      competition: "Road Race C4",
      disability: "Lower Limb Disability",
      date: "12 May 2025 · 01:30 PM",
    },
    {
      id: 3,
      sport: "Badminton",
      competition: "Men Singles SL3",
      disability: "Standing Lower",
      date: "15 May 2025 · 11:00 AM",
    },
  ];

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

  return (
    <div className="flex bg-black text-white min-h-screen">
      {/* SIDEBAR (UNCHANGED) */}
      <aside className="w-64 p-6 border-r border-gray-800 sticky top-0 h-screen">
        <h2 className="text-cyan-400 text-xl font-bold mb-8">
          ASEAN PARAGAMES 2025
        </h2>

        <nav className="space-y-4 text-sm">
          {!joinMode && (
            <>
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

              {/* My Competition nav button directly below Tournament */}
              {submitted && selectedSports.length > 0 && (
                  <button
                    onClick={() => {
                      if (myCompetitionRef.current) myCompetitionRef.current.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`block w-full text-left px-3 py-2 rounded ${
                      activeSection === "mycompetition"
                        ? "bg-cyan-500 text-black"
                        : "text-gray-400"
                    }`}
                  >
                    My Competition
                  </button>
              )}

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

      {/* MAIN CONTENT (UNCHANGED UI) */}
      <main className="flex-1 px-16 py-12 space-y-32">
        {!joinMode ? (
        <>
          {/* ================= TOURNAMENT ================= */}
          <section id="tournament" ref={tournamentRef}>
          <div className="bg-gray-900 p-10 rounded-2xl">
            <h2 className="text-3xl mb-8 text-white">
            UPCOMING TOURNAMENT
            </h2>

            <div className="space-y-6">
            {mockTournaments.map((t) => (
              <div
              key={t.id}
              className="border border-gray-700 rounded-lg overflow-hidden"
              >
              <div className="flex justify-between bg-gray-800 px-6 py-4">
                <span className="text-gray-300 font-semibold">
                {t.sport}
                </span>
                <span className="text-gray-400">
                {t.competition}
                </span>
              </div>

              <div className="flex justify-between px-6 py-4 text-sm text-gray-400">
                <span>{t.disability}</span>
                <span>{t.date}</span>
              </div>
              </div>
            ))}
            </div>
          </div>
          </section>

            {/* ===== MY COMPETITION SECTION ===== */}
            {submitted && selectedSports.length > 0 && (
              <section
                id="mycompetition"
                ref={myCompetitionRef}
                style={{ scrollMarginTop: 180 }}
                className="mt-24"
              >
                <div id="mycompetition-content" className="bg-gray-800 rounded-xl p-6 mb-8">
                  <h3 className="text-xl font-bold text-cyan-300 mb-4">My Competition</h3>
                  <ul className="list-disc pl-6 text-white">
                    {selectedSports.map((sport) => (
                      <li key={sport}>{sport}</li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

          {/* ================= ANNOUNCEMENT ================= */}
          <section id="announcement" ref={announcementRef}>
          <div className="bg-gray-900 p-10 rounded-2xl">
            <h2 className="text-3xl mb-8">ANNOUNCEMENT</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mockAnnouncements.map((a) => (
              <div
              key={a.id}
              className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition"
              >
              <p className="text-sm text-cyan-400 mb-2">
                {a.date}
              </p>

              <h3 className="text-xl font-semibold mb-3">
                {a.title}
              </h3>

              <p className="text-gray-400 text-sm">
                {a.description}
              </p>
              </div>
            ))}
            </div>
          </div>
          </section>

          {/* ================= LOCATION ================= */}
          <section id="location" ref={locationRef}>
          <div className="bg-gray-900 p-10 rounded-2xl">
            <h2 className="text-3xl mb-6">LOCATION</h2>

            <p className="text-lg text-white mb-2">
            {mockLocation.venue}
            </p>

            <p className="text-gray-400 mb-4">
            {mockLocation.address}
            </p>

            <p className="text-gray-400 mb-8">
            {mockLocation.description}
            </p>

            <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
            MAP PLACEHOLDER
            </div>
          </div>
          </section>
        </>

        ) : (
          <div className="bg-gray-900 p-10 rounded-2xl max-w-3xl">
            <h2 className="text-3xl text-cyan-400 mb-10">
              JOIN COMPETITION
            </h2>

            {["Swimming", "Cycling", "Badminton", "Tennis", "Track Running"].map(
              (sport) => (
                <label
                  key={sport}
                  className="flex items-center gap-4 mb-6 text-lg"
                >
                  <input
                    type="checkbox"
                    checked={selectedSports.includes(sport)}
                    onChange={() => toggleSport(sport)}
                    className="w-5 h-5"
                  />
                  {sport}
                </label>
              )
            )}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="mt-10 bg-cyan-500 text-black px-6 py-2 rounded-full disabled:opacity-50"
            >
              {isSubmitting
                ? "Submitting..."
                : submitted
                ? "SAVE"
                : "SUBMIT"}
            </button>
          </div>
        )}
      </main>

      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg transition-all duration-300
          ${
            toast.type === "success"
              ? "bg-green-500 text-black"
              : "bg-red-500 text-white"
          }
          `}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}