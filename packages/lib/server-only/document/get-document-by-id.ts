import { prisma } from '@documenso/prisma';

export interface GetDocumentByIdOptions {
  id: number;
  userId: number;
}

export const getDocumentById = async ({ id, userId }: GetDocumentByIdOptions) => {
  return await prisma.document.findFirstOrThrow({
    where: {
      id,
      userId,
      OR: [
        {
          Team: {
            is: null,
          },
        },
        {
          Team: {
            is: {
              members: {
                some: {
                  userId,
                },
              },
            },
          },
        },
      ],
    },
    include: {
      documentData: true,
      documentMeta: true,
    },
  });
};
