/*
  Warnings:

  - You are about to drop the column `slug` on the `Projects` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `Projects` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Projects_slug_key";

-- AlterTable
ALTER TABLE "Projects" DROP COLUMN "slug",
DROP COLUMN "version";
