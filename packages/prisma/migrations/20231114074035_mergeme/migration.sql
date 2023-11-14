/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Team` table. All the data in the column will be lost.
  - Added the required column `ownerUserId` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_ownerId_fkey";

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "ownerId",
ADD COLUMN     "ownerUserId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TeamMember" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
