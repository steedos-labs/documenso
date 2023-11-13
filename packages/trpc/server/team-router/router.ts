import { AppError } from '@documenso/lib/errors/app-error';
import { createTeam } from '@documenso/lib/server-only/team/create-team';
import { deleteTeam } from '@documenso/lib/server-only/team/delete-team';
import { getTeam, getTeams } from '@documenso/lib/server-only/team/get-teams';
import { inviteTeamMembers } from '@documenso/lib/server-only/team/invite-team-members';
import { updateTeam } from '@documenso/lib/server-only/team/update-team';

import { authenticatedProcedure, router } from '../trpc';
import {
  ZCreateTeamMutationSchema,
  ZDeleteTeamMutationSchema,
  ZGetTeamMutationSchema,
  ZInviteTeamMembersMutationSchema,
  ZUpdateTeamMutationSchema,
} from './schema';

export const teamRouter = router({
  getTeam: authenticatedProcedure.input(ZGetTeamMutationSchema).query(async ({ input, ctx }) => {
    try {
      return await getTeam({ teamId: input.teamId, userId: ctx.user.id });
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
});
