-- CreateEnum
CREATE TYPE "AuthenticationMethod" AS ENUM ('GOOGLE', 'MAGIC_LINK');

-- CreateEnum
CREATE TYPE "OrgMemberRole" AS ENUM ('ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "AppVersion" AS ENUM ('V2', 'V3');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "authenticationMethod" "AuthenticationMethod" NOT NULL,
    "name" TEXT,
    "avatarUrl" TEXT,
    "createdAt" BIGSERIAL NOT NULL,
    "updatedAt" BIGSERIAL NOT NULL,
    "deletedAt" BIGINT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrgMemberInvite" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "OrgMemberRole" NOT NULL DEFAULT 'MEMBER',
    "organizationId" TEXT NOT NULL,
    "inviterId" TEXT NOT NULL,
    "createdAt" BIGSERIAL NOT NULL,
    "updatedAt" BIGSERIAL NOT NULL,
    "deletedAt" BIGINT NOT NULL,

    CONSTRAINT "OrgMemberInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "description" TEXT,
    "createdAt" BIGSERIAL NOT NULL,
    "updatedAt" BIGSERIAL NOT NULL,
    "deletedAt" BIGINT NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrgMember" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "OrgMemberRole" NOT NULL DEFAULT 'MEMBER',
    "createdAt" BIGSERIAL NOT NULL,
    "updatedAt" BIGSERIAL NOT NULL,
    "deletedAt" BIGINT NOT NULL,

    CONSTRAINT "OrgMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Apps" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" BIGSERIAL NOT NULL,
    "updatedAt" BIGSERIAL NOT NULL,
    "deletedAt" BIGINT,
    "version" "AppVersion" NOT NULL DEFAULT 'V2',
    "integrationId" TEXT,

    CONSTRAINT "Apps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadNotes" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" BIGSERIAL NOT NULL,
    "updatedAt" BIGSERIAL NOT NULL,
    "deletedAt" BIGINT NOT NULL,

    CONSTRAINT "LeadNotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "shopifyDomain" TEXT NOT NULL,
    "shopifyStoreId" TEXT NOT NULL,
    "leadSource" TEXT,
    "shopDetails" JSONB,
    "industry" TEXT,
    "createdAt" BIGSERIAL NOT NULL,
    "updatedAt" BIGSERIAL NOT NULL,
    "deletedAt" BIGINT NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadApps" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "createdAt" BIGSERIAL NOT NULL,
    "updatedAt" BIGSERIAL NOT NULL,
    "deletedAt" BIGINT NOT NULL,
    "status" TEXT,

    CONSTRAINT "LeadApps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "primaryEmail" TEXT,
    "secondaryEmail" TEXT,
    "primaryPhNo" TEXT,
    "secondaryPhNo" TEXT,
    "industry" TEXT,
    "type" TEXT,
    "leadId" TEXT,
    "lastContacted" BIGINT,
    "createdAt" BIGSERIAL NOT NULL,
    "updatedAt" BIGSERIAL NOT NULL,
    "deletedAt" BIGINT NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "attachmentUrl" TEXT NOT NULL,
    "attachmentType" TEXT NOT NULL,
    "eTag" TEXT NOT NULL,
    "attachmentName" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "createdAt" BIGSERIAL NOT NULL,
    "updatedAt" BIGSERIAL NOT NULL,
    "deletedAt" BIGINT NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadActivity" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" BIGSERIAL NOT NULL,
    "updatedAt" BIGSERIAL NOT NULL,
    "deletedAt" BIGINT NOT NULL,

    CONSTRAINT "LeadActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Email" (
    "id" TEXT NOT NULL,
    "subject" TEXT,
    "messageId" TEXT NOT NULL,
    "hasAttachments" BOOLEAN NOT NULL,
    "unsubscribed" BOOLEAN NOT NULL,
    "failed" BOOLEAN NOT NULL,
    "skipped" BOOLEAN NOT NULL,
    "opened" BOOLEAN NOT NULL,
    "sent" BOOLEAN NOT NULL,
    "time" BIGINT NOT NULL,
    "cc" TEXT,
    "bcc" TEXT,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "deletedAt" BIGINT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Integration" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "description" TEXT,
    "type" TEXT,
    "createdAt" BIGSERIAL NOT NULL,
    "updatedAt" BIGSERIAL NOT NULL,
    "deletedAt" BIGINT NOT NULL,

    CONSTRAINT "Integration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "html" TEXT NOT NULL,
    "createdAt" BIGSERIAL NOT NULL,
    "updatedAt" BIGSERIAL NOT NULL,
    "deletedAt" BIGINT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "OrgMemberInvite_token_key" ON "OrgMemberInvite"("token");

-- CreateIndex
CREATE UNIQUE INDEX "OrgMemberInvite_organizationId_email_key" ON "OrgMemberInvite"("organizationId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "OrgMember_organizationId_userId_key" ON "OrgMember"("organizationId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Apps_slug_key" ON "Apps"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_shopifyDomain_key" ON "Lead"("shopifyDomain");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_shopifyStoreId_key" ON "Lead"("shopifyStoreId");

-- CreateIndex
CREATE UNIQUE INDEX "LeadApps_appId_leadId_key" ON "LeadApps"("appId", "leadId");

-- AddForeignKey
ALTER TABLE "OrgMemberInvite" ADD CONSTRAINT "OrgMemberInvite_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgMemberInvite" ADD CONSTRAINT "OrgMemberInvite_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgMember" ADD CONSTRAINT "OrgMember_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgMember" ADD CONSTRAINT "OrgMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apps" ADD CONSTRAINT "Apps_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apps" ADD CONSTRAINT "Apps_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadNotes" ADD CONSTRAINT "LeadNotes_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadApps" ADD CONSTRAINT "LeadApps_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadApps" ADD CONSTRAINT "LeadApps_appId_fkey" FOREIGN KEY ("appId") REFERENCES "Apps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadActivity" ADD CONSTRAINT "LeadActivity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Integration" ADD CONSTRAINT "Integration_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
