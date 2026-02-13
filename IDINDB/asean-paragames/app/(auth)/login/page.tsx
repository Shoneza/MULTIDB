"use client";

import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    nationalId: "",
    nameEn: "",
    surnameEn: "",
    gender: "",
    religion: "",
    nationality: "",
    bloodType: "",
    teamName: "",
    weight: "",
    height: "",
    isWheelchairDependants: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setForm({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      nationalId: "",
      nameEn: "",
      surnameEn: "",
      gender: "",
      religion: "",
      nationality: "",
      bloodType: "",
      teamName: "",
      weight: "",
      height: "",
      isWheelchairDependants: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Registration submitted!\n" + JSON.stringify(form, null, 2));
    const res = await fetch("/api/athletes",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: form.username,
        password: form.password,
        email: form.email,
        national_id: form.nationalId,
        name_en: form.nameEn,
        surname_en: form.surnameEn,
        gender: form.gender,
        religion: form.religion,
        nationality: form.nationality,
        blood_type: form.bloodType,
        team_name: form.teamName,
        weight: form.weight,
        height: form.height,
        is_wheelchair_dependant: form.isWheelchairDependants,
      }),
    });
    const result = await res.json();
    if (res.ok) {
      alert("Registration successful!");
      handleReset();
    } else {
      alert("Registration failed: " + result.error);
    }
  };

  // Simple password toggle for demo (not secure for production)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans text-black">
      <main className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <form className="form-container" id="registerForm" onSubmit={handleSubmit} onReset={handleReset}>
          {/* Account Section */}
          <div className="form-section mb-8">
            <div className="section-title text-lg font-bold mb-4">Account Information</div>
            <div className="form-group form-row mb-4">
              <div className="w-full">
                <label htmlFor="username" className="block font-medium mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="border rounded px-3 py-2 w-full"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group form-row mb-4">
              <div className="w-full">
                <label htmlFor="email" className="block font-medium mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="border rounded px-3 py-2 w-full"
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group form-row flex gap-4 mb-4">
              <div className="w-1/2 relative">
                <label htmlFor="password" className="block font-medium mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="border rounded px-3 py-2 w-full"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className="absolute right-3 top-9 cursor-pointer select-none"
                  onClick={() => setShowPassword((v) => !v)}
                  title="Show/Hide Password"
                >
                  {showConfirm ? "hide" : "show"}
                </span>
              </div>
              <div className="w-1/2 relative">
                <label htmlFor="confirmPassword" className="block font-medium mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type={showConfirm ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  className="border rounded px-3 py-2 w-full"
                  placeholder="Confirm password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <span
                  className="absolute right-3 top-9 cursor-pointer select-none"
                  onClick={() => setShowConfirm((v) => !v)}
                  title="Show/Hide Password"
                >
                 {showConfirm ? "hide" : "show"}
                </span>
              </div>
            </div>
          </div>

          {/* Athlete Information Section */}
          <div className="form-section mb-8">
            <div className="section-title text-lg font-bold mb-4">Personal Information</div>
            <div className="form-group form-row mb-4">
              <div className="w-full">
                <label htmlFor="nationalId" className="block font-medium mb-1">
                  National ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nationalId"
                  name="nationalId"
                  className="border rounded px-3 py-2 w-full"
                  placeholder="Enter your national ID"
                  value={form.nationalId}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group form-row flex gap-4 mb-4">
              <div className="w-1/2">
                <label htmlFor="nameEn" className="block font-medium mb-1">
                  First Name (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nameEn"
                  name="nameEn"
                  className="border rounded px-3 py-2 w-full"
                  placeholder="First name"
                  value={form.nameEn}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="surnameEn" className="block font-medium mb-1">
                  Surname (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="surnameEn"
                  name="surnameEn"
                  className="border rounded px-3 py-2 w-full"
                  placeholder="Surname"
                  value={form.surnameEn}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group form-row flex gap-4 mb-4">
              <div className="w-1/2">
                <label htmlFor="gender" className="block font-medium mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  className="border rounded px-3 py-2 w-full"
                  value={form.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
              </div>
              <div className="w-1/2">
                <label htmlFor="religion" className="block font-medium mb-1">
                  Religion
                </label>
                <input
                  type="text"
                  id="religion"
                  name="religion"
                  className="border rounded px-3 py-2 w-full"
                  placeholder="Your religion"
                  value={form.religion}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group form-row flex gap-4 mb-4">
              <div className="w-1/2">
                <label htmlFor="nationality" className="block font-medium mb-1">
                  Nationality <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nationality"
                  name="nationality"
                  className="border rounded px-3 py-2 w-full"
                  placeholder="Your nationality"
                  value={form.nationality}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="bloodType" className="block font-medium mb-1">
                  Blood Type
                </label>
                <select
                  id="bloodType"
                  name="bloodType"
                  className="border rounded px-3 py-2 w-full"
                  value={form.bloodType}
                  onChange={handleChange}
                >
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
            </div>
          </div>

          {/* Team & Physical Information */}
            <div className="form-section mb-8">
            <div className="section-title text-lg font-bold mb-4">Team & Physical Data</div>
            <div className="form-group form-row mb-4">
              <div className="w-full">
              <label htmlFor="teamName" className="block font-medium mb-1">
                Team Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="teamName"
                name="teamName"
                className="border rounded px-3 py-2 w-full"
                placeholder="Your team name"
                value={form.teamName}
                onChange={handleChange}
                required
              />
              </div>
            </div>
            <div className="form-group form-row flex gap-4 mb-4">
              <div className="w-1/2">
              <label htmlFor="weight" className="block font-medium mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                className="border rounded px-3 py-2 w-full"
                placeholder="0.0"
                min={0}
                step={0.1}
                value={form.weight}
                onChange={handleChange}
              />
              </div>
              <div className="w-1/2">
              <label htmlFor="height" className="block font-medium mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                id="height"
                name="height"
                className="border rounded px-3 py-2 w-full"
                placeholder="0"
                min={0}
                step={0.1}
                value={form.height}
                onChange={handleChange}
              />
              </div>
            </div>
            <div className="form-group form-row mb-4">
              <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isWheelchairDependants"
                name="isWheelchairDependants"
                className="w-4 h-4"
                checked={form.isWheelchairDependants}
                onChange={(e) => setForm((prev) => ({ ...prev, isWheelchairDependants: e.target.checked }))}
              />
              <label htmlFor="isWheelchairDependants" className="font-medium">
                Wheelchair Dependent
              </label>
              </div>
            </div>
            </div>

          {/* Buttons */}
          <div className="button-group flex gap-4 justify-end">
            <button type="submit" className="btn-submit bg-black text-white rounded px-4 py-2 hover:bg-zinc-800">
              Register
            </button>
            <button type="reset" className="btn-reset border border-zinc-400 rounded px-4 py-2 hover:bg-zinc-100">
              Clear
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}