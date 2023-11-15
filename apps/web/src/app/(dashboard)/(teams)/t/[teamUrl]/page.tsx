export type TeamsDocumentPageProps = {
  params: {
    teamUrl: string;
  };
};

export default function TeamsDocumentPage({ params }: TeamsDocumentPageProps) {
  const { teamUrl } = params;

  return <div>todo {teamUrl}</div>;
}
