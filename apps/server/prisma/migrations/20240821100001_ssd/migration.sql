/*
  Warnings:

  - Added the required column `integrationId` to the `LeadProject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LeadProject" ADD COLUMN     "integrationId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "LeadProject" ADD CONSTRAINT "LeadProject_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
