import TournamentDetailClient from "./Test";

type PageProps = {
  params: Promise<{ competitionID: string }>;
};

export default async function AdminCompetitionDetailPage({ params }: PageProps) {
  const { competitionID } = await params;
  
  return (
    <div className="p-6 h-full">
      <div className="mb-4">
        <a
          href="/competitions/guest"
          className="inline-block px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
        >
          Back
        </a>
      </div>
      <h1 className="text-2xl font-bold mb-4">Competition Detail</h1>
      <TournamentDetailClient competitionId={competitionID} />
    </div>
  );
}