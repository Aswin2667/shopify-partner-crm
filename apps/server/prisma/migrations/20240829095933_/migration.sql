/*
  Warnings:

  - Added the required column `appApiKey` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creAppId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "appApiKey" TEXT NOT NULL,
ADD COLUMN     "creAppId" TEXT NOT NULL;
