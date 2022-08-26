/*
  Warnings:

  - You are about to drop the column `reciverId` on the `Conversation` table. All the data in the column will be lost.
  - Added the required column `recieverId` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "reciverId",
ADD COLUMN     "recieverId" TEXT NOT NULL;
