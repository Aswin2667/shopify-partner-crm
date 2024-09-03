-- CreateEnum
CREATE TYPE "leadStatus" AS ENUM ('POTENTIAL', 'CUSTOMER', 'INTERESTED', 'NOT_INTERESTED', 'BAD_FIT', 'QUALIFIED', 'CANCELED');

-- CreateEnum
CREATE TYPE "LeadActivityType" AS ENUM ('LEAD_CREATED', 'LEAD_UPDATED', 'NOTE_CREATED', 'NOTE_UPDATED', 'NOTE_DELETED', 'EMAIL', 'CALL', 'TASK', 'MEETING', 'STATUS_CHANGE', 'RELATIONSHIP_INSTALLED', 'RELATIONSHIP_UNINSTALLED', 'CREDIT_APPLIED', 'CREDIT_FAILED', 'CREDIT_PENDING', 'ONE_TIME_CHARGE_ACCEPTED', 'ONE_TIME_CHARGE_ACTIVATED', 'ONE_TIME_CHARGE_DECLINED', 'ONE_TIME_CHARGE_EXPIRED', 'RELATIONSHIP_REACTIVATED', 'RELATIONSHIP_DEACTIVATED', 'SUBSCRIPTION_APPROACHING_CAPPED_AMOUNT', 'SUBSCRIPTION_CAPPED_AMOUNT_UPDATED', 'SUBSCRIPTION_CHARGE_ACCEPTED', 'SUBSCRIPTION_CHARGE_ACTIVATED', 'SUBSCRIPTION_CHARGE_CANCELED', 'SUBSCRIPTION_CHARGE_DECLINED', 'SUBSCRIPTION_CHARGE_EXPIRED', 'SUBSCRIPTION_CHARGE_FROZEN', 'SUBSCRIPTION_CHARGE_UNFROZEN');

-- CreateEnum
CREATE TYPE "AuthenticationMethod" AS ENUM ('GOOGLE', 'MAGIC_LINK');

-- CreateEnum
CREATE TYPE "OrgMemberRole" AS ENUM ('ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "AppVersion" AS ENUM ('V2', 'V3');

-- CreateEnum
CREATE TYPE "IntegrationType" AS ENUM ('GMAIL', 'SHOPIFY', 'MAIL_GUN', 'SEND_GRID');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "authenticationMethod" "AuthenticationMethod" NOT NULL,
    "name" TEXT,
    "avatarUrl" TEXT,
    "createdAt" BIGINT NOT NULL,
    "updatedAt" BIGINT NOT NULL,
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
    "createdAt" BIGINT NOT NULL,
    "updatedAt" BIGINT NOT NULL,
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
    "createdAt" BIGINT NOT NULL,
    "updatedAt" BIGINT NOT NULL,
    "deletedAt" BIGINT NOT NULL,

    CONSTRAINT "OrgMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "isSynced" BOOLEAN NOT NULL DEFAULT false,
    "organizationId" TEXT NOT NULL,
    "createdAt" BIGSERIAL NOT NULL,
    "updatedAt" BIGSERIAL NOT NULL,
    "deletedAt" BIGINT,
    "integrationId" TEXT,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadNotes" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" BIGINT NOT NULL,
    "updatedAt" BIGINT NOT NULL,
    "deletedAt" BIGINT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "LeadNotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "shopifyDomain" TEXT NOT NULL,
    "shopifyStoreId" TEXT NOT NULL,
    "status" "leadStatus" NOT NULL DEFAULT 'POTENTIAL',
    "leadSource" TEXT,
    "shopDetails" JSONB,
    "industry" TEXT,
    "createdAt" BIGSERIAL NOT NULL,
    "updatedAt" BIGSERIAL NOT NULL,
    "deletedAt" BIGINT NOT NULL,
    "integrationId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadProject" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "integrationId" TEXT NOT NULL,
    "createdAt" BIGSERIAL NOT NULL,
    "updatedAt" BIGSERIAL NOT NULL,
    "deletedAt" BIGINT NOT NULL,
    "status" TEXT,

    CONSTRAINT "LeadProject_pkey" PRIMARY KEY ("id")
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
    "leadId" TEXT NOT NULL,
    "lastContacted" BIGINT,
    "createdAt" BIGINT NOT NULL,
    "updatedAt" BIGINT NOT NULL,
    "deletedAt" BIGINT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "integrationId" TEXT NOT NULL,

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
    "createdAt" BIGINT NOT NULL,
    "updatedAt" BIGINT NOT NULL,
    "deletedAt" BIGINT NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadActivity" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "updatedAt" BIGINT NOT NULL,
    "createdAt" BIGINT NOT NULL,
    "deletedAt" BIGINT NOT NULL,
    "userId" TEXT,
    "noteId" TEXT,
    "type" "LeadActivityType" NOT NULL,

    CONSTRAINT "LeadActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Email" (
    "id" TEXT NOT NULL,
    "to" TEXT[],
    "cc" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "bcc" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "subject" TEXT,
    "body" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "historyId" TEXT,
    "labelIds" TEXT[],
    "sentAt" BIGINT NOT NULL,
    "deletedAt" BIGINT NOT NULL,
    "integrationId" TEXT NOT NULL,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Integration" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "description" TEXT,
    "type" "IntegrationType" NOT NULL,
    "createdAt" BIGINT NOT NULL,
    "updatedAt" BIGINT NOT NULL,
    "deletedAt" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "isSingular" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Integration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "html" TEXT NOT NULL,
    "createdAt" BIGINT NOT NULL,
    "updatedAt" BIGINT NOT NULL,
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
CREATE UNIQUE INDEX "Lead_shopifyDomain_key" ON "Lead"("shopifyDomain");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_shopifyStoreId_key" ON "Lead"("shopifyStoreId");

-- CreateIndex
CREATE UNIQUE INDEX "LeadProject_projectId_leadId_key" ON "LeadProject"("projectId", "leadId");

-- CreateIndex
CREATE INDEX "LeadActivity_leadId_userId_idx" ON "LeadActivity"("leadId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Integration_organizationId_type_isSingular_key" ON "Integration"("organizationId", "type", "isSingular");

-- AddForeignKey
ALTER TABLE "OrgMemberInvite" ADD CONSTRAINT "OrgMemberInvite_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgMemberInvite" ADD CONSTRAINT "OrgMemberInvite_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgMember" ADD CONSTRAINT "OrgMember_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgMember" ADD CONSTRAINT "OrgMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadNotes" ADD CONSTRAINT "LeadNotes_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadNotes" ADD CONSTRAINT "LeadNotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadProject" ADD CONSTRAINT "LeadProject_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadProject" ADD CONSTRAINT "LeadProject_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadProject" ADD CONSTRAINT "LeadProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadActivity" ADD CONSTRAINT "LeadActivity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadActivity" ADD CONSTRAINT "LeadActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadActivity" ADD CONSTRAINT "LeadActivity_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "LeadNotes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Integration" ADD CONSTRAINT "Integration_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
