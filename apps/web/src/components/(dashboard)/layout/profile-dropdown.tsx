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
import { Avatar, AvatarFallback } from '@documenso/ui/primitives/avatar';
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

  const { data: teams } = trpc.team.getTeams.useQuery();

  const selectedTeam = teams?.find((team) => pathname?.startsWith(`/t/${team.url}`));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative flex h-12 flex-row items-center px-2 py-2">
          <Avatar className="dark:border-border h-10 w-10 border-2 border-solid border-white">
            <AvatarFallback>
              {selectedTeam ? selectedTeam.name.slice(0, 1) : avatarFallback}
            </AvatarFallback>
          </Avatar>

          <div className="ml-2 flex min-w-[10rem] flex-col text-left font-normal">
            <span className="text-foreground">{selectedTeam ? selectedTeam.name : user.name}</span>
            <span className="text-muted-foreground text-xs">
              {selectedTeam
                ? TEAM_MEMBER_ROLE_MAP[selectedTeam.currentTeamMember.role]
                : 'Personal Account'}
            </span>
          </div>

          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      {/* Todo: Teams - className="w-56" */}
      <DropdownMenuContent className="w-full min-w-[20rem]" align="end" forceMount>
        <DropdownMenuLabel>Personal</DropdownMenuLabel>

        <DropdownMenuItem asChild>
          <Link href="/">
            {/* Todo: Extract */}
            <div className="flex w-full max-w-xs items-center gap-2">
              <Avatar className="dark:border-border h-10 w-10 border-2 border-solid border-white">
                <AvatarFallback className="text-xs text-gray-400">{avatarFallback}</AvatarFallback>
              </Avatar>

              <div className="flex flex-col text-sm">
                <span className="text-foreground">{user.name ?? user.email}</span>
                <span className="text-muted-foreground text-xs">Personal account</span>
              </div>

              {!pathname?.startsWith(`/t/`) && (
                <CheckCircle2 className="ml-auto fill-black text-white dark:fill-white dark:text-black" />
              )}
            </div>
          </Link>
        </DropdownMenuItem>

        {teams && teams?.length > 0 && (
          <>
            <DropdownMenuSeparator className="mt-2" />

            <DropdownMenuLabel>
              <div className="flex flex-row items-center justify-between">
                <p>Teams</p>

                <div className="flex flex-row space-x-2">
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
                </div>
              </div>
            </DropdownMenuLabel>

            {teams.map((team) => (
              <DropdownMenuItem asChild key={team.id}>
                <Link href={`/t/${team.url}`}>
                  {/* Todo: Extract */}
                  <div className="flex w-full max-w-xs items-center gap-2">
                    <Avatar className="dark:border-border h-10 w-10 border-2 border-solid border-white">
                      <AvatarFallback className="text-xs text-gray-400">
                        {/* Todo: Teams */}
                        {team.name.slice(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col text-sm">
                      <span className="text-foreground">{team.name}</span>
                      <span className="text-muted-foreground text-xs">
                        {TEAM_MEMBER_ROLE_MAP[team.currentTeamMember.role]}
                      </span>
                    </div>

                    {pathname?.startsWith(`/t/${team.url}`) && (
                      <CheckCircle2 className="ml-auto fill-black text-white dark:fill-white dark:text-black" />
                    )}
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </>
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

        {/* Todo: Teams - Only display if the user is not on the free plan?  */}
        <DropdownMenuItem className="text-muted-foreground px-4 py-2" asChild>
          <Link href="/settings/teams">Teams settings</Link>
        </DropdownMenuItem>

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
