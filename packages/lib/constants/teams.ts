import { TeamMemberRole } from '@documenso/prisma/client';

export const TEAM_MEMBER_ROLE_MAP: Record<keyof typeof TeamMemberRole, string> = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  MEMBER: 'Member',
};
