import TournamentDetailClient from "./Test";

type PageProps = {
  params: Promise<{ competitionID: string }>;
};

export default async function AdminCompetitionDetailPage({ params }: PageProps) {
  const { competitionID } = await params;

  let competitionName = 'Competition Detail';
  try {
    const apiBase = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${apiBase}/api/competitions?competitionId=${competitionID}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      competitionName = data?.competition_name || data?.competitionName || competitionName;
    }
  } catch (error) {
    console.error('Failed to load competition name', error);
  }
  
  return (
    <div className="p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{competitionName}</h1>
        <a
          href="/competitions/admin"
          className="inline-block px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
        >
          Back
        </a>
      </div>
      <TournamentDetailClient competitionId={competitionID} />
    </div>
  );
}