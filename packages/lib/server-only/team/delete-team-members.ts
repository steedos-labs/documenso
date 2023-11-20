import { prisma } from '@documenso/prisma';

import { TEAM_MEMBER_ROLE_PERMISSIONS_MAP } from '../../constants/teams';

export type DeleteTeamMembersOptions = {
  /**
   * The ID of the user who is initiating this action.
   */
  userId: number;

  /**
   * The ID of the team to remove members from.
   */
  teamId: number;

  /**
   * The IDs of the team members to remove.
   */
  teamMemberIds: number[];
};

export const deleteTeamMembers = async ({
  userId,
  teamId,
  teamMemberIds,
}: DeleteTeamMembersOptions) => {
  await prisma.$transaction(async (tx) => {
    // Find the team and validate that the user is allowed to remove members.
    const team = await tx.team.findFirstOrThrow({
      where: {
        id: teamId,
        members: {
          some: {
            userId,
            role: {
              in: TEAM_MEMBER_ROLE_PERMISSIONS_MAP['DELETE_TEAM_MEMBERS'],
            },
          },
        },
      },
    });

    // Remove the team members.
    await tx.teamMember.deleteMany({
      where: {
        id: {
          in: teamMemberIds,
        },
        teamId,
        userId: {
          not: team.ownerUserId,
        },
      },
    });
  });
};
