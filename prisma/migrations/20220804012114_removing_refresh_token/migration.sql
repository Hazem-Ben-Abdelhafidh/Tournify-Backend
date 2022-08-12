/*
  Warnings:

  - You are about to drop the `RefreshTokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "RefreshTokens" DROP CONSTRAINT "RefreshTokens_userId_fkey";

-- DropIndex
DROP INDEX "User_name_email_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "Role" "Role" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "RefreshTokens";
