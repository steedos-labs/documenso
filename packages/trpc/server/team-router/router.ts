import { TRPCError } from '@trpc/server';

import { createTeam } from '@documenso/lib/server-only/team/create-team';
import { deleteTeam } from '@documenso/lib/server-only/team/delete-team';
import { getTeam, getTeams } from '@documenso/lib/server-only/team/get-teams';
import { inviteTeamMembers } from '@documenso/lib/server-only/team/invite-team-members';
import { updateTeam } from '@documenso/lib/server-only/team/update-team';

import { authenticatedProcedure, procedure, router } from '../trpc';
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
      return getTeam({ teamId: input.teamId, userId: ctx.user.id });
    } catch (err) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Todo: Teams',
      });
    }
  }),

  getTeams: authenticatedProcedure.query(async ({ ctx }) => {
    try {
      return getTeams({ userId: ctx.user.id });
    } catch (err) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Todo: Teams',
      });
    }
  }),

  createTeam: authenticatedProcedure
    .input(ZCreateTeamMutationSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { name, url } = input;
        // 1. Validate the user can create teams.
        // 2. Create the team.
        // 3. Return the team.

        return createTeam({
          userId: ctx.user.id,
          name,
          teamUrl: url,
        });
      } catch (err) {
        console.error(err);

        if (err.message === 'TEAMURL_EXISTS') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'TEAMURL_EXISTS',
          });
        }

        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Todo: Teams',
        });
      }
    }),

  updateTeam: authenticatedProcedure
    .input(ZUpdateTeamMutationSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // 1. Validate the user can update the team.
        // 2. Update the team.
        // 3. Return the team.
        // const { password, currentPassword } = input;
        return updateTeam({
          userId: ctx.user.id,
          password,
          currentPassword,
        });
      } catch (err) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Todo: Teams',
        });
      }
    }),

  deleteTeam: procedure.input(ZDeleteTeamMutationSchema).mutation(async ({ input }) => {
    try {
      // 1. Validate the user can delete the team.
      // 2. Delete the team.
      const { email } = input;

      return deleteTeam({
        email,
      });
    } catch (err) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Todo: Teams',
      });
    }
  }),

  inviteTeamMembers: authenticatedProcedure
    .input(ZInviteTeamMembersMutationSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Todo: Teams validate that emails are not already members of the team.

        const { teamId, members } = input;

        return inviteTeamMembers({
          userId: ctx.user.id,
          teamId,
          newTeamMemberInvites: members, // todo: teams
        });
      } catch (err) {
        console.error(err);

        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Todo: Teams',
        });
      }
    }),
});
