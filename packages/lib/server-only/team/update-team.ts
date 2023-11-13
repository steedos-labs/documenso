import { prisma } from '@documenso/prisma';

export type UpdateTeamOptions = {
  userId: number;
  teamId: number;
};

export const updateTeam = async ({ userId, teamId }: UpdateTeamOptions) => {
  // Todo: Teams - Is this even required?
  await prisma.team.findUniqueOrThrow({
    where: {
      id: teamId,
      ownerId: userId,
    },
  });

  const updatedTeam = await prisma.team.update({
    where: {
      id: teamId,
      ownerId: userId,
    },
    data: {
      // Todo: Teams
    },
  });

  return updatedTeam;
};
