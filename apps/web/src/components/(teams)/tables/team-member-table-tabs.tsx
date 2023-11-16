'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import { Tabs, TabsList, TabsTrigger } from '@documenso/ui/primitives/tabs';

export default function TeamMemberTableTabs() {
  const searchParams = useSearchParams()!;
  const pathname = usePathname();

  const tab = searchParams.get('tab');

  const tabValue = tab === 'invites' ? 'Pending' : 'All';

  return (
    <Tabs value={tabValue} className="flex-shrink-0 overflow-x-auto">
      <TabsList>
        <TabsTrigger className="min-w-[60px]" value="All" asChild>
          <Link href={pathname ?? '/'}>All</Link>
        </TabsTrigger>

        <TabsTrigger className="min-w-[60px]" value="Pending" asChild>
          <Link href={`${pathname}?tab=invites`}>Pending</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
