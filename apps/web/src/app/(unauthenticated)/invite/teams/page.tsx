import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getRequiredServerComponentSession } from '@documenso/lib/next-auth/get-server-session';
import { getTeam } from '@documenso/lib/server-only/team/get-teams';
import { prisma } from '@documenso/prisma';
import { TeamMemberInviteStatus } from '@documenso/prisma/client';
import { Button } from '@documenso/ui/primitives/button';

type AcceptInvitationPageProps = {
  searchParams: {
    token?: string;
  };
};

export default async function AcceptInvitationPage({ searchParams }: AcceptInvitationPageProps) {
  const token = typeof searchParams.token === 'string' ? searchParams.token : null;
  if (!token) {
    redirect('/');
  }

  const session = await getRequiredServerComponentSession();

  const teamMemberInvite = await prisma.teamMemberInvite.findUnique({
    where: {
      token,
    },
  });

  if (!teamMemberInvite) {
    return (
      <div>
        <h1 className="text-4xl font-semibold">Invalid token</h1>

        <p className="text-muted-foreground mb-4 mt-2 text-sm">
          This token is invalid or has expired. Please contact your team for a new invitation.
        </p>

        <Button asChild>
          <Link href="/">Return</Link>
        </Button>
      </div>
    );
  }

  const team = await getTeam({ teamId: teamMemberInvite.teamId });

  const user = await prisma.user.findFirst({
    where: {
      email: {
        equals: teamMemberInvite.email,
        mode: 'insensitive',
      },
    },
  });

  // Directly convert the team member invite to a team member if they already have an account.
  if (user) {
    await prisma.$transaction([
      prisma.teamMember.create({
        data: {
          teamId: teamMemberInvite.teamId,
          userId: user.id,
          role: teamMemberInvite.role,
        },
      }),
      prisma.teamMemberInvite.delete({
        where: {
          id: teamMemberInvite.id,
        },
      }),
    ]);
  }

  // Set the team invite status to accepted, which is checked during user creation
  // to determine if we should add the user to the team at that time.
  if (!user) {
    await prisma.teamMemberInvite.update({
      where: {
        id: teamMemberInvite.id,
      },
      data: {
        status: TeamMemberInviteStatus.ACCEPTED,
      },
    });
  }

  const isSessionUserTheInvitedUser = user && user.id === session.user.id;

  return (
    <div>
      <h1 className="text-4xl font-semibold">Invitation accepted!</h1>

      <p className="text-muted-foreground mb-4 mt-2 text-sm">
        You have accepted an invitation from <strong>{team.name}</strong> to join their team on
        Documenso.
      </p>

      {!user && (
        <Button asChild>
          <Link href={`/signup?email=${encodeURIComponent(teamMemberInvite.email)}`}>
            Continue to create an account
          </Link>
        </Button>
      )}

      {user && !isSessionUserTheInvitedUser && (
        <Button asChild>
          <Link href={`/signin?email=${encodeURIComponent(teamMemberInvite.email)}`}>
            Continue to login
          </Link>
        </Button>
      )}

      {isSessionUserTheInvitedUser && (
        <Button asChild>
          <Link href="/">Continue</Link>
        </Button>
      )}
    </div>
  );
}
