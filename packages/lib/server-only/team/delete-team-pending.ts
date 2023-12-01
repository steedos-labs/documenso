import { prisma } from '@documenso/prisma';

export type DeleteTeamPendingOptions = {
  userId: number;
  teamPendingId: number;
};

export const deleteTeamPending = async ({ userId, teamPendingId }: DeleteTeamPendingOptions) => {
  await prisma.teamPending.delete({
    where: {
      id: teamPendingId,
      ownerUserId: userId,
    },
  });
};
