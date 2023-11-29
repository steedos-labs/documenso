import { createElement } from 'react';

import { nanoid } from 'nanoid';

import { mailer } from '@documenso/email/mailer';
import { render } from '@documenso/email/render';
import { TeamInviteEmailTemplate } from '@documenso/email/templates/team-invite';
import { FROM_ADDRESS, FROM_NAME } from '@documenso/lib/constants/email';
import { prisma } from '@documenso/prisma';
import { TeamMemberInviteStatus } from '@documenso/prisma/client';
import type { TInviteTeamMembersMutationSchema } from '@documenso/trpc/server/team-router/schema';

import { WEBAPP_BASE_URL } from '../../constants/app';
import { AppError } from '../../errors/app-error';
import { getTeamById } from './get-teams';

export type InviteTeamMembersOptions = {
  userId: number;
  teamId: number;
  invitations: TInviteTeamMembersMutationSchema['invitations'];
};

/**
 * Invite team members via email to join a team.
 */
export const inviteTeamMembers = async ({
  userId,
  teamId,
  invitations,
}: InviteTeamMembersOptions) => {
  const [team, currentTeamMemberEmails, currentTeamMemberInviteEmails] = await Promise.all([
    getTeamById({ userId, teamId }),
    getTeamMemberEmails(teamId),
    getTeamInvites(teamId),
  ]);

  const usersToInvite = invitations.filter((invitation) => {
    // Filter out users that are already members of the team.
    if (currentTeamMemberEmails.includes(invitation.email)) {
      return false;
    }

    // Filter out users that have already been invited to the team.
    if (currentTeamMemberInviteEmails.includes(invitation.email)) {
      return false;
    }

    return true;
  });

  const teamMemberInvites = usersToInvite.map(({ email, role }) => ({
    email,
    teamId,
    role,
    status: TeamMemberInviteStatus.PENDING,
    token: nanoid(32),
  }));

  await prisma.teamMemberInvite.createMany({
    data: teamMemberInvites,
  });

  const sendEmailResult = await Promise.allSettled(
    teamMemberInvites.map(async ({ email, token }) =>
      sendTeamMemberInviteEmail(email, token, team.name),
    ),
  );

  const sendEmailResultErrorList = sendEmailResult.filter(
    (result): result is PromiseRejectedResult => result.status === 'rejected',
  );

  if (sendEmailResultErrorList.length > 0) {
    console.error(JSON.stringify(sendEmailResultErrorList));

    throw new AppError(
      'EmailDeliveryFailed',
      'Failed to send invite emails to one or more users.',
      `Failed to send invites to ${sendEmailResultErrorList.length}/${teamMemberInvites.length} users.`,
    );
  }
};

/**
 * Send an email to a user inviting them to join a team.
 *
 * @param email The email address of the user to invite.
 * @param token The invite token used to authenticate the user to join the team.
 * @param teamName The name of the team the user is being invited to.
 */
export const sendTeamMemberInviteEmail = async (email: string, token: string, teamName: string) => {
  const template = createElement(TeamInviteEmailTemplate, {
    baseUrl: WEBAPP_BASE_URL,
    teamName,
    token,
  });

  await mailer.sendMail({
    to: email,
    from: {
      name: FROM_NAME,
      address: FROM_ADDRESS,
    },
    subject: `You have been invited to join ${teamName} on Documenso`,
    html: render(template),
    text: render(template, { plainText: true }),
  });
};

/**
 * Returns a list of emails of the team members for a given team.
 *
 * @param teamId The ID of the team.
 * @returns All team member emails for a given team.
 */
const getTeamMemberEmails = async (teamId: number) => {
  const teamMembers = await prisma.teamMember.findMany({
    where: {
      teamId,
    },
    include: {
      user: true,
    },
  });

  return teamMembers.map((teamMember) => teamMember.user.email);
};

/**
 * Returns a list of emails that have been invited to join a team.
 *
 * This list will not include users who have accepted and created an account.
 *
 * @param teamId The ID of the team.
 * @returns All the emails of users that have been invited to join a team.
 */
const getTeamInvites = async (teamId: number) => {
  const teamMemberInvites = await prisma.teamMemberInvite.findMany({
    where: {
      teamId,
    },
  });

  return teamMemberInvites.map((teamMemberInvite) => teamMemberInvite.email);
};
