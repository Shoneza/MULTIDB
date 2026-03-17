"use client";


import { redirect, useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "./lib/hooks/useauth";

export default function HomeLandingPage() {
	const {session, loading} = useAuth();
	const router = useRouter();
	async function handleLogout() {
		const { logout } = await import("./actions/auth");
		await logout();
	}
	if (loading) {
		return <div>Loading...</div>;
	}
	// if (session) {
	// 	redirect("/athlete");
	// 	return null;
	// }
	return (
		<div className="min-h-screen bg-gradient-to-br from-cyan-900 via-black to-blue-900 flex flex-col">
			{/* Header */}
			<header className="flex justify-end items-center p-8 gap-3">
				{session ? (
					<>
						<button
							onClick={handleLogout}
							className="px-6 py-2 bg-red-500 text-white rounded-full font-semibold hover:bg-red-400 transition"
						>
							Logout
						</button>
						<button
							onClick={() => router.push("/competitions")}
							className="px-6 py-2 bg-gradient-to-r from-cyan-700 to-blue-500 text-white rounded-full font-semibold hover:from-cyan-500 hover:to-blue-400 hover:shadow-lg transition"
						>
							View Competitions
						</button>
					</>
				) : (
					<>
						<button
							onClick={() => router.push("/login")}
							className="px-6 py-2 bg-cyan-400 text-black rounded-full font-semibold hover:bg-cyan-300 transition"
						>
							Login
						</button>
						<button
							onClick={() => router.push("/register")}
							className="px-6 py-2 bg-white text-cyan-700 rounded-full font-semibold hover:bg-gray-100 transition"
						>
							Register
						</button>
						<button
							onClick={() => router.push("/competitions/guest")}
							className="px-6 py-2 bg-gradient-to-r from-cyan-700 to-blue-500 text-white rounded-full font-semibold hover:from-cyan-500 hover:to-blue-400 hover:shadow-lg transition"
						>
							View Competitions
						</button>
					</>
				)}
			</header>

			{/* Hero Section with Image */}
			<main className="flex-1 flex flex-col items-center justify-center text-center px-4">
				<div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-12 mt-8 mb-12">
					<div className="flex-1 flex flex-col items-center md:items-start">
						<h1 className="text-5xl md:text-7xl font-extrabold text-cyan-300 drop-shadow mb-6">
							ASEAN PARAGAMES 2025
						</h1>
						<p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl">
							Welcome to the official platform for the ASEAN Paragames 2025. Join, compete, and celebrate the spirit of sportsmanship and inclusivity across Southeast Asia.
						</p>
						<div className="flex gap-6 mt-4">
							{session ? (
								<button
									onClick={() => router.push("/competitions")}
									className="px-8 py-3 bg-gradient-to-r from-cyan-700 to-blue-500 text-white rounded-full text-lg font-bold shadow hover:from-cyan-500 hover:to-blue-400 transition"
								>
									Go to Competitions
								</button>
							) : (
								<>
									<button
										onClick={() => router.push("/login")}
										className="px-8 py-3 bg-cyan-400 text-black rounded-full text-lg font-bold shadow hover:bg-cyan-300 transition"
									>
										Login
									</button>
									<button
										onClick={() => router.push("/register")}
										className="px-8 py-3 bg-white text-cyan-700 rounded-full text-lg font-bold shadow hover:bg-gray-100 transition"
									>
										Register
									</button>
									<button
										onClick={() => router.push("/guest/competitions")}
										className="px-8 py-3 bg-gradient-to-r from-cyan-700 to-blue-500 text-white rounded-full text-lg font-bold shadow hover:from-cyan-500 hover:to-blue-400 transition"
									>
										View Competitions
									</button>
								</>
							)}
						</div>
					</div>
					<div className="flex-1 flex justify-center">
						<div className="relative w-[340px] h-[340px] md:w-[400px] md:h-[400px] rounded-full overflow-hidden shadow-2xl border-4 border-cyan-400 bg-cyan-900/30">
							   <Image
								   src="/paragames.png"
								   alt="ASEAN Paragames Hero"
								   fill
								   style={{ objectFit: "cover" }}
								   priority
							   />
						</div>
					</div>
				</div>

				{/* Mockup Competition Scoreboard */}
				<section className="bg-gray-900 py-16 px-4 flex flex-col items-center w-full">
					<h2 className="text-3xl font-bold text-cyan-300 mb-8">Competition Scoreboard (Mockup)</h2>
					<div className="w-full max-w-3xl overflow-x-auto rounded-xl shadow-lg">
						<table className="w-full border-separate border-spacing-0 bg-[#1a2233] text-white">
							<thead>
								<tr className="bg-gradient-to-r from-cyan-700 to-blue-500 text-cyan-100">
									<th className="py-3 px-4 border-b border-cyan-800 text-left">Rank</th>
									<th className="py-3 px-6 border-b border-cyan-800 text-left">Athlete</th>
									<th className="py-3 px-4 border-b border-cyan-800 text-left">Country</th>
									<th className="py-3 px-4 border-b border-cyan-800 text-center">Score</th>
								</tr>
							</thead>
							<tbody>
								<tr className="even:bg-[#182030]">
									<td className="py-3 px-4 border-b border-[#22304a] text-center font-bold text-yellow-300">1</td>
									<td className="py-3 px-6 border-b border-[#22304a] font-semibold text-cyan-200">
										Somchai Somsri
									</td>
									<td className="py-3 px-4 border-b border-[#22304a] text-cyan-100">Thailand</td>
									<td className="py-3 px-4 border-b border-[#22304a] text-center text-2xl font-bold">9.5</td>
								</tr>
								<tr className="even:bg-[#182030]">
									<td className="py-3 px-4 border-b border-[#22304a] text-center font-bold text-gray-200">2</td>
									<td className="py-3 px-6 border-b border-[#22304a] font-semibold text-cyan-200">
										Aung Tin
									</td>
									<td className="py-3 px-4 border-b border-[#22304a] text-cyan-100">Myanmar</td>
									<td className="py-3 px-4 border-b border-[#22304a] text-center text-2xl font-bold">9.2</td>
								</tr>
								<tr className="even:bg-[#182030]">
									<td className="py-3 px-4 border-b border-[#22304a] text-center font-bold text-gray-400">3</td>
									<td className="py-3 px-6 border-b border-[#22304a] font-semibold text-cyan-200">
										Sombut XX
									</td>
									<td className="py-3 px-4 border-b border-[#22304a] text-cyan-100">Laos</td>
									<td className="py-3 px-4 border-b border-[#22304a] text-center text-2xl font-bold">8.8</td>
								</tr>
								<tr className="even:bg-[#182030]">
									<td className="py-3 px-4 border-b border-[#22304a] text-center">4</td>
									<td className="py-3 px-6 border-b border-[#22304a]">
										Test4
									</td>
									<td className="py-3 px-4 border-b border-[#22304a]">Vietnam</td>
									<td className="py-3 px-4 border-b border-[#22304a] text-center">8.2</td>
								</tr>
							</tbody>
						</table>
					</div>
				</section>
			</main>
		</div>
	);
}
