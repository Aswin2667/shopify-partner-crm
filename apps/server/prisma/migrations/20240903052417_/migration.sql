/*
  Warnings:

  - You are about to drop the column `appApiKey` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `creAppId` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "appApiKey",
DROP COLUMN "creAppId";
