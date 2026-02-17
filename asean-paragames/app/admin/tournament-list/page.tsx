"use client";

import { useState, useEffect } from 'react';

interface Competition {
  id: string;
  sportName: string;
  competitionName: string;
  gender: string;
  schedule: string;
}

interface Sport {
  sport_id: number;
  sport_name: string;
}

const initialCompetitions: Competition[] = [
  {
    id: '1',
    sportName: 'Long Jump',
    competitionName: "Men's Long Jump T42",
    gender: 'Male',
    schedule: '2025-11-01T09:00',
  },
  {
    id: '2',
    sportName: 'High Jump',
    competitionName: "Women's High Jump T44",
    gender: 'Female',
    schedule: '2025-11-02',}];
export default function HomePage() {
  const [Competitions, setCompetitions] = useState<Competition[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // useEffect(() => {
  //   const savedCompetitions = localStorage.getItem('Competitions');
  //   if (savedCompetitions) {
  //     setCompetitions(JSON.parse(savedCompetitions));
  //   } else {
  //     setCompetitions(initialCompetitions);
  //   }
  //   setIsLoaded(true);
  // }, []);

  // useEffect(() => {
  //   if (isLoaded) {
  //     localStorage.setItem('Competitions', JSON.stringify(Competitions));
  //   }
  // }, [Competitions, isLoaded]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    sportName: '',
    competitionName: '',
    gender: '',
    disabilityType: '',
    schedule: '',
  });
    const [sports, setSports] = useState<Sport[]>([]);
  const fetchSports = async () => {
    const res = await fetch('/api/sports');
    const data = await res.json();
    setSports(data);
  }
  const fetchCompetitions = async () => {
    fetch('/api/competitions')
      .then((res) => res.json())
      .then((data) => {
        const formattedCompetitions = data.map((comp:any)=> ({
          id: comp.competition_id.toString(),
          sportName: comp.sport_name,
          competitionName: comp.competition_name,
          gender: comp.gender,
          schedule: new Date(comp.date_time).toISOString(),
        }))
        setCompetitions(formattedCompetitions);
      })
  }

  // Fetch sports from the database when the component mounts
  useEffect(() => {
    fetchSports();
    fetchCompetitions();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCompetition =async () => {
    if (
      formData.sportName &&
      formData.competitionName &&
      formData.gender &&
      formData.disabilityType &&
      formData.schedule
    ) {
      const response = await fetch('/api/competitions',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if(response.ok){
        const newCompetition: Competition = {
          id: (Competitions.length + 1).toString(),
          ...formData,
        };
        setCompetitions([...Competitions, newCompetition]);
        setFormData({
          sportName: '',
          competitionName: '',
          gender: '',
          disabilityType: '',
          schedule: '',
        });
        setIsModalOpen(false);
      }
    }
  };

  return (
    <div className="flex h-full w-full bg-gray-900 text-white">
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div>
          <h1 className="text-3xl font-bold mb-8">UPCOMING Competition</h1>
          <div className="space-y-4">
            {Competitions.map((Competition) => (
              <div
                key={Competition.id}
                className="bg-gray-800 rounded-lg p-6 flex items-center gap-6 border border-gray-700 hover:border-gray-600 transition"
              >
                <div className="flex-1 grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">{Competition.sportName}</p>
                    <p className="text-gray-400 text-sm mt-2">
                      {/* {Competition.disabilityType} */}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">
                      {Competition.competitionName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">{Competition.gender}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">
                      {new Date(Competition.schedule).toLocaleDateString()}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {new Date(Competition.schedule).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
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
              <h2 className="text-2xl font-bold">[Admin] Added Competition Popup CREATE</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Sport Name</label>
                <select
                  name="sportName"
                  value={formData.sportName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, sportName: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="">Select a sport</option>
                  {sports.map((sport) => (
                    <option key={sport.sport_id} value={sport.sport_id}>
                      {sport.sport_name}
                    </option>
                  ))}
                </select>
                </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={(e) => setFormData((prev) => ({ ...prev, gender: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="">Select Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                
                </select>
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
                <select
                  name="disabilityType"
                  value={formData.disabilityType}
                  onChange={(e) => setFormData((prev) => ({ ...prev, disabilityType: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="">Select Disability Type</option>
                  <option value="Lower Limb Deficiency">Lower Limb Deficiency</option>
                  <option value="Upper Limb Deficiency">Upper Limb Deficiency</option>
                  <option value="Visual Impairment">Visual Impairment</option>
                  <option value="Hearing Impairment">Hearing Impairment</option>
                  <option value="Intellectual Disability">Intellectual Disability</option>
                  <option value="Cerebral Palsy">Cerebral Palsy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Schedule & Time</label>
                <input
                  type="datetime-local"
                  name="datetime"
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
                  onClick={handleAddCompetition}
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