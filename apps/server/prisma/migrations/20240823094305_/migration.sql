/*
  Warnings:

  - You are about to drop the column `body` on the `Email` table. All the data in the column will be lost.
  - You are about to drop the column `historyId` on the `Email` table. All the data in the column will be lost.
  - You are about to drop the column `integrationId` on the `Email` table. All the data in the column will be lost.
  - You are about to drop the column `labelIds` on the `Email` table. All the data in the column will be lost.
  - You are about to drop the column `sentAt` on the `Email` table. All the data in the column will be lost.
  - You are about to drop the column `threadId` on the `Email` table. All the data in the column will be lost.
  - Added the required column `failed` to the `Email` table without a default value. This is not possible if the table is not empty.
  - Added the required column `from` to the `Email` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasAttachments` to the `Email` table without a default value. This is not possible if the table is not empty.
  - Added the required column `opened` to the `Email` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sent` to the `Email` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skipped` to the `Email` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Email` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unsubscribed` to the `Email` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Email` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `LeadProject` table without a default value. This is not possible if the table is not empty.
  - Made the column `integrationId` on table `LeadProject` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "LeadProject" DROP CONSTRAINT "LeadProject_integrationId_fkey";

-- AlterTable
ALTER TABLE "Email" DROP COLUMN "body",
DROP COLUMN "historyId",
DROP COLUMN "integrationId",
DROP COLUMN "labelIds",
DROP COLUMN "sentAt",
DROP COLUMN "threadId",
ADD COLUMN     "failed" BOOLEAN NOT NULL,
ADD COLUMN     "from" TEXT NOT NULL,
ADD COLUMN     "hasAttachments" BOOLEAN NOT NULL,
ADD COLUMN     "opened" BOOLEAN NOT NULL,
ADD COLUMN     "sent" BOOLEAN NOT NULL,
ADD COLUMN     "skipped" BOOLEAN NOT NULL,
ADD COLUMN     "time" BIGINT NOT NULL,
ADD COLUMN     "unsubscribed" BOOLEAN NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "to" SET NOT NULL,
ALTER COLUMN "to" SET DATA TYPE TEXT,
ALTER COLUMN "cc" DROP NOT NULL,
ALTER COLUMN "cc" DROP DEFAULT,
ALTER COLUMN "cc" SET DATA TYPE TEXT,
ALTER COLUMN "bcc" DROP NOT NULL,
ALTER COLUMN "bcc" DROP DEFAULT,
ALTER COLUMN "bcc" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "LeadProject" ADD COLUMN     "organizationId" TEXT NOT NULL,
ALTER COLUMN "integrationId" SET NOT NULL;
