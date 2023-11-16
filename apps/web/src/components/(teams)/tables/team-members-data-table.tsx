'use client';

import { useEffect, useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Edit, MoreHorizontal } from 'lucide-react';
import { z } from 'zod';

import { useDebouncedValue } from '@documenso/lib/client-only/hooks/use-debounced-value';
import { useUpdateSearchParams } from '@documenso/lib/client-only/hooks/use-update-search-params';
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
import { InputWithLoader } from '@documenso/ui/primitives/input';
import { Skeleton } from '@documenso/ui/primitives/skeleton';
import { TableCell } from '@documenso/ui/primitives/table';

import { LocaleDate } from '~/components/formatter/locale-date';

import TeamMemberTableTabs from './team-member-table-tabs';

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

export type TeamMembersDataTableProps = {
  teamId: number;
};

export default function TeamMembersDataTable({ teamId }: TeamMembersDataTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams()!;
  const pathname = usePathname();
  const updateSearchParams = useUpdateSearchParams();

  const parsedSearchParams = ZTeamsDataTableSearchParamsSchema.parse(
    Object.fromEntries(searchParams ?? []),
  );

  const [searchQuery, setSearchQuery] = useState(() => parsedSearchParams.query ?? '');

  const debouncedSearchQuery = useDebouncedValue(searchQuery, 500);

  const { data, isLoading, isInitialLoading, isLoadingError, isFetching, isPreviousData } =
    trpc.team.findTeamMembers.useQuery(
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
          placeholder="Search team members"
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

                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>

                    {/* Todo: Teams. */}
                    {/* <DeleteTeamMemberDialog
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
                    /> */}
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

                    <div className="ml-2 flex flex-grow flex-col">
                      <Skeleton className="h-4 w-1/3 max-w-[8rem]" />
                      <Skeleton className="mt-1 h-4 w-1/2 max-w-[12rem]" />
                    </div>
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
