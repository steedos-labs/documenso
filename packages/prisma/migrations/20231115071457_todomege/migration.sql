/*
  Warnings:

  - You are about to drop the column `status` on the `TeamMember` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TeamMember" DROP COLUMN "status";

-- DropEnum
DROP TYPE "TeamMemberStatus";
