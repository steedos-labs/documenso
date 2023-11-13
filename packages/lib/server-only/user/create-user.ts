import { hash } from 'bcrypt';

import { prisma } from '@documenso/prisma';
import { IdentityProvider } from '@documenso/prisma/client';

import { SALT_ROUNDS } from '../../constants/auth';

export interface CreateUserOptions {
  name: string;
  email: string;
  password: string;
  signature?: string | null;
}

export const createUser = async ({ name, email, password, signature }: CreateUserOptions) => {
  const hashedPassword = await hash(password, SALT_ROUNDS);

  const userExists = await prisma.user.findFirst({
    where: {
      email: email.toLowerCase(),
    },
  });

  if (userExists) {
    throw new Error('User already exists');
  }

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        signature,
        identityProvider: IdentityProvider.DOCUMENSO,
      },
    });

    const acceptedTeamInvites = await tx.teamMemberInvite.findMany({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
        status: 'ACCEPTED', // Todo: Teams use enum.
      },
    });

    // For each team invite, add the user to the team and delete the team invite.
    await Promise.all(
      acceptedTeamInvites.map(async (invite) => {
        await tx.teamMember.create({
          data: {
            teamId: invite.teamId,
            userId: user.id,
            role: invite.role,
          },
        });

        await tx.teamMemberInvite.delete({
          where: {
            id: invite.id,
          },
        });
      }),
    );

    return user;
  });
};
