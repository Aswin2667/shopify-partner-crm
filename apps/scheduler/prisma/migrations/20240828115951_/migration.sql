/*
  Warnings:

  - Added the required column `integrationId` to the `LeadProject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `LeadProject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appApiKey` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creAppId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LeadProject" ADD COLUMN     "integrationId" TEXT NOT NULL,
ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "appApiKey" TEXT NOT NULL,
ADD COLUMN     "creAppId" TEXT NOT NULL,
ADD COLUMN     "isSynced" BOOLEAN NOT NULL DEFAULT false;
