'use client';

import Link from 'next/link';

import { ArrowRight, DoorOpen, Edit, Loader, MoreHorizontal } from 'lucide-react';
import { match } from 'ts-pattern';

import { WEBAPP_BASE_URL } from '@documenso/lib/constants/app';
import { TEAM_MEMBER_ROLE_MAP } from '@documenso/lib/constants/teams';
import { TeamMemberRole } from '@documenso/prisma/client';
// import { getRequiredServerComponentSession } from '@documenso/lib/next-auth/get-server-session';
import { trpc } from '@documenso/trpc/react';
import { Avatar, AvatarFallback } from '@documenso/ui/primitives/avatar';
import { Button } from '@documenso/ui/primitives/button';
import { DataTable } from '@documenso/ui/primitives/data-table';
import { DataTablePagination } from '@documenso/ui/primitives/data-table-pagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@documenso/ui/primitives/dropdown-menu';
import { Input } from '@documenso/ui/primitives/input';

import CreateTeamDialog from '~/components/(teams)/dialogs/create-team-dialog';
import { LocaleDate } from '~/components/formatter/locale-date';

// import { ProfileForm } from '~/components/forms/profile';

export default function TeamsSettingsPage() {
  // const { user } = await getRequiredServerComponentSession();

  const { data: teams, isLoading, isLoadingError } = trpc.team.getTeams.useQuery();

  const results = {
    data: teams,
    perPage: 5,
    currentPage: 1,
    totalPages: 1,
  };

  const onPaginationChange = () => {
    //
  };

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
          <div className="relative mt-4">
            <Input className="mb-4" placeholder="Search teams" />

            <DataTable
              columns={[
                {
                  header: 'Team',
                  accessorKey: 'name',
                  cell: ({ row }) => (
                    <Link href={`/t/${row.original.url}`} scroll={false}>
                      <div className="flex max-w-xs items-center gap-2">
                        <Avatar className="dark:border-border h-12 w-12 border-2 border-solid border-white">
                          <AvatarFallback className="text-xs text-gray-400">
                            {row.original.name.slice(0, 1).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col text-sm">
                          <span className="text-foreground/80 font-semibold">
                            {row.original.name}
                          </span>
                          <span className="text-muted-foreground">
                            {WEBAPP_BASE_URL}/t/{row.original.url}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ),
                },
                {
                  header: 'Role',
                  accessorKey: 'role',
                  cell: ({ row }) => TEAM_MEMBER_ROLE_MAP[row.original.currentUserTeamMember.role],
                },
                {
                  header: 'Member Since',
                  accessorKey: 'createdAt',
                  cell: ({ row }) => <LocaleDate date={row.original.createdAt} />,
                },
                {
                  header: 'Actions',
                  cell: ({ row }) => (
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreHorizontal className="text-muted-foreground h-5 w-5" />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent className="w-52" align="start" forceMount>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                        <DropdownMenuItem asChild>
                          <Link href={`/t/${row.original.url}`}>
                            <ArrowRight className="mr-2 h-4 w-4" />
                            View team
                          </Link>
                        </DropdownMenuItem>

                        {/* Todo: Teams - Extract to function `canManageTeam` */}
                        {[TeamMemberRole.ADMIN, TeamMemberRole.MANAGER].includes(
                          row.original.currentUserTeamMember.role,
                        ) && (
                          <DropdownMenuItem asChild>
                            <Link href={`/settings/teams/${row.original.url}/general`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Manage team
                            </Link>
                          </DropdownMenuItem>
                        )}

                        {[TeamMemberRole.MANAGER, TeamMemberRole.MEMBER].includes(
                          row.original.currentUserTeamMember.role,
                        ) && (
                          <DeleteTeamMemberDialog
                            teamId={team.id}
                            teamName={team.name}
                            teamMemberId={row.original.id}
                            teamMemberName={row.original.user.name ?? row.original.user.email}
                            trigger={
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <DoorOpen className="mr-2 h-4 w-4" />
                                Leave team
                              </DropdownMenuItem>
                            }
                          />
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ),
                },
              ]}
              data={results.data}
              perPage={results.perPage}
              currentPage={results.currentPage}
              totalPages={results.totalPages}
              onPaginationChange={onPaginationChange}
            >
              {(table) => (
                <DataTablePagination additionalInformation="VisibleCount" table={table} />
              )}
            </DataTable>

            {isLoading && (
              <div className="bg-background/50 absolute inset-0 flex items-center justify-center">
                <Loader className="text-muted-foreground h-8 w-8 animate-spin" />
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
