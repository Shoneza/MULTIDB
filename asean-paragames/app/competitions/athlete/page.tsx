"use client";

interface Sport {
  sport_id: number;
  sport_name: string;
  selected: boolean;
}

import { useEffect, useRef, useState } from "react";
import { useAuth,useRequireRole } from "@/app/lib/hooks/useauth";
import { redirect } from "next/navigation";
import { deleteSession } from "@/app/lib/session";
import { useRouter } from "next/navigation";
import { Competition } from "@/app/competitions/guest/page";
type Section = "tournament" | "announcement" | "location" | "mycompetition";

export default function AthleteDashboard() {
  const router = useRouter();
  const [competitions, setCompetitions] = useState<Competition[]>([]);

    // ดึงข้อมูล tournament จาก API เหมือน guest/competitions
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
  const [activeSection, setActiveSection] = useState<Section>("tournament");
  const [joinMode, setJoinMode] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sports, setSports] = useState<Sport[]>([]);
  const [oldSelectedSports, setOldSelectedSports] = useState<number[]>([]);
  const { authorized, loading, session } = useRequireRole(['athlete'])
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Replace with real logged-in athlete id
  const currentAthleteId = session?.athleteId || -1;

  const tournamentRef = useRef<HTMLElement | null>(null);
  const announcementRef = useRef<HTMLElement | null>(null);
  const locationRef = useRef<HTMLElement | null>(null);
  const myCompetitionRef = useRef<HTMLElement | null>(null);

  const selectedSports = sports
    .filter((sport) => sport.selected)
    .map((sport) => sport.sport_name);
  const isChanged = JSON.stringify(
    sports.filter((sport) => sport.selected).map((sport) => sport.sport_id).sort()
  ) !== JSON.stringify(oldSelectedSports.sort()); 
  // Load sports + athlete registrations, then merge them
  const loadSports = async () => {
    try {
      const searchParams = new URLSearchParams({
        athleteId: session?.athleteId?.toString() || "",
      });
      

      const sportsRes = await fetch("/api/sports");
      const registrationsRes = await fetch(`/api/registration?${searchParams.toString()}`,{
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const sportsData = await sportsRes.json();
      const registrationsData = await registrationsRes.json();
      
      console.log("Fetched sports:", sportsData);
      console.log("Fetched registrations:", registrationsData);
      const registeredSportIds = new Set<number>(
        registrationsData.map((reg: any) => reg.registered_sport_id)
      );
      console.log("Registered sport IDs:", registeredSportIds);
      const mergedSports: Sport[] = sportsData.map((sport: any) => ({
        sport_id: sport.sport_id,
        sport_name: sport.sport_name,
        selected: registeredSportIds.has(sport.sport_id),
      }));
      
      setSports(mergedSports);
      setSubmitted(mergedSports.some((sport) => sport.selected));
      setOldSelectedSports(
        mergedSports.filter((sport) => sport.selected).map((sport) => sport.sport_id)
      );
    } catch (error) {
      console.error("Error loading sports:", error);
      setToast({
        message: "Failed to load sports.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (session?.athleteId && !loading) {
      loadSports();
    }
  }, [session?.athleteId, loading]);

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
  }, [joinMode, submitted, sports]);

  const toggleSport = (sportId: number) => {
    setSports((prev) =>
      prev.map((sport) =>
        sport.sport_id === sportId
          ? { ...sport, selected: !sport.selected }
          : sport
      )
    );
  };

  const resetRegistration = async () => {
    try {
      await fetch("/api/registration", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          athlete_id: currentAthleteId,
        }),
      });
    } catch (error) {
      console.error("Error resetting registration:", error);
    }
  };

  const handleSubmit = async () => {
    const selectedSportIds = sports
      .filter((sport) => sport.selected)
      .map((sport) => sport.sport_id);

    if (selectedSportIds.length === 0) {
      setToast({
        message: "Please select at least one competition.",
        type: "error",
      });
      return;
    }

    const wasSubmitted = submitted;

    try {
      setIsSubmitting(true);

      await resetRegistration();

      for (const sportId of selectedSportIds) {
        const response = await fetch("/api/registration", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            athlete_id: currentAthleteId,
            registered_sport_id: sportId,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to register for sport ID ${sportId}`);
        }
      }

      setSubmitted(true);

      setToast({
        message: wasSubmitted
          ? "Changes saved successfully!"
          : "Successfully joined competition!",
        type: "success",
      });
    } catch (error) {
      setToast({
        message: "Something went wrong. Please try again." + (error instanceof Error ? error.message : ""),
        type: "error",
      });
    } finally {
      setIsSubmitting(false);

      setTimeout(() => {
        setToast(null);
      }, 3000);
    }
  };



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
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!authorized) {
    // redirect('/login');
    return (<div>
      <p>You are not authorized to view this page. Please login as an athlete.</p>
    </div>);
  }
  return (
    <div className="flex bg-black text-white min-h-screen">
      <aside className="w-64 p-6 border-r border-gray-800 sticky top-0 h-screen">
        <h2 className="text-cyan-400 text-xl font-bold mb-8" onClick ={ ()=> {
          // deleteSession();
          // redirect('/login');
        }}>
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

              {submitted && selectedSports.length > 0 && (
                <button
                  onClick={() => {
                    if (myCompetitionRef.current) {
                      myCompetitionRef.current.scrollIntoView({
                        behavior: "smooth",
                      });
                    }
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

      <main className="flex-1 px-16 py-12 space-y-32">
        {!joinMode ? (
          <>
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
                            onClick={() => router.push(`/athlete/competitions/${c.id}`)}
                            className="bg-gray-800 rounded-lg p-6 flex items-center gap-6 border border-gray-700 cursor-pointer hover:border-cyan-400 transition-colors"
                          >
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-cyan-300">
                                {c.competitionName}
                              </h3>
                              <p className="text-gray-200">Sport: {c.sportName}</p>
                              <p className="text-gray-200">Gender: {c.gender}</p>
                              {c.disability_type && (
                                <p className="text-gray-200">Disability: {c.disability_type}</p>
                              )}
                              <p className="text-gray-200">
                                When: {new Date(c.schedule).toLocaleString()}
                              </p>
                              <p className="text-gray-200">
                                Status: <span className="text-yellow-400">Ongoing</span>
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
                            onClick={() => router.push(`/athlete/competitions/${c.id}`)}
                            className="bg-gray-800 rounded-lg p-6 flex items-center gap-6 border border-gray-700 cursor-pointer hover:border-cyan-400 transition-colors"
                          >
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-cyan-300">
                                {c.competitionName}
                              </h3>
                              <p className="text-gray-200">Sport: {c.sportName}</p>
                              <p className="text-gray-200">Gender: {c.gender}</p>
                              {c.disability_type && (
                                <p className="text-gray-200">Disability: {c.disability_type}</p>
                              )}
                              <p className="text-gray-200">
                                When: {new Date(c.schedule).toLocaleString()}
                              </p>
                              <p className="text-gray-200">
                                Status: <span className="text-green-400">Finished</span>
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
            {submitted && selectedSports.length > 0 && (
              <section
                id="mycompetition"
                ref={myCompetitionRef}
                style={{ scrollMarginTop: 180 }}
                className="mt-24"
              >
                <div
                  id="mycompetition-content"
                  className="bg-gray-800 rounded-xl p-6 mb-8"
                >
                  <h3 className="text-xl font-bold text-cyan-300 mb-4">
                    My Competition
                  </h3>
                  <ul className="list-disc pl-6 text-white">
                    {selectedSports.map((sport) => (
                      <li key={sport}>{sport}</li>
                    ))}
                  </ul>
                </div>
              </section>
            )}
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
          </>
        ) : (
          <div className="bg-gray-900 p-10 rounded-2xl max-w-3xl">
            <h2 className="text-3xl text-cyan-400 mb-10">JOIN COMPETITION</h2>

            {sports.map((sport) => (
              <label
                key={sport.sport_id}
                className="flex items-center gap-4 mb-6 text-lg"
              >
                <input
                  type="checkbox"
                  checked={sport.selected}
                  onChange={() => toggleSport(sport.sport_id)}
                  className="w-5 h-5"
                />
                {sport.sport_name}
              </label>
            ))}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || isChanged === false}
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

      {/* BACK BUTTON */}
      <button
        onClick={() => window.history.back()}
        className="fixed bottom-16 left-4 px-4 py-2 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-400 transition"
      >
        Back
      </button>

      {/* LOGOUT BUTTON */}
      <button
        onClick={async () => {
          const { logout } = await import("@/app/actions/auth");
          await logout();
        }}
        className="fixed bottom-4 left-4 px-4 py-2 bg-red-500 text-white rounded-full font-semibold hover:bg-red-400 transition"
      >
        Logout
      </button>

      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
            toast.type === "success"
              ? "bg-green-500 text-black"
              : "bg-red-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>

  );
}