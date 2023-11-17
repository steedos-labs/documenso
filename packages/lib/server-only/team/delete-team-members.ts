import { prisma } from '@documenso/prisma';
import { TeamMemberRole } from '@documenso/prisma/client';

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
    // Todo: Teams.
  });
};
