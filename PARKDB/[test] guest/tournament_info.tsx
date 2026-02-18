"use client";

import { useEffect, useRef, useState } from "react";

export default function TournamentPage() {
  const [activeSection, setActiveSection] = useState("description");

  const descriptionRef = useRef<HTMLDivElement>(null);
  const athletesRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = [
      { id: "description", ref: descriptionRef },
      { id: "athletes", ref: athletesRef },
      { id: "location", ref: locationRef },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    sections.forEach((section) => {
      if (section.ref.current) {
        observer.observe(section.ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen bg-black text-white">

      {/* Sidebar */}
      <aside className="w-64 p-6 sticky top-0 h-screen border-r border-gray-800">
        <h2 className="text-cyan-400 text-xl font-bold mb-8">
          ASEAN PARAGAMES 2025
        </h2>

        <ul className="space-y-6">
          <li
            onClick={() => scrollToSection(descriptionRef)}
            className={`cursor-pointer transition ${
              activeSection === "description"
                ? "text-cyan-400 border-l-4 border-cyan-400 pl-2"
                : "text-gray-400"
            }`}
          >
            DESCRIPTION
          </li>

          <li
            onClick={() => scrollToSection(athletesRef)}
            className={`cursor-pointer transition ${
              activeSection === "athletes"
                ? "text-cyan-400 border-l-4 border-cyan-400 pl-2"
                : "text-gray-400"
            }`}
          >
            ATHLETE LIST
          </li>

          <li
            onClick={() => scrollToSection(locationRef)}
            className={`cursor-pointer transition ${
              activeSection === "location"
                ? "text-cyan-400 border-l-4 border-cyan-400 pl-2"
                : "text-gray-400"
            }`}
          >
            LOCATION
          </li>
        </ul>
      </aside>

      {/* Content */}
      <main className="flex-1 p-10 space-y-32">

        {/* DESCRIPTION */}
        <section id="description" ref={descriptionRef}>
          <h1 className="text-3xl font-bold mb-6">DESCRIPTION</h1>
          <div className="bg-gray-900 p-8 rounded-lg">
            <p>Sport Type: Long Jump</p>
            <p>Disability Type: T42</p>
            <p>Schedule: 2026-01-24 09:00</p>
          </div>
        </section>

        {/* ATHLETES */}
        <section id="athletes" ref={athletesRef}>
          <h1 className="text-3xl font-bold mb-6">ATHLETES</h1>
          <div className="bg-gray-900 p-8 rounded-lg">
            <p>TEST1 - Thailand</p>
            <p>TEST2 - Cambodia</p>
            <p>TEST3 - Vietnam</p>
          </div>
        </section>

        {/* LOCATION */}
        <section id="location" ref={locationRef}>
          <h1 className="text-3xl font-bold mb-6">LOCATION</h1>
          <div className="bg-gray-900 p-8 rounded-lg">
            <div className="bg-gray-700 h-64 flex items-center justify-center">
              MAP HERE
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
