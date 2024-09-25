export class LeadQueryBuilder {
  private filters: string[] = [];

  // Add Shopify Domain Filter
  addShopifyDomainFilter(shopifyDomain: string, domainFilterOption: string) {
    if (shopifyDomain && domainFilterOption) {
      switch (domainFilterOption) {
        case 'contains':
          this.filters.push(`l."shopifyDomain" LIKE '%${shopifyDomain}%'`);
          break;
        case 'does-not-contain':
          this.filters.push(`l."shopifyDomain" NOT LIKE '%${shopifyDomain}%'`);
          break;
        case 'contains phrase':
          this.filters.push(`l."shopifyDomain" LIKE '%${shopifyDomain}%'`);
          break;
        case 'does not contain phrase':
          this.filters.push(`l."shopifyDomain" NOT LIKE '%${shopifyDomain}%'`);
          break;
        case 'is exactly':
          this.filters.push(`l."shopifyDomain" = '${shopifyDomain}'`);
          break;
        case 'is not exactly':
          this.filters.push(`l."shopifyDomain" != '${shopifyDomain}'`);
          break;
        case 'contains words starting with':
          this.filters.push(`l."shopifyDomain" LIKE '${shopifyDomain}%'`);
          break;
        case 'does not contain words starting':
          this.filters.push(`l."shopifyDomain" NOT LIKE '${shopifyDomain}%'`);
          break;
        default:
          console.warn(`Unhandled domain filter option: ${domainFilterOption}`);
          break;
      }
    }
  }

  // Add Lead Status Filter
  addLeadStatusFilter(
    leadStatusFilterOption: string,
    selectedStatuses: string | undefined,
  ) {
    if (!leadStatusFilterOption || !selectedStatuses) return;

    const selectedStatusesArray = JSON.parse(selectedStatuses);
    const statusPlaceholders = selectedStatusesArray
      .map((status) => `'${status.value}'`)
      .join(', ');

    this.filters.push(
      `ls.id ${leadStatusFilterOption === 'is not any of' ? 'NOT IN' : 'IN'} (${statusPlaceholders})`,
    );
  }

  // Add Created At Filter
  addCreatedAtFilter(createdAt: any) {
    if (!createdAt) return;

    const startDate = createdAt.startDate || '2023-01-01';
    const endDate = createdAt.endDate || '2023-12-31';
    this.filters.push(`l."createdAt" BETWEEN '${startDate}' AND '${endDate}'`);
  }

  // Build the query with organization ID and applied filters
  buildQuery(orgId: string): string {
    const whereClause = this.filters.length
      ? `AND ${this.filters.join(' AND ')}`
      : '';
    return `
        SELECT 
          l.id, 
          l."shopifyDomain", 
          l."shopifyStoreId", 
          l."leadSource", 
          l."shopDetails", 
          l.industry, 
          l."createdAt", 
          l."updatedAt", 
          l."deletedAt", 
          l."integrationId", 
          l."organizationId",
          COUNT(lp."projectId") AS projectCount,
          COALESCE(
            json_agg(
              json_build_object(
                'id', p.id,
                'name', p.name,
                'type', p.type,
                'data', p.data,
                'isSynced', p."isSynced",
                'createdAt', p."createdAt",
                'updatedAt', p."updatedAt"
              )
            ) FILTER (WHERE p.id IS NOT NULL), '[]'::json
          ) AS projects,
          ls.status AS leadStatus
        FROM "Lead" l
        LEFT JOIN "LeadProject" lp ON l.id = lp."leadId"
        LEFT JOIN "Project" p ON lp."projectId" = p.id
        LEFT JOIN "LeadStatus" ls ON l."statusId" = ls.id
        WHERE l."organizationId" = '${orgId}'
        ${whereClause}
        GROUP BY l.id, ls.status
        ORDER BY l."createdAt" DESC;
      `;
  }
}
