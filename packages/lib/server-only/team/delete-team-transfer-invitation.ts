import { prisma } from '@documenso/prisma';

import { TEAM_MEMBER_ROLE_PERMISSIONS_MAP } from '../../constants/teams';

export type DeleteTeamTransferInvitationOptions = {
  /**
   * The ID of the user deleting the transfer.
   */
  userId: number;

  /**
   * The ID of the team whose team transfer invitation should be deleted.
   */
  teamId: number;
};

export const deleteTeamTransferInvitation = async ({
  userId,
  teamId,
}: DeleteTeamTransferInvitationOptions) => {
  await prisma.$transaction(async (tx) => {
    await tx.team.findFirstOrThrow({
      where: {
        id: teamId,
        members: {
          some: {
            userId,
            role: {
              in: TEAM_MEMBER_ROLE_PERMISSIONS_MAP['DELETE_TEAM_TRANSFER_INVITATION'],
            },
          },
        },
      },
    });

    await tx.teamTransferVerification.delete({
      where: {
        teamId,
      },
    });
  });
};
