/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Website` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Website_userId_key" ON "Website"("userId");
