import { prisma } from '@documenso/prisma';

export type DeleteTeamOptions = {
  userId: number;
  teamId: number;
};

export const deleteTeam = async ({ userId, teamId }: DeleteTeamOptions) => {
  await prisma.team.delete({
    where: {
      id: teamId,
      ownerUserId: userId,
    },
  });
};
