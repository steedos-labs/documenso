-- CreateTable
CREATE TABLE "TeamPending" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerUserId" INTEGER NOT NULL,

    CONSTRAINT "TeamPending_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TeamPending_url_key" ON "TeamPending"("url");

-- AddForeignKey
ALTER TABLE "TeamPending" ADD CONSTRAINT "TeamPending_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
