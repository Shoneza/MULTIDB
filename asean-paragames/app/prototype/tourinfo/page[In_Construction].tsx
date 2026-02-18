"use client";

import { useEffect, useState, useRef } from "react";

type Section = "description" | "athletes" | "location";

export default function TournamentDetailPage() {

  const [activeSection, setActiveSection] = useState<Section>("description");

  const descriptionRef = useRef<HTMLElement | null>(null);
  const athletesRef = useRef<HTMLElement | null>(null);
  const locationRef = useRef<HTMLElement | null>(null);

  // ===============================
  // SCROLL SPY (auto highlight sidebar)
  // ===============================
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
        rootMargin: "-40% 0px -50% 0px", // trigger when near middle
        threshold: 0
      }
    );

    if (descriptionRef.current) observer.observe(descriptionRef.current);
    if (athletesRef.current) observer.observe(athletesRef.current);
    if (locationRef.current) observer.observe(locationRef.current);

    return () => observer.disconnect();
  }, []);

  // ===============================
  // SCROLL TO SECTION
  // ===============================
  const scrollTo = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
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

          <button
            onClick={() => scrollTo(descriptionRef)}
            className={`block border-l-4 pl-3 ${
              activeSection === "description"
                ? "border-cyan-400 text-white"
                : "border-transparent text-gray-400"
            }`}
          >
            DESCRIPTION
          </button>

          <button
            onClick={() => scrollTo(athletesRef)}
            className={`block border-l-4 pl-3 ${
              activeSection === "athletes"
                ? "border-cyan-400 text-white"
                : "border-transparent text-gray-400"
            }`}
          >
            ATHLETE LIST
          </button>

          <button
            onClick={() => scrollTo(locationRef)}
            className={`block border-l-4 pl-3 ${
              activeSection === "location"
                ? "border-cyan-400 text-white"
                : "border-transparent text-gray-400"
            }`}
          >
            LOCATION
          </button>

        </nav>
      </aside>

      {/* ===============================
          CONTENT
      =============================== */}
      <main className="flex-1 px-16 py-12 space-y-32">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center mb-12">
          [COMPETITION NAME]
        </h1>

        {/* ===============================
            DESCRIPTION
        =============================== */}
        <section id="description" ref={descriptionRef}>
          <div className="bg-gray-900 p-10 rounded-2xl max-w-3xl mx-auto">
            <h2 className="text-2xl mb-6">DESCRIPTION</h2>

            <p className="text-gray-400 mb-2">
              SPORT TYPE: [SPORT NAME]
            </p>
            <p className="text-gray-400 mb-2">
              DISABILITY TYPE: [DISABILITY]
            </p>
            <p className="text-gray-400">
              SCHEDULE: [DATE & TIME]
            </p>
          </div>
        </section>

        {/* ===============================
            ATHLETES
        =============================== */}
        <section id="athletes" ref={athletesRef}>

          <div className="max-h-64 overflow-y-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-800">
                <tr>
                  <th>Name</th>
                  <th>Nationality</th>
                </tr>
              </thead>

              <tbody>
                {Array.isArray(athletes) && athletes.map(a => (
                  <tr key={a.id}>
                    <td className="py-2">{a.name}</td>
                    <td className="py-2">{a.nationality}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </section>

        {/* ===============================
            LOCATION
        =============================== */}
        <section id="location" ref={locationRef}>
          <div className="bg-gray-900 p-10 rounded-2xl max-w-3xl mx-auto">
            <h2 className="text-2xl mb-6">LOCATION</h2>

            <p className="text-gray-400 mb-6">[LOCATION INFO]</p>

            <div className="h-64 bg-gray-700 rounded-lg" />
          </div>
        </section>

      </main>
    </div>
  );
}
