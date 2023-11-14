import { AppError } from '@documenso/lib/errors/app-error';
import { createTeam } from '@documenso/lib/server-only/team/create-team';
import { deleteTeam } from '@documenso/lib/server-only/team/delete-team';
import { getTeamMembers } from '@documenso/lib/server-only/team/get-team-members';
import { getTeamById, getTeams } from '@documenso/lib/server-only/team/get-teams';
import { inviteTeamMembers } from '@documenso/lib/server-only/team/invite-team-members';
import { transferTeamOwnership } from '@documenso/lib/server-only/team/transfer-team-ownership';
import { updateTeam } from '@documenso/lib/server-only/team/update-team';

import { authenticatedProcedure, router } from '../trpc';
import {
  ZCreateTeamMutationSchema,
  ZDeleteTeamMutationSchema,
  ZGetTeamMembersMutationSchema,
  ZGetTeamMutationSchema,
  ZInviteTeamMembersMutationSchema,
  ZTransferTeamOwnershipMutationSchema,
  ZUpdateTeamMutationSchema,
} from './schema';

export const teamRouter = router({
  getTeam: authenticatedProcedure.input(ZGetTeamMutationSchema).query(async ({ input, ctx }) => {
    try {
      return await getTeamById({ teamId: input.teamId, userId: ctx.user.id });
    } catch (err) {
      console.error(err);

      throw AppError.parseErrorToTRPCError(err);
    }
  }),

  getTeamMembers: authenticatedProcedure
    .input(ZGetTeamMembersMutationSchema)
    .query(async ({ input, ctx }) => {
      try {
        return await getTeamMembers({ teamId: input.teamId, userId: ctx.user.id });
      } catch (err) {
        console.error(err);

        throw AppError.parseErrorToTRPCError(err);
      }
    }),

  getTeams: authenticatedProcedure.query(async ({ ctx }) => {
    try {
      return await getTeams({ userId: ctx.user.id });
    } catch (err) {
      console.error(err);

      throw AppError.parseErrorToTRPCError(err);
    }
  }),

  createTeam: authenticatedProcedure
    .input(ZCreateTeamMutationSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { name, url } = input;

        return await createTeam({
          userId: ctx.user.id,
          name,
          teamUrl: url,
        });
      } catch (err) {
        console.error(err);

        throw AppError.parseErrorToTRPCError(err);
      }
    }),

  updateTeam: authenticatedProcedure
    .input(ZUpdateTeamMutationSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { teamId } = input;

        // 1. Validate the user can update the team.
        // 2. Update the team.
        // 3. Return the team.
        // const { password, currentPassword } = input;
        return await updateTeam({
          userId: ctx.user.id,
          teamId,
        });
      } catch (err) {
        console.error(err);

        throw AppError.parseErrorToTRPCError(err);
      }
    }),

  deleteTeam: authenticatedProcedure
    .input(ZDeleteTeamMutationSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { teamId } = input;

        return await deleteTeam({
          userId: ctx.user.id,
          teamId,
        });
      } catch (err) {
        console.error(err);

        throw AppError.parseErrorToTRPCError(err);
      }
    }),

  inviteTeamMembers: authenticatedProcedure
    .input(ZInviteTeamMembersMutationSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { teamId, invitations } = input;

        return await inviteTeamMembers({
          userId: ctx.user.id,
          teamId,
          invitations,
        });
      } catch (err) {
        console.error(err);

        throw AppError.parseErrorToTRPCError(err);
      }
    }),

  transferTeamOwnership: authenticatedProcedure
    .input(ZTransferTeamOwnershipMutationSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        return await transferTeamOwnership({
          userId: ctx.user.id,
          teamId: input.teamId,
          newOwnerUserId: input.newOwnerUserId,
        });
      } catch (err) {
        console.error(err);

        throw AppError.parseErrorToTRPCError(err);
      }
    }),
});
