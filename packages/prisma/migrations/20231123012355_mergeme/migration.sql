-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "teamId" INTEGER;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
