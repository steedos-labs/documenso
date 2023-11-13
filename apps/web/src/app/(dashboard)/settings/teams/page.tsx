'use client';

import Link from 'next/link';

import { Loader } from 'lucide-react';
import { match } from 'ts-pattern';

// import { getRequiredServerComponentSession } from '@documenso/lib/next-auth/get-server-session';
import { trpc } from '@documenso/trpc/react';
import { Button } from '@documenso/ui/primitives/button';

import CreateTeamDialog from '~/components/(teams)/dialogs/create-team-dialog';

// import { ProfileForm } from '~/components/forms/profile';

export default function TeamsSettingsPage() {
  // const { user } = await getRequiredServerComponentSession();

  const { data: teams, isLoading, isLoadingError } = trpc.team.getTeams.useQuery();

  return (
    <div>
      <div className="flex flex-row items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Teams</h3>

          <p className="text-muted-foreground mt-2 text-sm">
            Manage all teams you are currently associated with.
          </p>
        </div>

        <CreateTeamDialog />
      </div>

      <hr className="my-4" />

      {match({ teams, isLoading, isLoadingError })
        .when(
          ({ isLoading }) => isLoading,
          () => <Loader className="mr-2 animate-spin" />,
        )
        .when(
          ({ isLoadingError }) => isLoadingError,
          () => <p>Error</p>,
        )
        .when(
          ({ teams }) => !teams || teams.length === 0,
          () => <p>No teams</p>,
        )
        .otherwise(({ teams }) => (
          <ul>
            {/* Todo */}
            {teams?.map((team) => (
              <li key={team.id}>
                <Link href={`/settings/teams/${team.id}`}>{team.name}</Link>
              </li>
            ))}
          </ul>
        ))}
    </div>
  );
}
