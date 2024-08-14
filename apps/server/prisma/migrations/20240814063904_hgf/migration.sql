/*
  Warnings:

  - You are about to drop the column `createdAt` on the `LeadActivity` table. All the data in the column will be lost.
  - Added the required column `userId` to the `LeadActivity` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `LeadActivity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "LeadActivityType" AS ENUM ('LEAD_CREATED', 'LEAD_UPDATED', 'NOTE_CREATED', 'NOTE_UPDATED', 'NOTE_DELETED', 'EMAIL', 'CALL', 'TASK', 'MEETING', 'STATUS_CHANGE');

-- AlterTable
ALTER TABLE "LeadActivity" DROP COLUMN "createdAt",
ADD COLUMN     "userId" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "LeadActivityType" NOT NULL;

-- CreateIndex
CREATE INDEX "LeadActivity_leadId_userId_idx" ON "LeadActivity"("leadId", "userId");

-- AddForeignKey
ALTER TABLE "LeadActivity" ADD CONSTRAINT "LeadActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
