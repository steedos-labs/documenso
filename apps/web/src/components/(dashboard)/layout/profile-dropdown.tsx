'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { CheckCircle2, ChevronsUpDown, Plus, Settings2 } from 'lucide-react';
import { signOut } from 'next-auth/react';

import { TEAM_MEMBER_ROLE_MAP } from '@documenso/lib/constants/teams';
import { isAdmin } from '@documenso/lib/next-auth/guards/is-admin';
import { recipientInitials } from '@documenso/lib/utils/recipient-formatter';
import { User } from '@documenso/prisma/client';
import { trpc } from '@documenso/trpc/react';
import { cn } from '@documenso/ui/lib/utils';
import { AvatarWithText } from '@documenso/ui/primitives/avatar';
import { Button } from '@documenso/ui/primitives/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@documenso/ui/primitives/dropdown-menu';

export type ProfileDropdownProps = {
  user: User;
};

export const ProfileDropdown = ({ user }: ProfileDropdownProps) => {
  const pathname = usePathname();

  const isUserAdmin = isAdmin(user);

  const avatarFallback = user.name
    ? recipientInitials(user.name)
    : user.email.slice(0, 1).toUpperCase();

  const { data: teamsQueryResult } = trpc.team.getTeams.useQuery();

  const teams = teamsQueryResult && teamsQueryResult.length > 0 ? teamsQueryResult : null;

  const selectedTeam = teams?.find((team) => pathname?.startsWith(`/t/${team.url}`));

  const formatSecondaryAvatarTeamText = (team?: typeof selectedTeam) => {
    if (!team) {
      return 'Personal Account';
    }

    if (team.ownerUserId === user.id) {
      return 'Owner';
    }

    return TEAM_MEMBER_ROLE_MAP[team.currentTeamMember.role];
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative flex h-12 flex-row items-center px-2 py-2 focus-visible:ring-0"
        >
          <AvatarWithText
            avatarFallback={avatarFallback}
            primaryText={selectedTeam ? selectedTeam.name : user.name}
            secondaryText={formatSecondaryAvatarTeamText(selectedTeam)}
            rightSideComponent={
              <ChevronsUpDown className="text-muted-foreground ml-auto h-4 w-4" />
            }
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className={cn('w-full', teams ? 'min-w-[20rem]' : 'min-w-[12rem]')}
        align="end"
        forceMount
      >
        {teams ? (
          <>
            <DropdownMenuLabel>Personal</DropdownMenuLabel>

            <DropdownMenuItem asChild>
              <Link href="/">
                <AvatarWithText
                  avatarFallback={avatarFallback}
                  primaryText={selectedTeam ? selectedTeam.name : user.name}
                  secondaryText={formatSecondaryAvatarTeamText()}
                  rightSideComponent={
                    !pathname?.startsWith(`/t/`) && (
                      <CheckCircle2 className="ml-auto fill-black text-white dark:fill-white dark:text-black" />
                    )
                  }
                />
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="mt-2" />

            <DropdownMenuLabel>
              <div className="flex flex-row items-center justify-between">
                <p>Teams</p>

                <div className="flex flex-row space-x-2">
                  <DropdownMenuItem asChild>
                    <Button
                      title="Manage teams"
                      variant="ghost"
                      className="text-muted-foreground flex h-5 w-5 items-center justify-center p-0"
                      asChild
                    >
                      <Link href="/settings/teams">
                        <Settings2 className="h-4 w-4" />
                      </Link>
                    </Button>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Button
                      title="Manage teams"
                      variant="ghost"
                      className="text-muted-foreground flex h-5 w-5 items-center justify-center p-0"
                      asChild
                    >
                      <Link href="/settings/teams?action=add-team">
                        <Plus className="h-4 w-4" />
                      </Link>
                    </Button>
                  </DropdownMenuItem>
                </div>
              </div>
            </DropdownMenuLabel>

            {teams.map((team) => (
              <DropdownMenuItem asChild key={team.id}>
                <Link href={`/t/${team.url}`}>
                  <AvatarWithText
                    avatarFallback={team.name.slice(0, 1).toUpperCase()}
                    primaryText={team.name}
                    secondaryText={formatSecondaryAvatarTeamText(team)}
                    rightSideComponent={
                      pathname?.startsWith(`/t/${team.url}`) && (
                        <CheckCircle2 className="ml-auto fill-black text-white dark:fill-white dark:text-black" />
                      )
                    }
                  />
                </Link>
              </DropdownMenuItem>
            ))}
          </>
        ) : (
          <DropdownMenuItem className="text-muted-foreground px-4 py-2" asChild>
            <Link
              href="/settings/teams?action=add-team"
              className="flex items-center justify-between"
            >
              Create team
              <Plus className="ml-2 h-4 w-4" />
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {isUserAdmin && (
          <DropdownMenuItem className="text-muted-foreground px-4 py-2" asChild>
            <Link href="/admin">Admin panel</Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem className="text-muted-foreground px-4 py-2" asChild>
          <Link href="/settings/profile">User settings</Link>
        </DropdownMenuItem>

        {teams && (
          <DropdownMenuItem className="text-muted-foreground px-4 py-2" asChild>
            <Link href="/settings/teams">Teams settings</Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          className="text-destructive/90 hover:!text-destructive px-4 py-2"
          onSelect={async () =>
            signOut({
              callbackUrl: '/',
            })
          }
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
