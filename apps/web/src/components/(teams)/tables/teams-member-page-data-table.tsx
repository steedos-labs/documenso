'use client';

import { useSearchParams } from 'next/navigation';

import TeamMemberInvitesDataTable from '~/components/(teams)/tables/team-member-invites-data-table';
import TeamMembersDataTable from '~/components/(teams)/tables/team-members-data-table';

export type TeamsMemberPageDataTableProps = {
  teamId: number;
};

export default function TeamsMemberPageDataTable({ teamId }: TeamsMemberPageDataTableProps) {
  const searchParams = useSearchParams();

  const view = searchParams?.get('tab') === 'invites' ? 'invites' : 'members';

  if (view === 'invites') {
    return <TeamMemberInvitesDataTable key="invites" teamId={teamId} />;
  }

  return <TeamMembersDataTable teamId={teamId} />;
}
