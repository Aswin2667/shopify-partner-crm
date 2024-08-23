/*
  Warnings:

  - Added the required column `integrationId` to the `LeadProject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `LeadProject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LeadProject" ADD COLUMN     "integrationId" TEXT NOT NULL,
ADD COLUMN     "organizationId" TEXT NOT NULL;
