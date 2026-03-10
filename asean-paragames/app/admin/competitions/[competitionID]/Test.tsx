
'use client'
import { useEffect, useState, useRef } from "react";
import {Competition} from "../page";
import {mapDisabilityCodeToName} from "../../../tool/disability";
type Section = "description" | "athletes" | "scoreboard";

type Athlete = {
  id: number;
  firstName: string;
  surname: string;
  nationality: string;
  attempts: number[];
  best_score?: number;
};
interface AvailableAthlete {
    id: number;
  firstName: string;
  surname: string;
  nationality: string;

}
const DISABILITY_OPTIONS = [
  "Visual Impairment",
  "Hearing Impairment",
  "Impaired Muscle Power",
  "Impaired Passive Range of Movement",
  "Short Stature",
  "Intellectual Impairment",

];

type Props = {
  competitionId: string ;
};

export default  function TournamentDetailClient({competitionId}:Props) {
    const [competitionInfo, setCompetitionInfo] = useState<Competition | null>(null);
    const [sportID, setSportID] = useState<number | null>(null);
    const [activeSection, setActiveSection] = useState<Section>("description");
    const [athletes, setAthletes] = useState<Athlete[]>([]);
    const [availableAthletes, setAvailableAthletes] = useState<AvailableAthlete[]>([]);

    const [showSelectionModal, setShowSelectionModal] = useState(false);

    const [selected, setSelected] = useState<Record<number, boolean>>({});

    const maxAttempts = Math.max(...athletes.map(a => a.attempts.length), 0);

    const [editing, setEditing] = useState<{ athleteId: number; attemptIdx: number; currentScore?: number } | null>(null);

    const [editValue, setEditValue] = useState("");

    const [isFinished, setIsFinished] = useState(false);

    const descriptionRef = useRef<HTMLElement | null>(null);
    const athletesRef = useRef<HTMLElement | null>(null);
    const scoreboardRef = useRef<HTMLElement | null>(null);

 
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
      if (scoreboardRef.current) observer.observe(scoreboardRef.current);

      return () => observer.disconnect();
    }, []);

    // ===============================
    // SCROLL TO SECTION
    // ===============================
    const scrollTo = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    };

    function toggleSelect(id: number) {
        const currently = !!selected[id];
        const count = Object.values(selected).filter(Boolean).length;
        if (!currently && count >= 8) {
            alert("เลือกได้สูงสุด 8 รายการ");
            return;
        }
        setSelected((s) => ({ ...s, [id]: !s[id] }));
    }

    const selectedCount = Object.values(selected).filter(Boolean).length;

    function addSelectedToList() {
        const toAdd = availableAthletes.filter(a => selected[a.id]);
        console.log("Adding athletes:", toAdd);
        const action = 'register';
        toAdd.forEach(async (athlete) => {
          try{
            const res = await fetch('/api/participations',{
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',   
              },
              body: JSON.stringify({
                action: action,
                competition_id: competitionId,
                athlete_id: athlete.id,
              })
            });
            if (!res.ok){
              const errorText = await res.text();
              console.error(`Failed to add athlete ${athlete.id}:`, errorText);
              if (res.status === 403 && errorText.includes('finished')) {
                alert('Cannot add athletes to a finished competition');
                return;
              }
            }

          } catch (error) {}
        });
        setSelected({});
        setShowSelectionModal(false);
        fetchParticipations();
    }
    
    const handleAddAttempt = async () => {
      // Add new attempt to all athletes
      setAthletes((athletes)=> athletes.map(a => ({...a, attempts: [...a.attempts, 0]})));
      maxAttempts + 1;
      // Save new attempt to DB for all athletes
      athletes.forEach(async (athlete) => {
        try{
          const res = await fetch('/api/participations',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',   
            },
            body: JSON.stringify({
              action: 'add_attempt',
              competition_id: competitionId,
              athlete_id: athlete.id,
              
            })
          
          });
          if (!res.ok){
            const errorText = await res.text();
            console.error(`Failed to add attempt for athlete ${athlete.id}:`, errorText);
            if (res.status === 403 && errorText.includes('finished')) {
              alert('Cannot add attempts to a finished competition');
              // Revert the UI change
              setAthletes((athletes)=> athletes.map(a => ({...a, attempts: a.attempts.slice(0, -1)})));
              return;
            }
          }
        } catch(error) {
           
        }
      });
    }

    function handleEditScore(athleteId: number, attemptIdx: number, currentScore: number | undefined) {
        setEditing({ athleteId, attemptIdx, currentScore });
        setEditValue(currentScore !== undefined ? String(currentScore) : "");
    }
    useEffect(() => {
        if (competitionId) {
            fetchCompetitionInfo();
        }
    }, [competitionId]);

    useEffect(() => {
        if (competitionInfo) {
        console.log("Competition Info updated:", competitionInfo);
        setIsFinished(competitionInfo.isFinished || false);
        fetchParticipations();
        fetchAvailableAthletes();
        
        }
    }, [competitionInfo]);
    useEffect(()=> {
        console.log("Athletes updated:", athletes);
        fetchAvailableAthletes();
    },[athletes])
    function handleSaveScore() {
      if (!editing) return;
      setAthletes((athletes) =>
        athletes.map((a) => {
          if (a.id === editing.athleteId) {
            const newAttempts = [...a.attempts];
            newAttempts[editing.attemptIdx] = parseFloat(editValue);
            return { ...a, attempts: newAttempts };
          }
          return a;
        })
      );
      saveScoreToDB(editing.athleteId, editing.attemptIdx, parseFloat(editValue), editing.currentScore);
      setEditing(null);
      setEditValue("");
    }

    const toggleFinishedStatus = async () => {
      const newStatus = !isFinished;
      try {
        const res = await fetch('/api/competitions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'update',
            competitionId: competitionId,
            status: newStatus,
          })
        });
        if (res.ok) {
          setIsFinished(newStatus);
          setCompetitionInfo(prev => prev ? {...prev, isFinished: newStatus} : null);
        } else {
          console.error('Failed to update competition status');
        }
      } catch (error) {
        console.error('Error updating competition status:', error);
      }
    };

    async function saveScoreToDB(athleteId: number, attemptIdx: number, score: number, currentScore?: number | undefined) {
      try {
        const res = await fetch('/api/participations',{
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            competition_id: competitionId,
            athlete_id: athleteId,
            attempt_number: attemptIdx + 1,
            score: score,
          })
        });
        if (!res.ok) {
          const errorText = await res.text();
          console.error(`Failed to save score for athlete ${athleteId}:`, errorText);
          if (res.status === 403 && errorText.includes('finished')) {
            alert('Cannot edit scores in a finished competition');
            // Revert the UI change
            setAthletes((athletes) =>
              athletes.map((a) => {
                if (a.id === athleteId) {
                  const newAttempts = [...a.attempts];
                  newAttempts[attemptIdx] = currentScore || 0;
                  return { ...a, attempts: newAttempts };
                }
                return a;
              })
            );
          }
        }
      } catch (error) {

      }
    }
    async function fetchCompetitionInfo() {
        if (!competitionId) return;
        
        try {
            const res = await fetch(`/api/competitions?competitionId=${competitionId}`);
            if (!res.ok) {
            console.error("Failed to fetch competition info");
            return;
            }
            const data = await res.json();
            console.log("Competition Info:", data);
            console.log('Sport ID:', data.sport_id);
            setSportID(data.sport_id);
            setCompetitionInfo(data);
            if (data.sport_id) {
                const sportName =  await getSportName(data.sport_id);
                const reformattedData: Competition = {
                    id: data.competition_id,
                    sportName: sportName,
                    competitionName: data.competition_name,
                    disability_type: data.disability_type,
                    gender: data.gender,
                    schedule: data.date_time,
                    isFinished: data.is_finished,
                }
                setCompetitionInfo(reformattedData);
                
            }
        } catch (error) {
            console.error("Error fetching competition:", error);
        }
    };
    const fetchSports = async () => {
        const res = await fetch("/api/sports");
        const data = await res.json();
        return data;
    };
    async function getSportName(sportId: number) {
        try {
            const sports = await fetchSports();
            console.log("Fetched sports:", sports);
            const sport = sports.find((s: any) => s.sport_id === sportId);
            console.log(`Looking for sport ID ${sportId}, found:`, sport);
            return sport ? sport.sport_name : "Unknown Sport";
        } catch (error) {
            console.error("Error fetching sports:", error);
            return "Unknown Sport";
        }
    }



    async function fetchAvailableAthletes() {
        if (!sportID || !competitionInfo) return;
        const params = new URLSearchParams({
            sportId: String(sportID),
            disabilityType: competitionInfo.disability_type,
            gender: competitionInfo.gender,
        });
        console.log("Params for fetching available athletes:", params.toString());
        const res = await fetch(`/api/registration?${params.toString()}`);
        const data = await res.json();
        console.log("Available athletes:", data);
        const formatted: AvailableAthlete[] = data.map((a: any) => ({
            id: a.athlete_id,
            firstName: a.name_en,
            surname: a.surname_en,
            nationality: a.nationality,
        }));
        // Filter out athletes already in the competition
        const currentAthleteIds = athletes.map(a => a.id);
        console.log("Current athlete IDs in competition:", currentAthleteIds);
        const filtered = formatted.filter((a: AvailableAthlete) => !currentAthleteIds.includes(a.id));
      
        setAvailableAthletes(filtered);

    }
    async function fetchParticipations() {
      const searchParams = new URLSearchParams({ competitionId });
      const res = await fetch(`/api/participations?${searchParams.toString()}`);
      const data = await res.json();
      const grouped: Record<number, Athlete> = {};
      let maxAttempt = 0;
      for (const p of data) {
        if (p.attempt_number > maxAttempt) {
          maxAttempt = p.attempt_number;
        }
      }
      data.forEach((p:any)=> {
        if (!grouped[p.athlete_id]) {
          const attemptsArray = new Array(maxAttempt).fill(undefined);
          grouped[p.athlete_id] = {
            id: p.athlete_id,
            firstName: p.name_en,
            surname: p.surname_en,
            attempts: attemptsArray,
            nationality: p.nationality,
            best_score: p.best_score,
          }
          
          grouped[p.athlete_id].attempts[p.attempt_number - 1] = p.score;
        } else {
          grouped[p.athlete_id].attempts[p.attempt_number - 1] = p.score;
        }
      });

      // ensure best_score is computed from attempts in case backend didn't set it
      Object.values(grouped).forEach((ath) => {
        const validScores = ath.attempts.filter(s => s !== undefined && s !== null && s !== 0) as number[];
        if (validScores.length > 0) {
          const calcBest = Math.max(...validScores);
          if (ath.best_score !== calcBest) {
            ath.best_score = calcBest;
          }
        } else {
          ath.best_score = undefined;
        }
      });
      console.log("Grouped participations:", grouped);
      setAthletes(Object.values(grouped));
      fetchAvailableAthletes();



      
    }
//   async function fetchAvailableAthletes() {
//     const res = await fetch(`/api/registration?registeredSportId=${competitionInfo?.sportId}`);
//   }
  return (
    <div className="flex bg-black text-white min-h-0 max-h-full">

      {/* ===============================
          SIDEBAR
      =============================== */}
      <aside className="w-64 p-6 border-r border-gray-800 sticky top-0 h-full self-start">

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
            onClick={() => scrollTo(scoreboardRef)}
            className={`block border-l-4 pl-3 ${
              activeSection === "scoreboard"
                ? "border-cyan-400 text-white"
                : "border-transparent text-gray-400"
            }`}
          >
            SCOREBOARD
          </button>

        </nav>
      </aside>

      {/* ===============================
          CONTENT
      =============================== */}
      <main className="flex-1 px-16 py-12 space-y-32 overflow-y-auto">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center mb-12">
          {competitionInfo ? competitionInfo.competitionName : "Loading..."}
        </h1>

        {/* ===============================
            DESCRIPTION
        =============================== */}
        <section id="description" ref={descriptionRef}>
          <div className="bg-gray-900 p-10 rounded-2xl max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl">DESCRIPTION</h2>
              <div className="flex items-center gap-4">
                <span className="text-gray-400">Status:</span>
                <button
                  onClick={toggleFinishedStatus}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isFinished
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isFinished ? 'Finished' : 'Ongoing'}
                </button>
              </div>
            </div>

            <p className="text-gray-400 mb-2">
              SPORT TYPE: {competitionInfo?.sportName || "Loading..."}
            </p>
            <p className="text-gray-400 mb-2">
              DISABILITY TYPE: { competitionInfo?.disability_type ? mapDisabilityCodeToName(competitionInfo?.disability_type) : "Loading..."}
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

        {/* ===============================
            ATHLETES
        =============================== */}
        <section id="athletes" ref={athletesRef}>
          <div className="bg-gray-900 p-10 rounded-2xl max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl">ATHLETES</h2>
              <button 
                onClick={() => setShowSelectionModal(true)} 
                disabled={isFinished}
                className={`px-4 py-2 rounded-full ${isFinished ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-cyan-400 text-black hover:bg-cyan-500'}`}
              >
                Add Athlete
              </button>
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
                  {athletes.length === 0 ? 
                  (<tr>
                    <td colSpan={3} className="p-4 text-center text-gray-400">
                      No athletes registered for this competition
                    </td>
                  </tr>) 
                  : (athletes.map((a, idx) => (
                    <tr key={a.id} className="border-t border-gray-800" onClick={()=> console.log(a)}>
                      <td className="py-3">{idx + 1}</td>
                      <td className="py-3">{a.firstName} {a.surname}</td>
                      <td className="py-3">{a.nationality}</td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ===============================
            SCOREBOARD
        =============================== */}
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
                    <th className="py-3 px-4 border-b border-cyan-800 text-center">Best score</th>
                    <th className="py-3 px-4 border-b border-cyan-800 text-center"></th>
                  </tr>
                </thead>
                <tbody>
                  
                  {athletes.length === 0 ? (    
                    <tr>
                      <td colSpan={3 + maxAttempts + 2} className="p-4 text-center text-gray-400">
                      No athletes available
                      </td>
                    </tr>) 
                    :(athletes.map((athlete, idx) => (
                    <tr key={athlete.id} className="even:bg-[#182030] hover:bg-[#22304a] transition-colors">
                      <td className="py-3 px-4 border-b border-[#22304a] text-center">{idx + 1}</td>
                      <td className="py-3 px-6 border-b border-[#22304a] font-semibold text-cyan-200 whitespace-nowrap">{athlete.firstName} {athlete.surname}</td>
                      <td className="py-3 px-4 border-b border-[#22304a] text-cyan-100">{athlete.nationality}</td>
                      {[...Array(maxAttempts)].map((_, i) => (
                        <td key={i} className="py-3 px-4 border-b border-[#22304a] text-center">
                          {editing && editing.athleteId === athlete.id && editing.attemptIdx === i ? (
                            <div className="flex flex-col items-center gap-2">
                              <input
                                type="number"
                                value={editValue}
                                onChange={e => setEditValue(e.target.value)}
                                className="bg-gray-200 text-black rounded px-2 py-1 w-16 text-sm mb-1"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={handleSaveScore}
                                  className="bg-cyan-400 text-black px-2 py-1 rounded text-xs font-bold"
                                >Save</button>
                                <button
                                  onClick={() => setEditing(null)}
                                  className="bg-gray-400 text-black px-2 py-1 rounded text-xs font-bold"
                                >Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              {athlete.attempts[i] !== undefined && athlete.attempts[i] !== 0 && athlete.attempts[i] !== null ?  (
                                <>
                                  <span>{athlete.attempts[i]}</span>
                                  <button
                                    onClick={() =>{ console.log("Athlete attempt number = ",athlete.attempts[i]); handleEditScore(athlete.id, i, athlete.attempts[i])}}
                                    disabled={isFinished}
                                    className={`mt-1 px-2 py-1 rounded text-xs font-bold ${
                                      isFinished ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-yellow-400 text-black'
                                    }`}
                                  >Editable</button>
                                </>
                              ) : (
                                <>
                                  <span className="text-gray-500">No recorded</span>
                                  <button
                                    onClick={() => handleEditScore(athlete.id, i, undefined)}
                                    disabled={isFinished}
                                    className={`mt-1 px-2 py-1 rounded text-xs font-bold ${
                                      isFinished ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-yellow-400 text-black'
                                    }`}
                                  >Edit</button>
                                </>
                              )}
                            </div>
                          )}
                        </td>
                      ))}
                      <td className={`${athlete.best_score === undefined || athlete.best_score === 0 ? 'text-gray-500' : 'text-white'} text-center`}>{athlete.best_score === undefined || athlete.best_score === 0 ? 'No best score yet' : athlete.best_score}</td>
                      <td className="py-3 px-4 border-b border-[#22304a] text-center">
                        <button
                          onClick={() => handleAddAttempt()}
                          disabled={isFinished}
                          className={`font-bold px-4 py-2 rounded-full shadow transition-colors ${
                            isFinished 
                              ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                              : 'bg-linear-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 text-[#0f1720]'
                          }`}
                        >
                          + Add Attempt
                        </button>
                      </td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      {showSelectionModal && (

        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-40" onClick={()=>{
          setShowSelectionModal(false)
        }}>
          <div
            className="relative bg-[#4a5960] rounded-2xl p-4 w-full max-w-4xl border-4 border-[#3b4a51]"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setShowSelectionModal(false)} className="absolute top-3 right-3 text-white">X</button>
            <div className="flex items-center justify-between px-3 pb-3">
              <div className={`text-sm uppercase  text-cyan-200`}>{selectedCount} LISTS SELECTED</div>
              <button onClick={addSelectedToList} className="bg-cyan-400 text-black px-3 py-1 rounded-full text-sm">Add</button>
            </div>

            <div className="bg-black rounded-md p-2">
              <div className="w-full overflow-y-auto max-h-64">
                <table className="w-full text-left table-fixed">
                  <thead>
                    <tr className="text-gray-300 text-sm">
                      <th className="w-10"> </th>
                      <th className="w-16 py-2">No.</th>
                      <th className="py-2">Name</th>
                      <th className="w-40 py-2">Nationality</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableAthletes.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-gray-400">  No available athletes to add </td>
                      </tr>
                    ) : availableAthletes.map((a, idx) => (
                      <tr key={a.id} className="border-t border-gray-800">
                        <td className="p-2">
                          <input
                            type="checkbox"
                            checked={!!selected[a.id]}
                            onChange={() => toggleSelect(a.id)}
                            disabled={selectedCount >= 8 && !selected[a.id]}
                          />
                        </td>
                        <td className="p-2">{idx + 1}</td>
                        <td className="p-2">{a.firstName} {a.surname}</td>
                        <td className="p-2">{a.nationality}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
      )}

    </div>
  );
}
