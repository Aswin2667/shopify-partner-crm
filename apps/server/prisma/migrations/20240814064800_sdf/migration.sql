/*
  Warnings:

  - Added the required column `createdAt` to the `LeadActivity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LeadActivity" ADD COLUMN     "createdAt" BIGINT NOT NULL;
