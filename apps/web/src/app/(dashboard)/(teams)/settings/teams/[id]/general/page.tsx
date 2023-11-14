import { Plus } from 'lucide-react';

import { getRequiredServerComponentSession } from '@documenso/lib/next-auth/get-server-session';
import { getTeamByUrl } from '@documenso/lib/server-only/team/get-teams';
import { Button } from '@documenso/ui/primitives/button';

import SettingsHeader from '~/components/(dashboard)/settings/layout/header';
import DeleteTeamDialog from '~/components/(teams)/dialogs/delete-team-dialog';
import TransferTeamDialog from '~/components/(teams)/dialogs/transfer-team-dialog';
import UpdateTeamForm from '~/components/(teams)/forms/update-team-form';

export type TeamsSettingsGeneralPageProps = {
  params: {
    id: string;
  };
};

export default async function TeamsSettingsGeneralPage({ params }: TeamsSettingsGeneralPageProps) {
  const { id: teamUrl } = params;

  const session = await getRequiredServerComponentSession();

  const team = await getTeamByUrl({ userId: session.user.id, teamUrl });

  return (
    <div>
      <SettingsHeader title="Team Profile" subtitle="Here you can edit your team's details." />

      <div className="mb-4 flex flex-row items-center space-x-4">
        {/* Team icon */}
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border">D</div>

        {/* Todo: Teams - Dark/Light mode, new variant? */}
        <Button variant="outline" className="bg-black/50">
          Change team icon
        </Button>

        <Button variant="ghost">Remove</Button>
      </div>

      <UpdateTeamForm />

      <hr className="my-6" />

      <div>
        <div className="flex flex-row items-center justify-between">
          <div>
            <h3 className="text font-medium">Email addresses</h3>

            <p className="text-muted-foreground text-sm">
              Manage commonly used email addresses for this team.
            </p>
          </div>

          <Button variant="outline">
            <Plus className="mr-2 h-5 w-5" />
            Add email
          </Button>
        </div>

        <div className="text-muted-foreground mt-4 flex h-60 w-full items-center justify-center rounded-lg bg-gray-50/50 text-sm">
          No emails configured
        </div>
      </div>

      <hr className="my-6" />

      <div className="flex justify-end space-x-4 rounded-lg bg-gray-50/50 p-4">
        {team.ownerId === session.user.id && (
          <TransferTeamDialog teamOwnerId={team.ownerId} teamId={team.id} teamName={team.name} />
        )}

        <DeleteTeamDialog teamId={team.id} teamName={team.name} />
      </div>
    </div>
  );
}
