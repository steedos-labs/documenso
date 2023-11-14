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
      ownerUserId: userId,
    },
  });

  const updatedTeam = await prisma.team.update({
    where: {
      id: teamId,
      ownerUserId: userId,
    },
    data: {
      // Todo: Teams
    },
  });

  return updatedTeam;
};
