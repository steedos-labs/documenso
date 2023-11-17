'use client';

import { useEffect, useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { History, MoreHorizontal, Trash2 } from 'lucide-react';
import { z } from 'zod';

import { useDebouncedValue } from '@documenso/lib/client-only/hooks/use-debounced-value';
import { useUpdateSearchParams } from '@documenso/lib/client-only/hooks/use-update-search-params';
import { TEAM_MEMBER_ROLE_MAP } from '@documenso/lib/constants/teams';
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
import { InputWithLoader } from '@documenso/ui/primitives/input';
import { Skeleton } from '@documenso/ui/primitives/skeleton';
import { TableCell } from '@documenso/ui/primitives/table';
import { useToast } from '@documenso/ui/primitives/use-toast';

import { LocaleDate } from '~/components/formatter/locale-date';

import TeamMemberTableTabs from './team-member-table-tabs';

// Todo: Teams - Rename and extract, reuse for other tables.
export const ZTeamsDataTableSearchParamsSchema = z.object({
  query: z
    .string()
    .optional()
    .catch(() => undefined),
  page: z.coerce
    .number()
    .min(1)
    .optional()
    .catch(() => undefined),
  perPage: z.coerce
    .number()
    .min(1)
    .optional()
    .catch(() => undefined),
});

export type TeamMemberInvitesDataTableProps = {
  teamId: number;
};

export default function TeamMemberInvitesDataTable({ teamId }: TeamMemberInvitesDataTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams()!;
  const pathname = usePathname();
  const updateSearchParams = useUpdateSearchParams();

  const { toast } = useToast();

  const parsedSearchParams = ZTeamsDataTableSearchParamsSchema.parse(
    Object.fromEntries(searchParams ?? []),
  );

  const [searchQuery, setSearchQuery] = useState(() => parsedSearchParams.query ?? '');

  const debouncedSearchQuery = useDebouncedValue(searchQuery, 500);

  const { data, isLoading, isInitialLoading, isLoadingError, isFetching, isPreviousData } =
    trpc.team.findTeamMemberInvites.useQuery(
      {
        teamId,
        term: parsedSearchParams.query,
        page: parsedSearchParams.page,
        perPage: parsedSearchParams.perPage,
      },
      {
        keepPreviousData: true,
      },
    );

  const { mutateAsync: resendTeamMemberInvitation } =
    trpc.team.resendTeamMemberInvitation.useMutation({
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Invitation has been resent',
        });
      },
      onError: () => {
        toast({
          title: 'Something went wrong',
          description: 'Unable to resend invitation. Please try again.',
          variant: 'destructive',
        });
      },
    });

  const { mutateAsync: deleteTeamMemberInvitations } =
    trpc.team.deleteTeamMemberInvitations.useMutation({
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Invitation has been deleted',
        });
      },
      onError: () => {
        toast({
          title: 'Something went wrong',
          description: 'Unable to delete invitation. Please try again.',
          variant: 'destructive',
        });
      },
    });

  const onPaginationChange = (page: number, perPage: number) => {
    updateSearchParams({
      page,
      perPage,
    });
  };

  /**
   * Handle debouncing the search query.
   */
  useEffect(() => {
    if (!pathname) {
      return;
    }

    const params = new URLSearchParams(searchParams?.toString());

    params.set('query', debouncedSearchQuery);

    if (debouncedSearchQuery === '') {
      params.delete('query');
    }

    router.push(`${pathname}?${params.toString()}`);
  }, [debouncedSearchQuery, pathname, router, searchParams]);

  const results = data ?? {
    data: [],
    perPage: 10,
    currentPage: 1,
    totalPages: 1,
  };

  return (
    <div>
      <div className="mt-4 flex flex-row items-center justify-between space-x-4">
        <InputWithLoader
          defaultValue={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search invite emails"
          loading={isFetching && !isInitialLoading && isPreviousData}
        />

        <TeamMemberTableTabs />
      </div>

      <div className="relative mt-4">
        <DataTable
          columns={[
            {
              header: 'Team Member',
              cell: ({ row }) => {
                return (
                  <div className="flex max-w-xs items-center gap-2">
                    <Avatar className="dark:border-border h-12 w-12 border-2 border-solid border-white">
                      <AvatarFallback className="text-xs text-gray-400">
                        {row.original.email.slice(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col text-sm">
                      <span className="text-foreground/80 font-semibold">{row.original.email}</span>
                      {/* <span className="text-muted-foreground">{row.original.user.email}</span> */}
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
              header: 'Invited At',
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

                    <DropdownMenuItem
                      onClick={async () =>
                        resendTeamMemberInvitation({
                          teamId,
                          invitationId: row.original.id,
                        })
                      }
                    >
                      <History className="mr-2 h-4 w-4" />
                      Resend invitation
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={async () =>
                        deleteTeamMemberInvitations({
                          teamId,
                          invitationIds: [row.original.id],
                        })
                      }
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove invitation
                    </DropdownMenuItem>
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
          error={{
            enable: isLoadingError,
          }}
          skeleton={{
            enable: isLoading && isInitialLoading,
            rows: 3,
            component: (
              <>
                <TableCell className="w-1/2 py-4 pr-4">
                  <div className="flex w-full flex-row items-center">
                    <Skeleton className="h-12 w-12 flex-shrink-0 rounded-full" />
                    <Skeleton className="ml-2 h-4 w-1/3 max-w-[10rem]" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-6 rounded-full" />
                </TableCell>
              </>
            ),
          }}
        >
          {(table) => <DataTablePagination additionalInformation="VisibleCount" table={table} />}
        </DataTable>
      </div>
    </div>
  );
}
