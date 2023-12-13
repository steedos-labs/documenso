import { createElement } from 'react';

import { mailer } from '@documenso/email/mailer';
import { render } from '@documenso/email/render';
import { TeamTransferRequestTemplate } from '@documenso/email/templates/team-transfer-request';
import { WEBAPP_BASE_URL } from '@documenso/lib/constants/app';
import { FROM_ADDRESS, FROM_NAME } from '@documenso/lib/constants/email';
import { createToken } from '@documenso/lib/utils/token-verification';
import { prisma } from '@documenso/prisma';

export type RequestTeamOwnershipTransferOptions = {
  /**
   * The ID of the user initiating the transfer.
   */
  userId: number;

  /**
   * The name of the user initiating the transfer.
   */
  userName: string;

  /**
   * The ID of the team whose ownership is being transferred.
   */
  teamId: number;

  /**
   * The user ID of the new owner.
   */
  newOwnerUserId: number;
};

export const requestTeamOwnershipTransfer = async ({
  userId,
  userName,
  teamId,
  newOwnerUserId,
}: RequestTeamOwnershipTransferOptions) => {
  await prisma.$transaction(async (tx) => {
    const team = await tx.team.findFirstOrThrow({
      where: {
        id: teamId,
        ownerUserId: userId,
        members: {
          some: {
            userId: newOwnerUserId,
          },
        },
      },
    });

    const newOwnerUser = await tx.user.findFirstOrThrow({
      where: {
        id: newOwnerUserId,
      },
    });

    const { token, expiresAt } = createToken({ minute: 10 });

    const teamVerificationPayload = {
      teamId,
      token,
      expiresAt,
      userId: newOwnerUserId,
      name: newOwnerUser.name ?? '',
      email: newOwnerUser.email,
    };

    await tx.teamTransferVerification.upsert({
      where: {
        teamId,
      },
      create: teamVerificationPayload,
      update: teamVerificationPayload,
    });

    const template = createElement(TeamTransferRequestTemplate, {
      assetBaseUrl: WEBAPP_BASE_URL,
      baseUrl: WEBAPP_BASE_URL,
      senderName: userName,
      teamName: team.name,
      teamUrl: team.url,
      token,
    });

    await mailer.sendMail({
      to: newOwnerUser.email,
      from: {
        name: FROM_NAME,
        address: FROM_ADDRESS,
      },
      subject: `You have been requested to take ownership of team ${team.name} on Documenso`,
      html: render(template),
      text: render(template, { plainText: true }),
    });
  });
};
