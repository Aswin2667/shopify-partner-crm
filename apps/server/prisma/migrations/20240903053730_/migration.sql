-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_integrationId_fkey";

-- AlterTable
ALTER TABLE "Lead" ALTER COLUMN "integrationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE SET NULL ON UPDATE CASCADE;
