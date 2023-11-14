'use client';

// import { ProfileForm } from '~/components/forms/profile';
import Link from 'next/link';

import { Edit, History, Loader, MoreHorizontal, Trash2 } from 'lucide-react';

import { TEAM_MEMBER_ROLE_MAP } from '@documenso/lib/constants/teams';
import { recipientInitials } from '@documenso/lib/utils/recipient-formatter';
import { trpc } from '@documenso/trpc/react';
import { Avatar, AvatarFallback } from '@documenso/ui/primitives/avatar';
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
import { Tabs, TabsList, TabsTrigger } from '@documenso/ui/primitives/tabs';

import SettingsHeader from '~/components/(dashboard)/settings/layout/header';
import DeleteTeamMemberDialog from '~/components/(teams)/dialogs/delete-team-member-dialog';
import InviteTeamMembersDialog from '~/components/(teams)/dialogs/invite-team-member-dialog';
import { LocaleDate } from '~/components/formatter/locale-date';

export default function TeamsSettingsMembersPage() {
  const { data: team, isLoading: isTeamLoading } = trpc.team.getTeam.useQuery({
    teamId: 1,
  });

  const { data: teamMembers, isLoading: isTeamMembersLoading } = trpc.team.getTeamMembers.useQuery({
    teamId: 1,
  });

  if (!team) {
    return null; // Todo: Teams
  }

  const results = {
    data: teamMembers,
    perPage: 5,
    currentPage: 1,
    totalPages: 1,
  };

  const onPaginationChange = () => {
    //
  };

  const isPendingInvite = false; // Todo: Teams

  return (
    <div>
      <SettingsHeader title="Members" subtitle="Manage the members or invite new members.">
        <InviteTeamMembersDialog teamId={team.id} />
      </SettingsHeader>

      <div className="flex flex-row items-center justify-between space-x-4">
        <Input placeholder="Filter by name" />

        {/* Todo: Teams */}
        <Tabs defaultValue={'All'} className="flex-shrink-0 overflow-x-auto">
          <TabsList>
            {['All', 'Pending'].map((value) => (
              <TabsTrigger key={value} className="min-w-[60px]" value={value} asChild>
                {/* <Link href={getTabHref(value)} scroll={false}> */}
                <Link href={''} scroll={false}>
                  {/* <DocumentStatus status={value} /> */}
                  {value}

                  {/* Todo: Teams - Show how many pending */}

                  {/* {value !== ExtendedDocumentStatus.ALL && (
                      <span className="ml-1 hidden opacity-50 md:inline-block">
                        {Math.min(stats[value], 99)}
                        {stats[value] > 99 && '+'}
                      </span>
                    )} */}
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="relative mt-4">
        <DataTable
          columns={[
            {
              header: 'Team Member',
              cell: ({ row }) => {
                const avatarFallbackText = row.original.user.name
                  ? recipientInitials(row.original.user.name) // Todo: Teams - Extract to `nameInitials`
                  : row.original.user.email.slice(0, 1).toUpperCase();

                return (
                  <div className="flex max-w-xs items-center gap-2">
                    <Avatar className="dark:border-border h-12 w-12 border-2 border-solid border-white">
                      <AvatarFallback className="text-xs text-gray-400">
                        {avatarFallbackText}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col text-sm">
                      <span className="text-foreground/80 font-semibold">
                        {row.original.user.name}
                      </span>
                      <span className="text-muted-foreground">{row.original.user.email}</span>
                    </div>
                  </div>
                );
              },
            },
            {
              header: 'Role',
              accessorKey: 'role',
              cell: ({ row }) => TEAM_MEMBER_ROLE_MAP[row.original.role] ?? row.original.role,
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

                    {isPendingInvite ? (
                      <>
                        <DropdownMenuItem>
                          <History className="mr-2 h-4 w-4" />
                          Resend invitation
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove invitation
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>

                        <DeleteTeamMemberDialog
                          teamId={team.id}
                          teamName={team.name}
                          teamMemberId={row.original.id}
                          teamMemberName={row.original.user.name ?? row.original.user.email}
                          trigger={
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              disabled={team.ownerUserId === row.original.userId}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove
                            </DropdownMenuItem>
                          }
                        />
                      </>
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
          {(table) => <DataTablePagination additionalInformation="VisibleCount" table={table} />}
        </DataTable>

        {isTeamMembersLoading && (
          <div className="bg-background/50 absolute inset-0 flex items-center justify-center">
            <Loader className="text-muted-foreground h-8 w-8 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
