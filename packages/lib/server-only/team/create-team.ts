import { z } from 'zod';

import { prisma } from '@documenso/prisma';
import { Prisma } from '@documenso/prisma/client';

import { AppError, AppErrorCode } from '../../errors/app-error';

export interface CreateTeamOptions {
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
   * Used as the URL path, example: https://documenso.com/settings/teams/{teamUrl}
   */
  teamUrl: string;
}

export const createTeam = async ({ name, userId, teamUrl }: CreateTeamOptions) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  // Todo: Teams - Check if user has valid billing plan to create Teams.
  try {
    return await prisma.team.create({
      data: {
        name,
        url: teamUrl,
        Owner: {
          connect: {
            id: user.id,
          },
        },
        members: {
          create: [
            {
              userId,
              status: 'ACTIVE',
              role: 'ADMIN',
            },
          ],
        },
      },
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
