import { prisma } from '@documenso/prisma';

export type UpdateTeamOptions = {
  userId: number;
  name: string;
  signature: string;
};

export const updateTeam = async ({ userId, name, signature }: UpdateTeamOptions) => {
  // Existence check
  await prisma.user.findFirstOrThrow({
    where: {
      id: userId,
    },
  });

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
      signature,
    },
  });

  return updatedUser;
};
