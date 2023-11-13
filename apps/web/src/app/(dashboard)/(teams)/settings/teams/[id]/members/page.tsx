'use client';

// import { ProfileForm } from '~/components/forms/profile';
import { trpc } from '@documenso/trpc/react';
import { Button } from '@documenso/ui/primitives/button';

import SettingsHeader from '~/components/(dashboard)/settings/layout/header';
import InviteTeamMembersDialog from '~/components/(teams)/dialogs/invite-team-member-dialog';

export default function TeamsSettingsMembersPage() {
  const { data: team, isLoading: isTeamLoading } = trpc.team.getTeam.useQuery({
    teamId: 1,
  });

  if (!team) {
    return null; // Todo: Teams
  }

  return (
    <div>
      <SettingsHeader title="Members" subtitle="Manage the members or invite new members.">
        <InviteTeamMembersDialog teamId={team.id} />
      </SettingsHeader>

      <div className="flex flex-row items-center justify-between">
        <p>search input</p>

        <p>toggle between</p>
      </div>

      <p>Table/List of team members</p>

      {/* {team && team.map((team) => <p></p>)} */}
    </div>
  );
}
