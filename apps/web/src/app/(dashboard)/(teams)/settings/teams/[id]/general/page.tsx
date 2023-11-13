// import { getRequiredServerComponentSession } from '@documenso/lib/next-auth/get-server-session';
import SettingsHeader from '~/components/(dashboard)/settings/layout/header';
import DeleteTeamDialog from '~/components/(teams)/dialogs/delete-team-dialog';

// import { ProfileForm } from '~/components/forms/profile';

export default function TeamsSettingsGeneralPage() {
  // Todo: Teams.
  const team = {
    id: 1,
    url: 'url',
    name: 'team-name',
  } as const;

  return (
    <div>
      <SettingsHeader title="Team Profile" subtitle="Here you can edit your team's details." />

      <DeleteTeamDialog teamId={team.id} teamName={team.name} />
    </div>
  );
}
