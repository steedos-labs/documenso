import { prisma } from '@documenso/prisma';
import { Prisma } from '@documenso/prisma/client';

export interface GetTeamsOptions {
  userId: number;
}

export const getTeams = async ({ userId }: GetTeamsOptions) => {
  return await prisma.team.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
    // Todo: Teams - Only return the fields we need.
  });
};

export interface GetTeamOptions {
  userId?: number;
  teamId: number;
}

/**
 * Get a team given a teamId.
 *
 * Provide an optional userId to check that the user is a member of the team.
 */
export const getTeam = async ({ userId, teamId }: GetTeamOptions) => {
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

export interface GetTeamOptions {
  userId?: number;
  teamId: number;
}

/**
 * Get a team the members associated with it.
 *
 * Provide an optional userId to check that the user is a member of the team.
 */
export const getTeamMembers = async ({ userId, teamId }: GetTeamOptions) => {
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

  // Todo: Teams - Limit to admin only
  // Todo: Teams - Limit member information returned

  // Todo: Teams - Only return the fields we need.
  return await prisma.team.findUniqueOrThrow({
    where: whereFilter,
    include: {
      members: true,
    },
  });
};
