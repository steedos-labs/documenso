import { AppError } from '@documenso/lib/errors/app-error';
import { addTeamEmailVerification } from '@documenso/lib/server-only/team/add-team-email-verification';
import { createTeam } from '@documenso/lib/server-only/team/create-team';
import { createTeamPendingCheckoutSession } from '@documenso/lib/server-only/team/create-team-checkout-session';
import { deleteTeam } from '@documenso/lib/server-only/team/delete-team';
import { deleteTeamEmail } from '@documenso/lib/server-only/team/delete-team-email';
import { deleteTeamEmailVerification } from '@documenso/lib/server-only/team/delete-team-email-verification';
import { deleteTeamMemberInvitations } from '@documenso/lib/server-only/team/delete-team-invitations';
import { deleteTeamMembers } from '@documenso/lib/server-only/team/delete-team-members';
import { deleteTeamPending } from '@documenso/lib/server-only/team/delete-team-pending';
import { findTeamMemberInvites } from '@documenso/lib/server-only/team/find-team-member-invites';
import { findTeamMembers } from '@documenso/lib/server-only/team/find-team-members';
import { findTeams } from '@documenso/lib/server-only/team/find-teams';
import { findTeamsPending } from '@documenso/lib/server-only/team/find-teams-pending';
import { getTeamEmailByEmail } from '@documenso/lib/server-only/team/get-team-email-by-email';
import { getTeamMembers } from '@documenso/lib/server-only/team/get-team-members';
import { getTeamById, getTeams } from '@documenso/lib/server-only/team/get-teams';
import { inviteTeamMembers } from '@documenso/lib/server-only/team/invite-team-members';
import { leaveTeam } from '@documenso/lib/server-only/team/leave-team';
import { resendTeamEmailVerification } from '@documenso/lib/server-only/team/resend-team-email-verification';
import { resendTeamMemberInvitation } from '@documenso/lib/server-only/team/resend-team-member-invitation';
import { transferTeamOwnership } from '@documenso/lib/server-only/team/transfer-team-ownership';
import { updateTeam } from '@documenso/lib/server-only/team/update-team';
import { updateTeamEmail } from '@documenso/lib/server-only/team/update-team-email';
import { updateTeamMember } from '@documenso/lib/server-only/team/update-team-member';

import { authenticatedProcedure, router } from '../trpc';
import {
  ZAddTeamEmailVerificationMutationSchema,
  ZCreateTeamMutationSchema,
  ZDeleteTeamEmailMutationSchema,
  ZDeleteTeamEmailVerificationMutationSchema,
  ZDeleteTeamMemberInvitationsMutationSchema,
  ZDeleteTeamMembersMutationSchema,
  ZDeleteTeamMutationSchema,
  ZDeleteTeamPendingMutationSchema,
  ZFindTeamMemberInvitesQuerySchema,
  ZFindTeamMembersQuerySchema,
  ZFindTeamsPendingQuerySchema,
  ZFindTeamsQuerySchema,
  ZGetTeamMembersQuerySchema,
  ZGetTeamQuerySchema,
  ZInviteTeamMembersMutationSchema,
  ZLeaveTeamMutationSchema,
  ZResendTeamEmailVerificationMutationSchema,
  ZResendTeamMemberInvitationMutationSchema,
  ZTransferTeamOwnershipMutationSchema,
  ZUpdateTeamEmailMutationSchema,
  ZUpdateTeamMemberMutationSchema,
  ZUpdateTeamMutationSchema,
} from './schema';

export const teamRouter = router({
  addTeamEmailVerification: authenticatedProcedure
    .input(ZAddTeamEmailVerificationMutationSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        return await addTeamEmailVerification({
          teamId: input.teamId,
          userId: ctx.user.id,
          data: {
            email: input.email,
            name: input.name,
          },
        });
      } catch (err) {
        console.error(err);

        throw AppError.parseErrorToTRPCError(err);
      }
    }),

  deleteTeamEmail: authenticatedProcedure
    .input(ZDeleteTeamEmailMutationSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        return await deleteTeamEmail({
          teamId: input.teamId,
          userId: ctx.user.id,
          userEmail: ctx.user.email,
        });
      } catch (err) {
        console.error(err);

        throw AppError.parseErrorToTRPCError(err);
      }
    }),

  deleteTeamEmailVerification: authenticatedProcedure
    .input(ZDeleteTeamEmailVerificationMutationSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        return await deleteTeamEmailVerification({ teamId: input.teamId, userId: ctx.user.id });
      } catch (err) {
        console.error(err);

        throw AppError.parseErrorToTRPCError(err);
      }
    }),

  getTeam: authenticatedProcedure.input(ZGetTeamQuerySchema).query(async ({ input, ctx }) => {
    try {
      return await getTeamById({ teamId: input.teamId, userId: ctx.user.id });
    } catch (err) {
      console.error(err);

      throw AppError.parseErrorToTRPCError(err);
    }
  }),

  getTeamEmailByEmail: authenticatedProcedure.query(async ({ ctx }) => {
    try {
      return await getTeamEmailByEmail({ email: ctx.user.email });
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

  createTeamPendingCheckout: authenticatedProcedure
    .input(ZDeleteTeamPendingMutationSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        return await createTeamPendingCheckoutSession({
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

  deleteTeamPending: authenticatedProcedure
    .input(ZDeleteTeamPendingMutationSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        return await deleteTeamPending({
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

  findTeamsPending: authenticatedProcedure
    .input(ZFindTeamsPendingQuerySchema)
    .query(async ({ input, ctx }) => {
      try {
        return await findTeamsPending({
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
          userName: ctx.user.name ?? '',
          teamId,
          invitations,
        });
      } catch (err) {
        console.error(err);

        throw AppError.parseErrorToTRPCError(err);
      }
    }),

  leaveTeam: authenticatedProcedure
    .input(ZLeaveTeamMutationSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        return await leaveTeam({
          userId: ctx.user.id,
          ...input,
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

  updateTeamEmail: authenticatedProcedure
    .input(ZUpdateTeamEmailMutationSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        return await updateTeamEmail({
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

  resendTeamEmailVerification: authenticatedProcedure
    .input(ZResendTeamEmailVerificationMutationSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        await resendTeamEmailVerification({
          userId: ctx.user.id,
          ...input,
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
          userName: ctx.user.name ?? '',
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
