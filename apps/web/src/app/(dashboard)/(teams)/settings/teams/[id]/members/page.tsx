import { getRequiredServerComponentSession } from '@documenso/lib/next-auth/get-server-session';
import { getTeamByUrl } from '@documenso/lib/server-only/team/get-teams';

import SettingsHeader from '~/components/(dashboard)/settings/layout/header';
import InviteTeamMembersDialog from '~/components/(teams)/dialogs/invite-team-member-dialog';
import TeamsMemberPageDataTable from '~/components/(teams)/tables/teams-member-page-data-table';

export type TeamsSettingsMembersPageProps = {
  params: {
    id: string;
  };
};

export default async function TeamsSettingsMembersPage({ params }: TeamsSettingsMembersPageProps) {
  const { id: teamUrl } = params;

  const session = await getRequiredServerComponentSession();

  // Todo: Teams - Handle 404.
  const team = await getTeamByUrl({ userId: session.user.id, teamUrl });

  return (
    <div>
      <SettingsHeader title="Members" subtitle="Manage the members or invite new members.">
        <InviteTeamMembersDialog teamId={team.id} />
      </SettingsHeader>

      <TeamsMemberPageDataTable
        teamId={team.id}
        teamName={team.name}
        teamOwnerUserId={team.ownerUserId}
      />
    </div>
  );
}
