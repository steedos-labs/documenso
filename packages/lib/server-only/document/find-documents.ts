import { DateTime } from 'luxon';
import { P, match } from 'ts-pattern';

import { prisma } from '@documenso/prisma';
import type { Document, Prisma, Team, User } from '@documenso/prisma/client';
import { SigningStatus } from '@documenso/prisma/client';
import { ExtendedDocumentStatus } from '@documenso/prisma/types/extended-document-status';

import type { FindResultSet } from '../../types/find-result-set';

export type FindDocumentsOptions = {
  userId: number;
  teamId?: number;
  term?: string;
  status?: ExtendedDocumentStatus;
  page?: number;
  perPage?: number;
  orderBy?: {
    column: keyof Omit<Document, 'document'>;
    direction: 'asc' | 'desc';
  };
  period?: '' | '7d' | '14d' | '30d';
};

export const findDocuments = async ({
  userId,
  teamId,
  term,
  status = ExtendedDocumentStatus.ALL,
  page = 1,
  perPage = 10,
  orderBy,
  period,
}: FindDocumentsOptions) => {
  const { user, team } = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findFirstOrThrow({
      where: {
        id: userId,
      },
    });

    let team = null;

    if (teamId !== undefined) {
      team = await tx.team.findFirstOrThrow({
        where: {
          id: teamId,
          members: {
            some: {
              userId,
            },
          },
        },
      });
    }

    return {
      user,
      team,
    };
  });

  const orderByColumn = orderBy?.column ?? 'createdAt';
  const orderByDirection = orderBy?.direction ?? 'desc';

  const termFilters = match(term)
    .with(P.string.minLength(1), () => {
      return {
        title: {
          contains: term,
          mode: 'insensitive',
        },
      } as const;
    })
    .otherwise(() => undefined);

  const filters = team ? findTeamDocumentsFilter(status, team) : findDocumentsFilter(status, user);

  const whereClause: Prisma.DocumentWhereInput = {
    ...termFilters,
    ...filters,
  };

  if (period) {
    const daysAgo = parseInt(period.replace(/d$/, ''), 10);

    const startOfPeriod = DateTime.now().minus({ days: daysAgo }).startOf('day');

    whereClause.createdAt = {
      gte: startOfPeriod.toJSDate(),
    };
  }

  const [data, count] = await Promise.all([
    prisma.document.findMany({
      where: whereClause,
      skip: Math.max(page - 1, 0) * perPage,
      take: perPage,
      orderBy: {
        [orderByColumn]: orderByDirection,
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        Recipient: true,
      },
    }),
    prisma.document.count({
      where: {
        ...termFilters,
        ...filters,
      },
    }),
  ]);

  return {
    data,
    count,
    currentPage: Math.max(page, 1),
    perPage,
    totalPages: Math.ceil(count / perPage),
  } satisfies FindResultSet<typeof data>;
};

const findDocumentsFilter = (status: ExtendedDocumentStatus, user: User) => {
  return match<ExtendedDocumentStatus, Prisma.DocumentWhereInput>(status)
    .with(ExtendedDocumentStatus.ALL, () => ({
      OR: [
        {
          userId: user.id,
          teamId: null,
          deletedAt: null,
        },
        {
          status: ExtendedDocumentStatus.COMPLETED,
          Recipient: {
            some: {
              email: user.email,
            },
          },
        },
        {
          status: ExtendedDocumentStatus.PENDING,
          Recipient: {
            some: {
              email: user.email,
            },
          },
          deletedAt: null,
        },
      ],
    }))
    .with(ExtendedDocumentStatus.INBOX, () => ({
      status: {
        not: ExtendedDocumentStatus.DRAFT,
      },
      Recipient: {
        some: {
          email: user.email,
          signingStatus: SigningStatus.NOT_SIGNED,
        },
      },
      deletedAt: null,
    }))
    .with(ExtendedDocumentStatus.DRAFT, () => ({
      userId: user.id,
      teamId: null,
      status: ExtendedDocumentStatus.DRAFT,
      deletedAt: null,
    }))
    .with(ExtendedDocumentStatus.PENDING, () => ({
      OR: [
        {
          userId: user.id,
          teamId: null,
          status: ExtendedDocumentStatus.PENDING,
          deletedAt: null,
        },
        {
          status: ExtendedDocumentStatus.PENDING,
          Recipient: {
            some: {
              email: user.email,
              signingStatus: SigningStatus.SIGNED,
            },
          },
          deletedAt: null,
        },
      ],
    }))
    .with(ExtendedDocumentStatus.COMPLETED, () => ({
      OR: [
        {
          userId: user.id,
          teamId: null,
          status: ExtendedDocumentStatus.COMPLETED,
          deletedAt: null,
        },
        {
          status: ExtendedDocumentStatus.COMPLETED,
          Recipient: {
            some: {
              email: user.email,
            },
          },
        },
      ],
    }))
    .exhaustive();
};

const findTeamDocumentsFilter = (status: ExtendedDocumentStatus, team: Team) => {
  const teamEmail = 'todo@documenso.com'; // Todo: Teams

  const filters = match<ExtendedDocumentStatus, Prisma.DocumentWhereInput>(status)
    .with(ExtendedDocumentStatus.ALL, () => ({
      OR: [
        {
          teamId: team.id,
        },
        {
          status: {
            not: ExtendedDocumentStatus.DRAFT,
          },
          // Recipient: {
          //   some: {
          //     email: user.email, // Todo: Teams - Use team email.
          //   },
          // },
        },
      ],
    }))
    .with(ExtendedDocumentStatus.INBOX, () => ({
      status: {
        not: ExtendedDocumentStatus.DRAFT,
      },
      Recipient: {
        some: {
          email: teamEmail,
          signingStatus: SigningStatus.NOT_SIGNED,
        },
      },
    }))
    .with(ExtendedDocumentStatus.DRAFT, () => ({
      teamId: team.id,
      status: ExtendedDocumentStatus.DRAFT,
    }))
    .with(ExtendedDocumentStatus.PENDING, () => ({
      OR: [
        {
          teamId: team.id,
          status: ExtendedDocumentStatus.PENDING,
        },
        {
          status: ExtendedDocumentStatus.PENDING,
          Recipient: {
            some: {
              email: teamEmail,
              signingStatus: SigningStatus.SIGNED,
            },
          },
        },
      ],
    }))
    .with(ExtendedDocumentStatus.COMPLETED, () => ({
      OR: [
        {
          teamId: team.id,
          status: ExtendedDocumentStatus.COMPLETED,
        },
        {
          status: ExtendedDocumentStatus.COMPLETED,
          Recipient: {
            some: {
              email: teamEmail,
            },
          },
        },
      ],
    }))
    .exhaustive();

  return filters;
};
