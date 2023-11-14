import { prisma } from '@documenso/prisma';
import { TeamMemberRole } from '@documenso/prisma/client';

export type RemoveTeamMembersOptions = {
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

export const removeTeamMembers = async ({
  userId,
  teamId,
  teamMemberIds,
}: RemoveTeamMembersOptions) => {
  const result = await prisma.team.update({
    where: {
      id: teamId,
      ownerUserId: {
        // Todo: Teams - This is not going to work since ownerId is the userId, not the teamMemberId.
        notIn: teamMemberIds, // Todo: Teams - Check that this works.
      },
      members: {
        some: {
          userId,
          role: {
            in: [TeamMemberRole.ADMIN, TeamMemberRole.MANAGER],
          },
        },
      },
    },
    data: {
      members: {
        delete: teamMemberIds.map((teamMemberId) => ({
          id: teamMemberId,
        })),
      },
    },
  });

  // Todo: Teams - Check the result to see if the team was updated.
};
