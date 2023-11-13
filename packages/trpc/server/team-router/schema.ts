import { z } from 'zod';

import { TeamMemberRole } from '@documenso/prisma/client';

export const ZCreateTeamMutationSchema = z.object({
  name: z.string().min(1),
  url: z.string().min(1), // Todo: Apply regex.
  // avatar: z.string().min(1), Todo: Teams
  // emails
  // members: z.array(z.string().min(1)),
});

export const ZDeleteTeamMutationSchema = z.object({
  teamId: z.number(),
});

export const ZGetTeamMutationSchema = z.object({
  teamId: z.number(),
});

export const ZInviteTeamMembersMutationSchema = z.object({
  teamId: z.number(),
  members: z.array(
    z.object({
      email: z.string().email(),
      role: z.nativeEnum(TeamMemberRole),
    }),
  ),
});

export const ZUpdateTeamMutationSchema = z.object({
  teamId: z.number(),
});

export type TCreateTeamMutationSchema = z.infer<typeof ZCreateTeamMutationSchema>;
export type TDeleteTeamMutationSchema = z.infer<typeof ZDeleteTeamMutationSchema>;
export type TGetTeamMutationSchema = z.infer<typeof ZGetTeamMutationSchema>;
export type TInviteTeamMembersMutationSchema = z.infer<typeof ZInviteTeamMembersMutationSchema>;
export type TUpdateTeamMutationSchema = z.infer<typeof ZUpdateTeamMutationSchema>;
