import { z } from 'zod';

import { getCheckoutSession } from '@documenso/ee/server-only/stripe/get-checkout-session';
import { prisma } from '@documenso/prisma';
import type { Subscription } from '@documenso/prisma/client';
import { Prisma, SubscriptionStatus, TeamMemberRole } from '@documenso/prisma/client';

import { WEBAPP_BASE_URL } from '../../constants/app';
import { AppError, AppErrorCode } from '../../errors/app-error';

export type CreateTeamOptions = {
  /**
   * ID of the user creating the Team.
   */
  userId: number;

  /**
   * Name of the team to display.
   */
  name: string;

  /**
   * Unique URL of the team.
   *
   * Used as the URL path, example: https://documenso.com/t/{teamUrl}/settings
   */
  teamUrl: string;
};

export type CreateTeamResponse =
  | {
      paymentRequired: false;
    }
  | {
      paymentRequired: true;
      checkoutUrl: string;
    };

/**
 * Create a team or pending team depending on the user's subscription or application's billing settings.
 */
export const createTeam = async ({
  name,
  userId,
  teamUrl,
}: CreateTeamOptions): Promise<CreateTeamResponse> => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    include: {
      Subscription: true,
    },
  });

  const isBillingEnabled = process.env.NEXT_PUBLIC_FEATURE_BILLING_ENABLED === 'true';
  const isUserSubscriptionValidForTeams = isSubscriptionActiveAndCommunityPlan(user?.Subscription);

  const isPaymentRequired = isBillingEnabled && !isUserSubscriptionValidForTeams;

  try {
    // Create the team directly if no payment is required.
    if (!isPaymentRequired) {
      await prisma.team.create({
        data: {
          name,
          url: teamUrl,
          ownerUserId: user.id,
          members: {
            create: [
              {
                userId,
                role: TeamMemberRole.ADMIN,
              },
            ],
          },
        },
      });

      return {
        paymentRequired: false,
      };
    }

    // Create a pending team if payment is required.
    return await prisma.$transaction(async (tx) => {
      const existingTeamWithUrl = await tx.team.findUnique({
        where: {
          url: teamUrl,
        },
      });

      if (existingTeamWithUrl) {
        throw new AppError(AppErrorCode.ALREADY_EXISTS, 'Team URL already exists.');
      }

      if (!process.env.NEXT_PUBLIC_STRIPE_TEAM_SEAT_PRICE_ID) {
        throw new AppError('INVALID_CONFIG', 'Stripe team seat price ID is not set.');
      }

      await prisma.teamPending.create({
        data: {
          name,
          url: teamUrl,
          ownerUserId: user.id,
        },
      });

      const stripeCheckoutSession = await getCheckoutSession({
        customerId: '', // Todo: Teams
        priceId: process.env.NEXT_PUBLIC_STRIPE_TEAM_SEAT_PRICE_ID,
        returnUrl: `${WEBAPP_BASE_URL}/settings/teams`,
      });

      if (!stripeCheckoutSession) {
        throw new Error('No stripe checkout available');
      }

      return {
        paymentRequired: true,
        checkoutUrl: stripeCheckoutSession,
      };
    });
  } catch (err) {
    console.error(err);

    if (!(err instanceof Prisma.PrismaClientKnownRequestError)) {
      throw err;
    }

    const target = z.array(z.string()).safeParse(err.meta?.target);

    if (err.code === 'P2002' && target.success && target.data.includes('url')) {
      throw new AppError(AppErrorCode.ALREADY_EXISTS, 'Team URL already exists.');
    }

    throw err;
  }
};

const isSubscriptionActiveAndCommunityPlan = (subscription?: Subscription | null) => {
  if (!subscription || subscription.status !== SubscriptionStatus.ACTIVE) {
    return false;
  }

  return (
    subscription.planId === process.env.NEXT_PUBLIC_STRIPE_COMMUNITY_PLAN_MONTHLY_PRICE_ID ||
    subscription.planId === process.env.NEXT_PUBLIC_STRIPE_COMMUNITY_PLAN_YEARLY_PRICE_ID
  );
};
