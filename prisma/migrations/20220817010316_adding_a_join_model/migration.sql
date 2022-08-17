/*
  Warnings:

  - You are about to drop the column `joinedById` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `tournamentId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tournament" DROP CONSTRAINT "Tournament_joinedById_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_tournamentId_fkey";

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "joinedById";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "tournamentId";

-- CreateTable
CREATE TABLE "Join" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,

    CONSTRAINT "Join_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Join_id_key" ON "Join"("id");

-- AddForeignKey
ALTER TABLE "Join" ADD CONSTRAINT "Join_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Join" ADD CONSTRAINT "Join_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
