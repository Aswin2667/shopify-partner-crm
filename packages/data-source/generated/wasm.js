
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.18.0
 * Query Engine version: 4c784e32044a8a016d99474bd02a3b6123742169
 */
Prisma.prismaVersion = {
  client: "5.18.0",
  engine: "4c784e32044a8a016d99474bd02a3b6123742169"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  authenticationMethod: 'authenticationMethod',
  name: 'name',
  avatarUrl: 'avatarUrl',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.OrgMemberInviteScalarFieldEnum = {
  id: 'id',
  token: 'token',
  email: 'email',
  role: 'role',
  organizationId: 'organizationId',
  inviterId: 'inviterId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.OrganizationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  logo: 'logo',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  details: 'details',
  deletedAt: 'deletedAt'
};

exports.Prisma.OrgMemberScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  userId: 'userId',
  role: 'role',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt',
  signature: 'signature'
};

exports.Prisma.ProjectScalarFieldEnum = {
  id: 'id',
  name: 'name',
  type: 'type',
  data: 'data',
  cliAccessToken: 'cliAccessToken',
  isSynced: 'isSynced',
  organizationId: 'organizationId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt',
  integrationId: 'integrationId'
};

exports.Prisma.LeadNotesScalarFieldEnum = {
  id: 'id',
  leadId: 'leadId',
  data: 'data',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt',
  userId: 'userId'
};

exports.Prisma.LeadScalarFieldEnum = {
  id: 'id',
  shopifyDomain: 'shopifyDomain',
  shopifyStoreId: 'shopifyStoreId',
  statusId: 'statusId',
  leadSource: 'leadSource',
  shopDetails: 'shopDetails',
  industry: 'industry',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt',
  integrationId: 'integrationId',
  organizationId: 'organizationId'
};

exports.Prisma.LeadProjectScalarFieldEnum = {
  id: 'id',
  leadId: 'leadId',
  projectId: 'projectId',
  integrationId: 'integrationId',
  orgId: 'orgId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt',
  status: 'status'
};

exports.Prisma.ContactScalarFieldEnum = {
  id: 'id',
  firstName: 'firstName',
  lastName: 'lastName',
  title: 'title',
  Salutation: 'Salutation',
  name: 'name',
  email: 'email',
  secondaryEmail: 'secondaryEmail',
  primaryPhNo: 'primaryPhNo',
  secondaryPhNo: 'secondaryPhNo',
  type: 'type',
  leadId: 'leadId',
  lastContacted: 'lastContacted',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt',
  organizationId: 'organizationId',
  isPrimay: 'isPrimay',
  isUnsubscribed: 'isUnsubscribed'
};

exports.Prisma.AttachmentScalarFieldEnum = {
  id: 'id',
  attachmentUrl: 'attachmentUrl',
  attachmentType: 'attachmentType',
  eTag: 'eTag',
  attachmentName: 'attachmentName',
  leadId: 'leadId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.LeadActivityScalarFieldEnum = {
  id: 'id',
  leadId: 'leadId',
  data: 'data',
  updatedAt: 'updatedAt',
  createdAt: 'createdAt',
  deletedAt: 'deletedAt',
  userId: 'userId',
  noteId: 'noteId',
  type: 'type',
  orgId: 'orgId'
};

exports.Prisma.EmailScalarFieldEnum = {
  id: 'id',
  from: 'from',
  to: 'to',
  replyTo: 'replyTo',
  cc: 'cc',
  bcc: 'bcc',
  status: 'status',
  subject: 'subject',
  body: 'body',
  html: 'html',
  trackingId: 'trackingId',
  messageId: 'messageId',
  threadId: 'threadId',
  historyId: 'historyId',
  labelIds: 'labelIds',
  isOpened: 'isOpened',
  openedAt: 'openedAt',
  isClicked: 'isClicked',
  clickedAt: 'clickedAt',
  sentAt: 'sentAt',
  deletedAt: 'deletedAt',
  integrationId: 'integrationId',
  organizationId: 'organizationId',
  leadId: 'leadId',
  contactId: 'contactId',
  source: 'source'
};

exports.Prisma.EmailQueueScalarFieldEnum = {
  id: 'id',
  emailId: 'emailId',
  scheduledAt: 'scheduledAt',
  status: 'status',
  retryCount: 'retryCount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.IntegrationScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  name: 'name',
  data: 'data',
  description: 'description',
  type: 'type',
  category: 'category',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt',
  orgMemberId: 'orgMemberId',
  isSingular: 'isSingular',
  sharedType: 'sharedType'
};

exports.Prisma.MailServiceFromEmailScalarFieldEnum = {
  id: 'id',
  fromName: 'fromName',
  fromEmail: 'fromEmail',
  replyTo: 'replyTo',
  type: 'type',
  integrationId: 'integrationId',
  organizationId: 'organizationId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UnsubscribeLinkScalarFieldEnum = {
  id: 'id',
  name: 'name',
  message: 'message',
  anchorText: 'anchorText',
  isActive: 'isActive',
  organizationId: 'organizationId'
};

exports.Prisma.JobScalarFieldEnum = {
  id: 'id',
  name: 'name',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  integrationId: 'integrationId',
  organizationId: 'organizationId'
};

exports.Prisma.TaskScalarFieldEnum = {
  id: 'id',
  jobId: 'jobId',
  name: 'name',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WebhookScalarFieldEnum = {
  id: 'id',
  url: 'url',
  type: 'type',
  createdAt: 'createdAt',
  organizationId: 'organizationId',
  data: 'data'
};

exports.Prisma.TemplateScalarFieldEnum = {
  id: 'id',
  html: 'html',
  name: 'name',
  createdAt: 'createdAt',
  isEnabled: 'isEnabled',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt',
  userId: 'userId',
  orgId: 'orgId'
};

exports.Prisma.LeadStatusScalarFieldEnum = {
  id: 'id',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt',
  organizationId: 'organizationId'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.AuthenticationMethod = exports.$Enums.AuthenticationMethod = {
  GOOGLE: 'GOOGLE',
  MAGIC_LINK: 'MAGIC_LINK'
};

exports.OrgMemberRole = exports.$Enums.OrgMemberRole = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER'
};

exports.LeadActivityType = exports.$Enums.LeadActivityType = {
  LEAD_CREATED: 'LEAD_CREATED',
  LEAD_UPDATED: 'LEAD_UPDATED',
  NOTE_CREATED: 'NOTE_CREATED',
  NOTE_UPDATED: 'NOTE_UPDATED',
  NOTE_DELETED: 'NOTE_DELETED',
  EMAIL: 'EMAIL',
  CALL: 'CALL',
  TASK: 'TASK',
  MEETING: 'MEETING',
  STATUS_CHANGE: 'STATUS_CHANGE',
  RELATIONSHIP_INSTALLED: 'RELATIONSHIP_INSTALLED',
  RELATIONSHIP_UNINSTALLED: 'RELATIONSHIP_UNINSTALLED',
  CREDIT_APPLIED: 'CREDIT_APPLIED',
  CREDIT_FAILED: 'CREDIT_FAILED',
  CREDIT_PENDING: 'CREDIT_PENDING',
  ONE_TIME_CHARGE_ACCEPTED: 'ONE_TIME_CHARGE_ACCEPTED',
  ONE_TIME_CHARGE_ACTIVATED: 'ONE_TIME_CHARGE_ACTIVATED',
  ONE_TIME_CHARGE_DECLINED: 'ONE_TIME_CHARGE_DECLINED',
  ONE_TIME_CHARGE_EXPIRED: 'ONE_TIME_CHARGE_EXPIRED',
  RELATIONSHIP_REACTIVATED: 'RELATIONSHIP_REACTIVATED',
  RELATIONSHIP_DEACTIVATED: 'RELATIONSHIP_DEACTIVATED',
  SUBSCRIPTION_APPROACHING_CAPPED_AMOUNT: 'SUBSCRIPTION_APPROACHING_CAPPED_AMOUNT',
  SUBSCRIPTION_CAPPED_AMOUNT_UPDATED: 'SUBSCRIPTION_CAPPED_AMOUNT_UPDATED',
  SUBSCRIPTION_CHARGE_ACCEPTED: 'SUBSCRIPTION_CHARGE_ACCEPTED',
  SUBSCRIPTION_CHARGE_ACTIVATED: 'SUBSCRIPTION_CHARGE_ACTIVATED',
  SUBSCRIPTION_CHARGE_CANCELED: 'SUBSCRIPTION_CHARGE_CANCELED',
  SUBSCRIPTION_CHARGE_DECLINED: 'SUBSCRIPTION_CHARGE_DECLINED',
  SUBSCRIPTION_CHARGE_EXPIRED: 'SUBSCRIPTION_CHARGE_EXPIRED',
  SUBSCRIPTION_CHARGE_FROZEN: 'SUBSCRIPTION_CHARGE_FROZEN',
  SUBSCRIPTION_CHARGE_UNFROZEN: 'SUBSCRIPTION_CHARGE_UNFROZEN'
};

exports.EmailStatus = exports.$Enums.EmailStatus = {
  SEND: 'SEND',
  SCHEDULE: 'SCHEDULE',
  FAILED: 'FAILED'
};

exports.IntegrationType = exports.$Enums.IntegrationType = {
  GMAIL: 'GMAIL',
  SHOPIFY: 'SHOPIFY',
  MAIL_GUN: 'MAIL_GUN',
  SEND_GRID: 'SEND_GRID'
};

exports.QueueStatus = exports.$Enums.QueueStatus = {
  PENDING: 'PENDING',
  SENT: 'SENT',
  FAILED: 'FAILED'
};

exports.IntegrationCategory = exports.$Enums.IntegrationCategory = {
  ECOMMERCE: 'ECOMMERCE',
  MAIL_SERVICE: 'MAIL_SERVICE',
  OTHER: 'OTHER'
};

exports.IntegrationSharingType = exports.$Enums.IntegrationSharingType = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE'
};

exports.JobStatus = exports.$Enums.JobStatus = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

exports.TaskStatus = exports.$Enums.TaskStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

exports.WebhookType = exports.$Enums.WebhookType = {
  GMAIL_NEW_EMAIL: 'GMAIL_NEW_EMAIL',
  MAILGUN_EVENT: 'MAILGUN_EVENT',
  SENDGRID_EVENT: 'SENDGRID_EVENT'
};

exports.Prisma.ModelName = {
  User: 'User',
  OrgMemberInvite: 'OrgMemberInvite',
  Organization: 'Organization',
  OrgMember: 'OrgMember',
  Project: 'Project',
  LeadNotes: 'LeadNotes',
  Lead: 'Lead',
  LeadProject: 'LeadProject',
  Contact: 'Contact',
  Attachment: 'Attachment',
  LeadActivity: 'LeadActivity',
  Email: 'Email',
  EmailQueue: 'EmailQueue',
  Integration: 'Integration',
  MailServiceFromEmail: 'MailServiceFromEmail',
  UnsubscribeLink: 'UnsubscribeLink',
  Job: 'Job',
  Task: 'Task',
  Webhook: 'Webhook',
  Template: 'Template',
  LeadStatus: 'LeadStatus'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
