'use client';

import Link from 'next/link';

import { File } from 'lucide-react';

import { trpc } from '@documenso/trpc/react';
import { Button } from '@documenso/ui/primitives/button';
import { DataTable } from '@documenso/ui/primitives/data-table';
import { DataTablePagination } from '@documenso/ui/primitives/data-table-pagination';
import { Skeleton } from '@documenso/ui/primitives/skeleton';
import { TableCell } from '@documenso/ui/primitives/table';

// Todo: Teams.
export default function TeamBillingInvoicesDataTable() {
  const { data, isLoading, isInitialLoading, isLoadingError } = trpc.team.findTeams.useQuery(
    {},
    {
      keepPreviousData: true,
    },
  );

  const onPaginationChange = (_page: number, _perPage: number) => {
    // updateSearchParams({
    //   page,
    //   perPage,
    // });
  };

  const results = data ?? {
    data: [],
    perPage: 10,
    currentPage: 1,
    totalPages: 1,
  };

  return (
    <DataTable
      columns={[
        {
          header: 'Invoice',
          accessorKey: 'name',
          cell: () => (
            <div className="flex max-w-xs items-center gap-2">
              <File className="h-6 w-6" />

              <div className="flex flex-col text-sm">
                <span className="text-foreground/80 font-semibold">November 2023</span>
                <span className="text-muted-foreground">3 Seats</span>
              </div>
            </div>
          ),
        },
        {
          header: 'Status',
          accessorKey: 'createdAt',
          cell: () => 'Paid',
        },
        {
          header: 'Amount',
          accessorKey: 'createdAt',
          cell: () => '$20',
        },
        {
          id: 'actions',
          cell: () => (
            <div className="flex justify-end space-x-2">
              <Button variant="outline" asChild>
                <Link href={`/`}>View</Link>
              </Button>

              <Button variant="outline" asChild>
                <Link href={`/`}>Download</Link>
              </Button>
            </div>
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
            {/* Todo: Teams */}
            <TableCell className="w-1/3 py-4 pr-4">
              <div className="flex w-full flex-row items-center">
                <Skeleton className="h-12 w-12 flex-shrink-0 rounded-full" />

                <div className="ml-2 flex flex-grow flex-col">
                  <Skeleton className="h-4 w-1/2 max-w-[8rem]" />
                  <Skeleton className="mt-1 h-4 w-2/3 max-w-[12rem]" />
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
              <div className="flex flex-row justify-end space-x-2">
                <Skeleton className="h-10 w-20 rounded" />
                <Skeleton className="h-10 w-16 rounded" />
              </div>
            </TableCell>
          </>
        ),
      }}
    >
      {(table) => <DataTablePagination additionalInformation="VisibleCount" table={table} />}
    </DataTable>
  );
}
