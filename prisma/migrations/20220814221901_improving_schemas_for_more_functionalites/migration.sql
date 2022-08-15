-- DropForeignKey
ALTER TABLE "Tournament" DROP CONSTRAINT "Tournament_userId_fkey";

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "joinedById" TEXT,
ADD COLUMN     "ownerId" TEXT NOT NULL DEFAULT 'hhhhh';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "tournamentId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_joinedById_fkey" FOREIGN KEY ("joinedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
