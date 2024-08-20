/*
  Warnings:

  - Added the required column `userId` to the `LeadNotes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LeadNotes" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "LeadNotes" ADD CONSTRAINT "LeadNotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
