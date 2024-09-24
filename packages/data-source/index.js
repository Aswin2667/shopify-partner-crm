import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createFilteredMaterializedView(filters) {
  // Construct dynamic SQL for cre ating a materialized view
  const baseQuery = await prisma.$queryRaw`
    CREATE MATERIALIZED VIEW organization_lead_view AS
    SELECT * from Lead
  `;

  await prisma.$executeRawUnsafe(baseQuery);
  
  console.log('Materialized view created with the provided filters');
}

// Example of calling the function with dynamic filters
createFilteredMaterializedView({
  organizationId: 'org-123',
  industry: 'Retail',
  leadSource: 'Referral',
  createdAt: 1672531200, // Example timestamp
}).catch((e) => {
  console.error(e);
}).finally(async () => {
  await prisma.$disconnect();
});
