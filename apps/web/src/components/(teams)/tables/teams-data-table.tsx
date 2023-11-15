'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { ArrowRight, DoorOpen, Edit, Loader, MoreHorizontal } from 'lucide-react';
import { z } from 'zod';

import { useDebouncedValue } from '@documenso/lib/client-only/hooks/use-debounced-value';
import { useUpdateSearchParams } from '@documenso/lib/client-only/hooks/use-update-search-params';
import { WEBAPP_BASE_URL } from '@documenso/lib/constants/app';
import { TEAM_MEMBER_ROLE_MAP, canExecuteTeamAction } from '@documenso/lib/constants/teams';
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
import { Skeleton } from '@documenso/ui/primitives/skeleton';
import { TableCell } from '@documenso/ui/primitives/table';

import { LocaleDate } from '~/components/formatter/locale-date';

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

export default function TeamsDataTable() {
  const router = useRouter();
  const searchParams = useSearchParams()!;
  const pathname = usePathname();
  const updateSearchParams = useUpdateSearchParams();

  const parsedSearchParams = ZTeamsDataTableSearchParamsSchema.parse(
    Object.fromEntries(searchParams ?? []),
  );

  const [searchQuery, setSearchQuery] = useState(() => parsedSearchParams.query ?? '');

  const debouncedSearchQuery = useDebouncedValue(searchQuery, 500);

  const { data, isLoading, isInitialLoading, isLoadingError, isFetching } =
    trpc.team.findTeams.useQuery(
      {
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
      <div className="relative mt-4">
        <Input
          defaultValue={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search teams"
          className="pr-8"
        />

        {isFetching && !isInitialLoading && (
          <div className="absolute bottom-0 right-0 top-0 flex h-full items-center justify-center">
            <Loader className="text-muted-foreground mr-2 h-5 w-5 animate-spin" />
          </div>
        )}
      </div>

      <div className="relative mt-4">
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
                      <span className="text-foreground/80 font-semibold">{row.original.name}</span>
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
              cell: ({ row }) => TEAM_MEMBER_ROLE_MAP[row.original.currentTeamMember.role],
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
                        View
                      </Link>
                    </DropdownMenuItem>

                    {canExecuteTeamAction('MANAGE_TEAM', row.original.currentTeamMember.role) && (
                      <DropdownMenuItem asChild>
                        <Link href={`/settings/teams/${row.original.url}/general`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Manage
                        </Link>
                      </DropdownMenuItem>
                    )}

                    {row.original.ownerUserId !== row.original.currentTeamMember.userId && (
                      // Todo: Teams.
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <DoorOpen className="mr-2 h-4 w-4" />
                        Leave
                      </DropdownMenuItem>

                      // <DeleteTeamMemberDialog
                      //   teamId={team.id}
                      //   teamName={team.name}
                      //   teamMemberId={row.original.id}
                      //   teamMemberName={row.original.user.name ?? row.original.user.email}
                      //   trigger={
                      //     <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      //       <DoorOpen className="mr-2 h-4 w-4" />
                      //       Leave
                      //     </DropdownMenuItem>
                      //   }
                      // />
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
