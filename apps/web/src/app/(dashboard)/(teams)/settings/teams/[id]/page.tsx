import { getRequiredServerComponentSession } from '@documenso/lib/next-auth/get-server-session';
import { getTeamByUrl } from '@documenso/lib/server-only/team/get-teams';

import SettingsHeader from '~/components/(dashboard)/settings/layout/header';
import DeleteTeamDialog from '~/components/(teams)/dialogs/delete-team-dialog';
import TransferTeamDialog from '~/components/(teams)/dialogs/transfer-team-dialog';
import UpdateTeamForm from '~/components/(teams)/forms/update-team-form';

export type TeamsSettingsPageProps = {
  params: {
    id: string;
  };
};

export default async function TeamsSettingsPage({ params }: TeamsSettingsPageProps) {
  const { id: teamUrl } = params;

  const session = await getRequiredServerComponentSession();

  // Todo: Teams - Handle 404.
  const team = await getTeamByUrl({ userId: session.user.id, teamUrl });

  return (
    <div>
      <SettingsHeader title="Team Profile" subtitle="Here you can edit your team's details." />

      {/* Todo: Teams avatar */}
      {/* <div className="mb-4 flex flex-row items-center space-x-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border">D</div>

        <Button variant="outline">
          Change team icon
        </Button>

        <Button variant="ghost">Remove</Button>
      </div> */}

      <UpdateTeamForm teamId={team.id} teamName={team.name} teamUrl={team.url} />

      {/* <hr className="my-6" /> */}

      {/* Todo: Teams section. */}
      {/* <div>
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

        <div className="text-muted-foreground mt-4 flex h-32 w-full items-center justify-center rounded-lg bg-gray-50/50 text-sm">
          Set a custom email address to send all emails from this team.
        </div>
      </div>

      <hr className="my-6" /> */}

      {team.ownerUserId === session.user.id && (
        <section className="mt-6 space-y-6">
          <div className="flex flex-row items-center justify-between rounded-lg bg-gray-50/70 p-6">
            <div>
              <h3 className="text font-medium">Transfer team</h3>

              <p className="text-muted-foreground text-sm">
                Transfer the ownership of the team to another team member.
              </p>
            </div>

            <TransferTeamDialog
              ownerUserId={team.ownerUserId}
              teamId={team.id}
              teamName={team.name}
            />
          </div>

          <div className="flex flex-row items-center justify-between rounded-lg bg-gray-50/70 p-6">
            <div>
              <h3 className="text font-medium">Delete team</h3>

              <p className="text-muted-foreground text-sm">
                This team, and any associated data excluding billing invoices will be permanently
                deleted.
              </p>
            </div>

            <DeleteTeamDialog teamId={team.id} teamName={team.name} />
          </div>
        </section>
      )}
    </div>
  );
}
