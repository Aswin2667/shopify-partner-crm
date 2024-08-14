-- AlterTable
ALTER TABLE "Attachment" ALTER COLUMN "createdAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" DROP DEFAULT;
DROP SEQUENCE "Attachment_createdAt_seq";
DROP SEQUENCE "Attachment_updatedAt_seq";

-- AlterTable
ALTER TABLE "Contact" ALTER COLUMN "createdAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" DROP DEFAULT;
DROP SEQUENCE "Contact_createdAt_seq";
DROP SEQUENCE "Contact_updatedAt_seq";

-- AlterTable
ALTER TABLE "Integration" ALTER COLUMN "createdAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" DROP DEFAULT;
DROP SEQUENCE "Integration_createdAt_seq";
DROP SEQUENCE "Integration_updatedAt_seq";

-- AlterTable
ALTER TABLE "Lead" ALTER COLUMN "createdAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" DROP DEFAULT;
DROP SEQUENCE "Lead_createdAt_seq";
DROP SEQUENCE "Lead_updatedAt_seq";

-- AlterTable
ALTER TABLE "LeadActivity" ALTER COLUMN "updatedAt" DROP DEFAULT;
DROP SEQUENCE "LeadActivity_updatedAt_seq";

-- AlterTable
ALTER TABLE "LeadNotes" ALTER COLUMN "createdAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" DROP DEFAULT;
DROP SEQUENCE "LeadNotes_createdAt_seq";
DROP SEQUENCE "LeadNotes_updatedAt_seq";

-- AlterTable
ALTER TABLE "LeadProjects" ALTER COLUMN "createdAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" DROP DEFAULT;
DROP SEQUENCE "LeadProjects_createdAt_seq";
DROP SEQUENCE "LeadProjects_updatedAt_seq";

-- AlterTable
ALTER TABLE "OrgMember" ALTER COLUMN "createdAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" DROP DEFAULT;
DROP SEQUENCE "OrgMember_createdAt_seq";
DROP SEQUENCE "OrgMember_updatedAt_seq";

-- AlterTable
ALTER TABLE "OrgMemberInvite" ALTER COLUMN "createdAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" DROP DEFAULT;
DROP SEQUENCE "OrgMemberInvite_createdAt_seq";
DROP SEQUENCE "OrgMemberInvite_updatedAt_seq";

-- AlterTable
ALTER TABLE "Organization" ALTER COLUMN "createdAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" DROP DEFAULT;
DROP SEQUENCE "Organization_createdAt_seq";
DROP SEQUENCE "Organization_updatedAt_seq";

-- AlterTable
ALTER TABLE "Projects" ALTER COLUMN "createdAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" DROP DEFAULT;
DROP SEQUENCE "Projects_createdAt_seq";
DROP SEQUENCE "Projects_updatedAt_seq";

-- AlterTable
ALTER TABLE "Template" ALTER COLUMN "createdAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" DROP DEFAULT;
DROP SEQUENCE "Template_createdAt_seq";
DROP SEQUENCE "Template_updatedAt_seq";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "createdAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" DROP DEFAULT;
DROP SEQUENCE "User_createdAt_seq";
DROP SEQUENCE "User_updatedAt_seq";
