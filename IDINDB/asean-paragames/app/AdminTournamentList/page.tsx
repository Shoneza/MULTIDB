'use client';

import { useState } from 'react';

interface Tournament {
  id: string;
  logo: string;
  sportName: string;
  competitionName: string;
  disabilityType: string;
  schedule: string;
}

export default function HomePage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    logo: '',
    sportName: '',
    competitionName: '',
    disabilityType: '',
    schedule: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTournament = () => {
    if (
      formData.logo &&
      formData.sportName &&
      formData.competitionName &&
      formData.disabilityType &&
      formData.schedule
    ) {
      const newTournament: Tournament = {
        id: (tournaments.length + 1).toString(),
        ...formData,
      };
      setTournaments([...tournaments, newTournament]);
      setFormData({
        logo: '',
        sportName: '',
        competitionName: '',
        disabilityType: '',
        schedule: '',
      });
      setIsModalOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-48 bg-black p-6 border-r border-gray-700">
        <div className="mb-8">
          <h2 className="text-cyan-400 font-bold text-lg">ASEAN</h2>
          <h2 className="text-cyan-400 font-bold text-lg">PARAGAMES 2025</h2>
        </div>
        <nav className="space-y-4">
          <div className="py-2 px-3 bg-cyan-400 text-black font-semibold rounded">
            TOURNAMENT
          </div>
          <div className="py-2 px-3 hover:bg-gray-800 cursor-pointer rounded">
            ANNOUNCEMENT
          </div>
          <div className="py-2 px-3 hover:bg-gray-800 cursor-pointer rounded">
            LOCATION
          </div>
          <div className="py-2 px-3 hover:bg-gray-800 cursor-pointer rounded">
            REQUEST TICKET
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div>
          <h1 className="text-3xl font-bold mb-8">UPCOMING TOURNAMENT</h1>

          <div className="space-y-4">
            {tournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="bg-gray-800 rounded-lg p-6 flex items-center gap-6 border border-gray-700 hover:border-gray-600 transition"
              >
                <div className="w-16 h-16 bg-gray-700 rounded flex items-center justify-center text-gray-500 font-semibold">
                  {tournament.logo}
                </div>
                <div className="flex-1 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">{tournament.sportName}</p>
                    <p className="text-gray-400 text-sm mt-2">
                      {tournament.disabilityType}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">
                      {tournament.competitionName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">{tournament.schedule}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Plus Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-12 h-12 bg-cyan-400 text-black rounded-full flex items-center justify-center text-2xl font-bold hover:bg-cyan-300 transition shadow-lg z-40"
      >
        +
      </button>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">[Admin] Added Tournament Popup CREATE</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Logo</label>
                <input
                  type="text"
                  name="logo"
                  value={formData.logo}
                  onChange={handleInputChange}
                  placeholder="[LOGO]"
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Sport Name</label>
                <input
                  type="text"
                  name="sportName"
                  value={formData.sportName}
                  onChange={handleInputChange}
                  placeholder="[SPORT NAME]"
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Competition Name
                </label>
                <input
                  type="text"
                  name="competitionName"
                  value={formData.competitionName}
                  onChange={handleInputChange}
                  placeholder="[COMPETITION NAME]"
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Disability Type
                </label>
                <input
                  type="text"
                  name="disabilityType"
                  value={formData.disabilityType}
                  onChange={handleInputChange}
                  placeholder="[DISABILITY TYPE]"
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Schedule</label>
                <input
                  type="date"
                  name="schedule"
                  value={formData.schedule}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTournament}
                  className="px-4 py-2 bg-cyan-400 text-black font-semibold rounded hover:bg-cyan-300 transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}