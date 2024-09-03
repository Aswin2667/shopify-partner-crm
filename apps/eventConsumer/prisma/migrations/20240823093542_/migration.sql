/*
  Warnings:

  - Added the required column `integrationId` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `integrationId` to the `Lead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Lead` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `LeadActivity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `userId` to the `LeadNotes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `integrationId` to the `LeadProject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `LeadProject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "LeadActivityType" ADD VALUE 'RELATIONSHIP_INSTALLED';
ALTER TYPE "LeadActivityType" ADD VALUE 'RELATIONSHIP_UNINSTALLED';
ALTER TYPE "LeadActivityType" ADD VALUE 'CREDIT_APPLIED';
ALTER TYPE "LeadActivityType" ADD VALUE 'CREDIT_FAILED';
ALTER TYPE "LeadActivityType" ADD VALUE 'CREDIT_PENDING';
ALTER TYPE "LeadActivityType" ADD VALUE 'ONE_TIME_CHARGE_ACCEPTED';
ALTER TYPE "LeadActivityType" ADD VALUE 'ONE_TIME_CHARGE_ACTIVATED';
ALTER TYPE "LeadActivityType" ADD VALUE 'ONE_TIME_CHARGE_DECLINED';
ALTER TYPE "LeadActivityType" ADD VALUE 'ONE_TIME_CHARGE_EXPIRED';
ALTER TYPE "LeadActivityType" ADD VALUE 'RELATIONSHIP_REACTIVATED';
ALTER TYPE "LeadActivityType" ADD VALUE 'RELATIONSHIP_DEACTIVATED';
ALTER TYPE "LeadActivityType" ADD VALUE 'SUBSCRIPTION_APPROACHING_CAPPED_AMOUNT';
ALTER TYPE "LeadActivityType" ADD VALUE 'SUBSCRIPTION_CAPPED_AMOUNT_UPDATED';
ALTER TYPE "LeadActivityType" ADD VALUE 'SUBSCRIPTION_CHARGE_ACCEPTED';
ALTER TYPE "LeadActivityType" ADD VALUE 'SUBSCRIPTION_CHARGE_ACTIVATED';
ALTER TYPE "LeadActivityType" ADD VALUE 'SUBSCRIPTION_CHARGE_CANCELED';
ALTER TYPE "LeadActivityType" ADD VALUE 'SUBSCRIPTION_CHARGE_DECLINED';
ALTER TYPE "LeadActivityType" ADD VALUE 'SUBSCRIPTION_CHARGE_EXPIRED';
ALTER TYPE "LeadActivityType" ADD VALUE 'SUBSCRIPTION_CHARGE_FROZEN';
ALTER TYPE "LeadActivityType" ADD VALUE 'SUBSCRIPTION_CHARGE_UNFROZEN';

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "integrationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "integrationId" TEXT NOT NULL,
ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LeadActivity" DROP COLUMN "type",
ADD COLUMN     "type" "LeadActivityType" NOT NULL;

-- AlterTable
ALTER TABLE "LeadNotes" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LeadProject" ADD COLUMN     "integrationId" TEXT NOT NULL,
ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "isSynced" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "LeadNotes" ADD CONSTRAINT "LeadNotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
