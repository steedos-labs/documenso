import { prisma } from '@documenso/prisma';
import { TeamMemberRole } from '@documenso/prisma/client';

export type TransferTeamOwnershipOptions = {
  token: string;
};

export const transferTeamOwnership = async ({ token }: TransferTeamOwnershipOptions) => {
  await prisma.$transaction(async (tx) => {
    const teamTransferVerification = await tx.teamTransferVerification.findFirstOrThrow({
      where: {
        token,
      },
      include: {
        team: true,
      },
    });

    const { team, userId: newOwnerUserId } = teamTransferVerification;

    await tx.teamTransferVerification.deleteMany({
      where: {
        teamId: team.id,
      },
    });

    // Todo: Teams - Handle billing.

    await tx.team.update({
      where: {
        id: team.id,
        members: {
          some: {
            userId: newOwnerUserId,
          },
        },
      },
      data: {
        ownerUserId: newOwnerUserId,
        members: {
          update: {
            where: {
              userId_teamId: {
                teamId: team.id,
                userId: newOwnerUserId,
              },
            },
            data: {
              role: TeamMemberRole.ADMIN,
            },
          },
        },
      },
    });
  });
};
