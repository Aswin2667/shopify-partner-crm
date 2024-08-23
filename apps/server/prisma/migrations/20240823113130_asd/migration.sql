/*
  Warnings:

  - Added the required column `organizationId` to the `LeadStatus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LeadStatus" ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "LeadStatus" ADD CONSTRAINT "LeadStatus_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
