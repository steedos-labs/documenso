import { prisma } from '@documenso/prisma';
import { Prisma } from '@documenso/prisma/client';

export type GetTeamsOptions = {
  userId: number;
};

export const getTeams = async ({ userId }: GetTeamsOptions) => {
  const teams = await prisma.team.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
    include: {
      members: {
        where: {
          userId,
        },
      },
    },
    // Todo: Teams - Only return the fields we need.
  });

  return teams.map((team) => ({
    ...team,
    currentUserTeamMember: team.members[0],
    members: undefined,
  }));
};

export type GetTeamByIdOptions = {
  userId?: number;
  teamId: number;
};

/**
 * Get a team given a teamId.
 *
 * Provide an optional userId to check that the user is a member of the team.
 */
export const getTeamById = async ({ userId, teamId }: GetTeamByIdOptions) => {
  const whereFilter: Prisma.TeamWhereUniqueInput = {
    id: teamId,
  };

  if (userId !== undefined) {
    whereFilter['members'] = {
      some: {
        userId,
      },
    };
  }

  // Todo: Teams - Only return the fields we need.
  return await prisma.team.findUniqueOrThrow({
    where: whereFilter,
  });
};

export type GetTeamByUrlOptions = {
  userId?: number;
  teamUrl: string;
};

/**
 * Get a team given a teamId.
 *
 * Provide an optional userId to check that the user is a member of the team.
 */
export const getTeamByUrl = async ({ userId, teamUrl }: GetTeamByUrlOptions) => {
  const whereFilter: Prisma.TeamWhereUniqueInput = {
    url: teamUrl,
  };

  if (userId !== undefined) {
    whereFilter['members'] = {
      some: {
        userId,
      },
    };
  }

  // Todo: Teams - Only return the fields we need.
  return await prisma.team.findUniqueOrThrow({
    where: whereFilter,
  });
};
