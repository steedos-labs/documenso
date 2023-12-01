import { getCheckoutSession } from '@documenso/ee/server-only/stripe/get-checkout-session';
import { prisma } from '@documenso/prisma';

import { WEBAPP_BASE_URL } from '../../constants/app';
import { AppError, AppErrorCode } from '../../errors/app-error';

export type CreateTeamPendingCheckoutSession = {
  userId: number;
  teamPendingId: number;
};

export const createTeamPendingCheckoutSession = async ({
  userId,
  teamPendingId,
}: CreateTeamPendingCheckoutSession) => {
  if (!process.env.NEXT_PUBLIC_STRIPE_TEAM_SEAT_PRICE_ID) {
    throw new AppError('INVALID_CONFIG', 'Stripe team seat price ID is not set.');
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  // Todo: Teams - Attach this in the checkout to associate.
  console.log(teamPendingId);

  try {
    const stripeCheckoutSession = await getCheckoutSession({
      customerId: '', // Todo: Teams - Use user stripe customer ID.
      priceId: process.env.NEXT_PUBLIC_STRIPE_TEAM_SEAT_PRICE_ID,
      returnUrl: `${WEBAPP_BASE_URL}/settings/teams`,
    });

    if (!stripeCheckoutSession) {
      throw new AppError(AppErrorCode.UNKNOWN_ERROR);
    }

    return stripeCheckoutSession;
  } catch (e) {
    console.error(e);

    // Absorb all the errors incase stripe throws something sensitive.
    throw new AppError(AppErrorCode.UNKNOWN_ERROR, 'Something went wrong.');
  }
};
