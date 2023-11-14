import { prisma } from '@documenso/prisma';

export type TransferTeamOwnershipOptions = {
  /**
   * The ID of the user initiating the transfer.
   */
  userId: number;

  /**
   * The ID of the team whose ownership is being transferred.
   */
  teamId: number;

  /**
   * The user ID of the new owner.
   */
  newOwnerUserId: number;
};

export const transferTeamOwnership = async ({
  userId,
  teamId,
  newOwnerUserId,
}: TransferTeamOwnershipOptions) => {
  // Todo: Teams - Is this even required?
  // await prisma.team.findUniqueOrThrow({
  //   where: {
  //     id: teamId,
  //     ownerUserId: userId,
  //     members: {
  //       some: {
  //         userId: newOwnerUserId,
  //       },
  //     },
  //   },
  // });

  // Todo: Teams - How will billing work?

  return await prisma.team.update({
    where: {
      id: teamId,
      ownerUserId: userId,
      members: {
        some: {
          userId: newOwnerUserId,
        },
      },
    },
    data: {
      ownerUserId: newOwnerUserId,
      members: {
        update: {
          where: {
            userId_teamId: {
              teamId,
              userId: newOwnerUserId,
            },
          },
          data: {
            role: 'ADMIN',
          },
        },
      },
    },
  });
};
