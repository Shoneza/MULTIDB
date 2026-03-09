"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AthleteFormPage() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    firstName: "",
    surname: "",
    gender: "",
    religion: "",
    nationality: "",
    bloodType: "",
    nationalId: "",
    teamName: "",
    weight: "",
    height: "",
    disability: "",
  });
  const [saved, setSaved] = useState(false);

  // No persistence: keep form front-end only (do not load from storage)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    alert("Profile saved (front-end only)");
    const user = localStorage.getItem('activeUser');
    if (user) {
      // save profile data
      const storedProfiles = localStorage.getItem('userProfiles');
      const profiles: Record<string, any> = storedProfiles ? JSON.parse(storedProfiles) : {};
      profiles[user] = profile;
      localStorage.setItem('userProfiles', JSON.stringify(profiles));

      // if there is a pending registration for this user, finalize it
      const pending = localStorage.getItem('pendingRegistration');
      if (pending) {
        try {
          const { username, password } = JSON.parse(pending);
          if (username === user) {
            const storedUsers = localStorage.getItem('registeredUsers');
            const users: Record<string, string> = storedUsers ? JSON.parse(storedUsers) : {};
            users[username] = password;
            localStorage.setItem('registeredUsers', JSON.stringify(users));
            localStorage.removeItem('pendingRegistration');
          }
        } catch {} // ignore parse errors
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="w-full max-w-5xl">
        <div className="bg-[#0f1720] rounded-3xl p-8">
          <div className="flex justify-center mb-4">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-purple-200 flex items-center justify-center mb-3">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12c2.209 0 4-1.791 4-4s-1.791-4-4-4-4 1.791-4 4 1.791 4 4 4z" fill="#5b21b6"/>
                  <path d="M4 20c0-3.314 2.686-6 6-6h4c3.314 0 6 2.686 6 6v0H4z" fill="#5b21b6"/>
                </svg>
              </div>
              <button className="mt-0 bg-cyan-400 text-black rounded-full px-4 py-2 text-sm">Upload Profile</button>
            </div>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-cyan-300 text-sm mb-4">PERSONAL INFORMATION</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input name="firstName" value={profile.firstName} onChange={handleChange} placeholder="First Name" className="rounded-full px-3 py-2 bg-white text-black placeholder-gray-500" />
                <input name="surname" value={profile.surname} onChange={handleChange} placeholder="Surname" className="rounded-full px-3 py-2 bg-white text-black placeholder-gray-500" />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <select name="gender" value={profile.gender} onChange={handleChange} className="rounded-full px-3 py-2 bg-white text-black placeholder-gray-500">
                  <option value="">Select gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
                <input name="religion" value={profile.religion} onChange={handleChange} placeholder="Religion" className="rounded-full px-3 py-2 bg-white text-black placeholder-gray-500" />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input name="nationality" value={profile.nationality} onChange={handleChange} placeholder="Nationality" className="rounded-full px-3 py-2 bg-white text-black placeholder-gray-500" />
                <select name="bloodType" value={profile.bloodType} onChange={handleChange} className="rounded-full px-3 py-2 bg-white text-black placeholder-gray-500">
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div className="mt-2">
                <input name="nationalId" value={profile.nationalId} onChange={handleChange} placeholder="National ID" className="w-full rounded-full px-3 py-2 bg-white text-black placeholder-gray-500" />
              </div>
            </div>

            <div>
              <h3 className="text-cyan-300 text-sm mb-4">TEAM & PHYSICAL DATA</h3>
              <div className="mb-3">
                <input name="teamName" value={profile.teamName} onChange={handleChange} placeholder="Team Name" className="w-full rounded-full px-3 py-2 bg-white text-black placeholder-gray-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input name="weight" value={profile.weight} onChange={handleChange} placeholder="Weight (kg)" className="rounded-full px-3 py-2 bg-white text-black placeholder-gray-500" />
                <input name="height" value={profile.height} onChange={handleChange} placeholder="Height (cm)" className="rounded-full px-3 py-2 bg-white text-black placeholder-gray-500" />
              </div>
              <div className="mt-3">
                <h3 className="text-cyan-300 text-sm mb-2">DISABILITY CATEGORY</h3>
                <select name="disability" value={profile.disability} onChange={handleChange} className="w-full rounded-full px-3 py-2 bg-white text-black placeholder-gray-500">
                    <option value="">Select Disability Category</option>
                    <option value="11">Visual Impairment (11)</option>
                    <option value="12">Visual Impairment (12)</option>
                    <option value="13">Visual Impairment (13)</option>
                    <option value="20">Intellectual Disability (20)</option>
                    <option value="31">Hypertonia (31)</option>
                    <option value="32">Athetosis (32)</option>
                    <option value="33">Ataxia (33)</option>
                    <option value="34">Mixed (34)</option>
                    <option value="40">Leg Length Difference (40)</option>
                    <option value="41">Leg Amputation (41)</option>
                    <option value="42">Arm Amputation (42)</option>
                    <option value="43">Arm Deficiency (43)</option>
                    <option value="44">Leg Deficiency (44)</option>
                    <option value="45">Short Stature (45)</option>
                    <option value="50">Wheelchair Users - Tetraplegia (50)</option>
                    <option value="51">Wheelchair Users - Paraplegia (51)</option>
                    <option value="52">Wheelchair Users - Polio (52)</option>
                    <option value="53">Wheelchair Users - Amputee (53)</option>
                    <option value="54">Wheelchair Users - Les Autres (54)</option>
                </select>
              </div>
            </div>

            <div className="col-span-2 border-t border-gray-700 pt-4 flex justify-end">
              <button type="submit" className="bg-cyan-400 text-black px-4 py-2 rounded-full">SAVE</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
