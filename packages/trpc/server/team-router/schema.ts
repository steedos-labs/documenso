import { z } from 'zod';

import { TeamMemberRole } from '@documenso/prisma/client';

export const ZCreateTeamMutationSchema = z.object({
  name: z.string().min(1),
  url: z.string().min(1), // Todo: Apply regex. Todo: lowercase, etc
  // avatar: z.string().min(1), Todo: Teams
});

export const ZDeleteTeamMutationSchema = z.object({
  teamId: z.number(),
});

export const ZGetTeamQuerySchema = z.object({
  teamId: z.number(),
});

export const ZGetTeamMembersQuerySchema = z.object({
  teamId: z.number(),
});

export const ZInviteTeamMembersMutationSchema = z.object({
  teamId: z.number(),
  invitations: z.array(
    z.object({
      email: z.string().email(),
      role: z.nativeEnum(TeamMemberRole),
    }),
  ),
});

export const ZUpdateTeamMutationSchema = z.object({
  teamId: z.number(),
  data: z.object({
    // Todo: Teams
    name: z.string().min(1),
    url: z.string().min(1), // Todo: Apply regex. Todo: lowercase, etc
    // avatar: z.string().min(1), Todo: Teams
  }),
});

export const ZRemoveTeamMemberspMutationSchema = z.object({
  teamId: z.number(),
  teamMemberIds: z.array(z.number()),
});

export const ZFindTeamsQuerySchema = z.object({
  term: z.string().optional(),
  page: z.number().optional(),
  perPage: z.number().optional(),
});

export const ZFindTeamMembersQuerySchema = z.object({
  teamId: z.number(),
  newOwnerUserId: z.number(),
});

export const ZTransferTeamOwnershipMutationSchema = z.object({
  teamId: z.number(),
  newOwnerUserId: z.number(),
});

export type TCreateTeamMutationSchema = z.infer<typeof ZCreateTeamMutationSchema>;
export type TDeleteTeamMutationSchema = z.infer<typeof ZDeleteTeamMutationSchema>;
export type TGetTeamQuerySchema = z.infer<typeof ZGetTeamQuerySchema>;
export type TGetTeamMembersQuerySchema = z.infer<typeof ZGetTeamMembersQuerySchema>;
export type TInviteTeamMembersMutationSchema = z.infer<typeof ZInviteTeamMembersMutationSchema>;
export type TUpdateTeamMutationSchema = z.infer<typeof ZUpdateTeamMutationSchema>;
export type TRemoveTeamMemberspMutationSchema = z.infer<typeof ZRemoveTeamMemberspMutationSchema>;
export type TFindTeamsQuerySchema = z.infer<typeof ZFindTeamsQuerySchema>;
export type TFindTeamMembersQuerySchema = z.infer<typeof ZFindTeamMembersQuerySchema>;
export type TTransferTeamOwnershipMutationSchema = z.infer<
  typeof ZTransferTeamOwnershipMutationSchema
>;
