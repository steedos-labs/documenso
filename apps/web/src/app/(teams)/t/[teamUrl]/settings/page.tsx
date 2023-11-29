import { getRequiredServerComponentSession } from '@documenso/lib/next-auth/get-server-component-session';
import { getTeamByUrl } from '@documenso/lib/server-only/team/get-teams';
import { Badge } from '@documenso/ui/primitives/badge';

import SettingsHeader from '~/components/(dashboard)/settings/layout/header';
import AddTeamEmailDialog from '~/components/(teams)/dialogs/add-team-email-dialog';
import DeleteTeamDialog from '~/components/(teams)/dialogs/delete-team-dialog';
import TransferTeamDialog from '~/components/(teams)/dialogs/transfer-team-dialog';
import UpdateTeamForm from '~/components/(teams)/forms/update-team-form';

import TeamEmailDropdown from './team-email-dropdown';

export type TeamsSettingsPageProps = {
  params: {
    teamUrl: string;
  };
};

export default async function TeamsSettingsPage({ params }: TeamsSettingsPageProps) {
  const { teamUrl } = params;

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

      <hr className="my-6" />

      <section className="space-y-6">
        <div className="flex flex-row items-center justify-between rounded-lg bg-gray-50/70 p-6">
          <div>
            <h3 className="font-medium">
              Team email
              {team.email && (
                <span className="text-muted-foreground">
                  {' '}
                  - {team.email.name} ({team.email.email})
                </span>
              )}
            </h3>

            <ul className="text-muted-foreground mt-0.5 list-inside list-disc text-sm">
              <li>Display this name and email when sending documents</li>
              <li>View documents sent to this email</li>
            </ul>
          </div>

          <div className="flex flex-row items-center">
            {/* Todo: Teams - Create variants for proper badge design. */}
            {/* Todo: Teams - Add animation. */}

            {team.email ? (
              <Badge>Active</Badge>
            ) : team.emailVerification && team.emailVerification.expiresAt < new Date() ? (
              <Badge>Expired</Badge>
            ) : (
              team.emailVerification && <Badge>Awaiting email confirmation</Badge>
            )}

            {!team.email && !team.emailVerification ? (
              <AddTeamEmailDialog teamId={team.id} />
            ) : (
              <TeamEmailDropdown team={team} />
            )}
          </div>
        </div>

        {team.ownerUserId === session.user.id && (
          <>
            <div className="flex flex-row items-center justify-between rounded-lg bg-gray-50/70 p-6">
              <div>
                <h3 className="font-medium">Transfer team</h3>

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
                <h3 className="font-medium">Delete team</h3>

                <p className="text-muted-foreground text-sm">
                  This team, and any associated data excluding billing invoices will be permanently
                  deleted.
                </p>
              </div>

              <DeleteTeamDialog teamId={team.id} teamName={team.name} />
            </div>
          </>
        )}
      </section>
    </div>
  );
}
