/*
  Warnings:

  - You are about to drop the `Apps` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LeadApps` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Apps" DROP CONSTRAINT "Apps_integrationId_fkey";

-- DropForeignKey
ALTER TABLE "Apps" DROP CONSTRAINT "Apps_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "LeadApps" DROP CONSTRAINT "LeadApps_appId_fkey";

-- DropForeignKey
ALTER TABLE "LeadApps" DROP CONSTRAINT "LeadApps_leadId_fkey";

-- DropTable
DROP TABLE "Apps";

-- DropTable
DROP TABLE "LeadApps";

-- CreateTable
CREATE TABLE "Projects" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" BIGSERIAL NOT NULL,
    "updatedAt" BIGSERIAL NOT NULL,
    "deletedAt" BIGINT,
    "version" "AppVersion" NOT NULL DEFAULT 'V2',
    "integrationId" TEXT,

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadProjects" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" BIGSERIAL NOT NULL,
    "updatedAt" BIGSERIAL NOT NULL,
    "deletedAt" BIGINT NOT NULL,
    "status" TEXT,

    CONSTRAINT "LeadProjects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Projects_slug_key" ON "Projects"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "LeadProjects_projectId_leadId_key" ON "LeadProjects"("projectId", "leadId");

-- AddForeignKey
ALTER TABLE "Projects" ADD CONSTRAINT "Projects_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projects" ADD CONSTRAINT "Projects_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadProjects" ADD CONSTRAINT "LeadProjects_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadProjects" ADD CONSTRAINT "LeadProjects_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
