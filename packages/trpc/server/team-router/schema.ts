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

export const ZGetTeamMutationSchema = z.object({
  teamId: z.number(),
});

export const ZGetTeamMembersMutationSchema = z.object({
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

export const ZTransferTeamOwnershipMutationSchema = z.object({
  teamId: z.number(),
  newOwnerUserId: z.number(),
});

export type TCreateTeamMutationSchema = z.infer<typeof ZCreateTeamMutationSchema>;
export type TDeleteTeamMutationSchema = z.infer<typeof ZDeleteTeamMutationSchema>;
export type TGetTeamMutationSchema = z.infer<typeof ZGetTeamMutationSchema>;
export type TGetTeamMembersMutationSchema = z.infer<typeof ZGetTeamMembersMutationSchema>;
export type TInviteTeamMembersMutationSchema = z.infer<typeof ZInviteTeamMembersMutationSchema>;
export type TUpdateTeamMutationSchema = z.infer<typeof ZUpdateTeamMutationSchema>;
export type TRemoveTeamMemberspMutationSchema = z.infer<typeof ZRemoveTeamMemberspMutationSchema>;
export type TTransferTeamOwnershipMutationSchema = z.infer<
  typeof ZTransferTeamOwnershipMutationSchema
>;
