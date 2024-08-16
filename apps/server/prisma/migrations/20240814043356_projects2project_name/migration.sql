/*
  Warnings:

  - You are about to drop the `LeadProjects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Projects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LeadProjects" DROP CONSTRAINT "LeadProjects_leadId_fkey";

-- DropForeignKey
ALTER TABLE "LeadProjects" DROP CONSTRAINT "LeadProjects_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Projects" DROP CONSTRAINT "Projects_integrationId_fkey";

-- DropForeignKey
ALTER TABLE "Projects" DROP CONSTRAINT "Projects_organizationId_fkey";

-- DropTable
DROP TABLE "LeadProjects";

-- DropTable
DROP TABLE "Projects";

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" BIGSERIAL NOT NULL,
    "updatedAt" BIGSERIAL NOT NULL,
    "deletedAt" BIGINT,
    "integrationId" TEXT,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadProject" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" BIGSERIAL NOT NULL,
    "updatedAt" BIGSERIAL NOT NULL,
    "deletedAt" BIGINT NOT NULL,
    "status" TEXT,

    CONSTRAINT "LeadProject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LeadProject_projectId_leadId_key" ON "LeadProject"("projectId", "leadId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadProject" ADD CONSTRAINT "LeadProject_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadProject" ADD CONSTRAINT "LeadProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
