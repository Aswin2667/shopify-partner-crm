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
  - You are about to drop the column `userId` on the `Email` table. All the data in the column will be lost.
  - The `to` column on the `Email` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `cc` column on the `Email` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `bcc` column on the `Email` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `organizationId` on the `LeadProject` table. All the data in the column will be lost.
  - You are about to drop the column `appApiKey` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `creAppId` on the `Project` table. All the data in the column will be lost.
  - Added the required column `integrationId` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `body` to the `Email` table without a default value. This is not possible if the table is not empty.
  - Added the required column `integrationId` to the `Email` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sentAt` to the `Email` table without a default value. This is not possible if the table is not empty.
  - Added the required column `threadId` to the `Email` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "integrationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Email" DROP COLUMN "failed",
DROP COLUMN "from",
DROP COLUMN "hasAttachments",
DROP COLUMN "opened",
DROP COLUMN "sent",
DROP COLUMN "skipped",
DROP COLUMN "time",
DROP COLUMN "unsubscribed",
DROP COLUMN "userId",
ADD COLUMN     "body" TEXT NOT NULL,
ADD COLUMN     "historyId" TEXT,
ADD COLUMN     "integrationId" TEXT NOT NULL,
ADD COLUMN     "labelIds" TEXT[],
ADD COLUMN     "sentAt" BIGINT NOT NULL,
ADD COLUMN     "threadId" TEXT NOT NULL,
DROP COLUMN "to",
ADD COLUMN     "to" TEXT[],
DROP COLUMN "cc",
ADD COLUMN     "cc" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "bcc",
ADD COLUMN     "bcc" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "LeadProject" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "appApiKey",
DROP COLUMN "creAppId";

-- AddForeignKey
ALTER TABLE "LeadProject" ADD CONSTRAINT "LeadProject_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
