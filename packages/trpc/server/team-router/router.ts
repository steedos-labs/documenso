import { AppError } from '@documenso/lib/errors/app-error';
import { createTeam } from '@documenso/lib/server-only/team/create-team';
import { deleteTeam } from '@documenso/lib/server-only/team/delete-team';
import { deleteTeamMemberInvitations } from '@documenso/lib/server-only/team/delete-team-invitations';
import { deleteTeamMembers } from '@documenso/lib/server-only/team/delete-team-members';
import { findTeamMemberInvites } from '@documenso/lib/server-only/team/find-team-member-invites';
import { findTeamMembers } from '@documenso/lib/server-only/team/find-team-members';
import { findTeams } from '@documenso/lib/server-only/team/find-teams';
import { getTeamMembers } from '@documenso/lib/server-only/team/get-team-members';
import { getTeamById, getTeams } from '@documenso/lib/server-only/team/get-teams';
import {
  inviteTeamMembers,
  resendTeamMemberInvitation,
} from '@documenso/lib/server-only/team/invite-team-members';
import { transferTeamOwnership } from '@documenso/lib/server-only/team/transfer-team-ownership';
import { updateTeam } from '@documenso/lib/server-only/team/update-team';
import { updateTeamMember } from '@documenso/lib/server-only/team/update-team-member';

import { authenticatedProcedure, router } from '../trpc';
import {
  ZCreateTeamMutationSchema,
  ZDeleteTeamMemberInvitationsMutationSchema,
  ZDeleteTeamMembersMutationSchema,
  ZDeleteTeamMutationSchema,
  ZFindTeamMemberInvitesQuerySchema,
  ZFindTeamMembersQuerySchema,
  ZFindTeamsQuerySchema,
  ZGetTeamMembersQuerySchema,
  ZGetTeamQuerySchema,
  ZInviteTeamMembersMutationSchema,
  ZResendTeamMemberInvitationMutationSchema,
  ZTransferTeamOwnershipMutationSchema,
  ZUpdateTeamMemberMutationSchema,
  ZUpdateTeamMutationSchema,
} from './schema';

export const teamRouter = router({
  getTeam: authenticatedProcedure.input(ZGetTeamQuerySchema).query(async ({ input, ctx }) => {
    try {
      return await getTeamById({ teamId: input.teamId, userId: ctx.user.id });
    } catch (err) {
      console.error(err);

      throw AppError.parseErrorToTRPCError(err);
    }
  }),

  getTeamMembers: authenticatedProcedure
    .input(ZGetTeamMembersQuerySchema)
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
        return await updateTeam({
          userId: ctx.user.id,
          ...input,
        });
      } catch (err) {
        console.error(err);

        throw AppError.parseErrorToTRPCError(err);
      }
    }),

  updateTeamMember: authenticatedProcedure
    .input(ZUpdateTeamMemberMutationSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        return await updateTeamMember({
          userId: ctx.user.id,
          ...input,
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

  deleteTeamMemberInvitations: authenticatedProcedure
    .input(ZDeleteTeamMemberInvitationsMutationSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        return await deleteTeamMemberInvitations({
          userId: ctx.user.id,
          ...input,
        });
      } catch (err) {
        console.error(err);

        throw AppError.parseErrorToTRPCError(err);
      }
    }),

  findTeams: authenticatedProcedure.input(ZFindTeamsQuerySchema).query(async ({ input, ctx }) => {
    try {
      return await findTeams({
        userId: ctx.user.id,
        ...input,
      });
    } catch (err) {
      console.error(err);

      throw AppError.parseErrorToTRPCError(err);
    }
  }),

  findTeamMemberInvites: authenticatedProcedure
    .input(ZFindTeamMemberInvitesQuerySchema)
    .query(async ({ input, ctx }) => {
      try {
        return await findTeamMemberInvites({
          userId: ctx.user.id,
          ...input,
        });
      } catch (err) {
        console.error(err);

        throw AppError.parseErrorToTRPCError(err);
      }
    }),

  findTeamMembers: authenticatedProcedure
    .input(ZFindTeamMembersQuerySchema)
    .query(async ({ input, ctx }) => {
      try {
        return await findTeamMembers({
          userId: ctx.user.id,
          ...input,
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

  deleteTeamMembers: authenticatedProcedure
    .input(ZDeleteTeamMembersMutationSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { teamId, teamMemberIds } = input;

        return await deleteTeamMembers({
          userId: ctx.user.id,
          teamId,
          teamMemberIds,
        });
      } catch (err) {
        console.error(err);

        throw AppError.parseErrorToTRPCError(err);
      }
    }),

  resendTeamMemberInvitation: authenticatedProcedure
    .input(ZResendTeamMemberInvitationMutationSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        await resendTeamMemberInvitation({
          userId: ctx.user.id,
          ...input,
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
        const { teamId, newOwnerUserId } = input;

        return await transferTeamOwnership({
          userId: ctx.user.id,
          teamId,
          newOwnerUserId,
        });
      } catch (err) {
        console.error(err);

        throw AppError.parseErrorToTRPCError(err);
      }
    }),
});
