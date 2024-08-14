/*
  Warnings:

  - Added the required column `data` to the `Projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Projects" ADD COLUMN     "data" JSONB NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
