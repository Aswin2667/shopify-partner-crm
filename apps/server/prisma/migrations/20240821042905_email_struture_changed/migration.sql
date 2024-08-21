/*
  Warnings:

  - You are about to drop the column `failed` on the `Email` table. All the data in the column will be lost.
  - You are about to drop the column `from` on the `Email` table. All the data in the column will be lost.
  - You are about to drop the column `hasAttachments` on the `Email` table. All the data in the column will be lost.
  - You are about to drop the column `opened` on the `Email` table. All the data in the column will be lost.
  - You are about to drop the column `sent` on the `Email` table. All the data in the column will be lost.
  - You are about to drop the column `skipped` on the `Email` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Email` table. All the data in the column will be lost.
  - You are about to drop the column `unsubscribed` on the `Email` table. All the data in the column will be lost.
  - The `cc` column on the `Email` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `bcc` column on the `Email` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `to` column on the `Email` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `body` to the `Email` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sentAt` to the `Email` table without a default value. This is not possible if the table is not empty.
  - Added the required column `threadId` to the `Email` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Email" DROP COLUMN "failed",
DROP COLUMN "from",
DROP COLUMN "hasAttachments",
DROP COLUMN "opened",
DROP COLUMN "sent",
DROP COLUMN "skipped",
DROP COLUMN "time",
DROP COLUMN "unsubscribed",
ADD COLUMN     "body" TEXT NOT NULL,
ADD COLUMN     "labelIds" TEXT[],
ADD COLUMN     "sentAt" BIGINT NOT NULL,
ADD COLUMN     "threadId" TEXT NOT NULL,
DROP COLUMN "cc",
ADD COLUMN     "cc" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "bcc",
ADD COLUMN     "bcc" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "to",
ADD COLUMN     "to" TEXT[];
