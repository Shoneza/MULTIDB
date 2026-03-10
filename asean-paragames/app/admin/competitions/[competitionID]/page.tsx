import TournamentDetailClient from "./Test";

type PageProps = {
  params: Promise<{ competitionID: string }>;
};

export default async function AdminCompetitionDetailPage({ params }: PageProps) {
  const { competitionID } = await params;
  
  return (
    <div className="p-6 h-full">
      <h1 className="text-2xl font-bold mb-4">Competition Detail</h1>
      <TournamentDetailClient competitionId={competitionID} />
    </div>
  );
}