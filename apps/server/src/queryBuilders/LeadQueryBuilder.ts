import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';

@Injectable()
export class LeadQueryBuilder {
  private filters: string[] = [];

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

  addCreatedAtFilter(
    createdAt: any,
    DateFilterOption: any,
    comparison: any,
  ) {
    const now = DateTime.utc(); // Use Luxon's DateTime for the current date
      console.log(createdAt, DateFilterOption?.value, comparison?.value );
    const getFormattedDate = (date: DateTime) => date.toUTC().toSeconds();
  
    // if (!createdAt || !DateFilterOption || !comparison) return;
  
    const applyComparison = (comparison: any, dateField: string, start: DateTime, end?: DateTime) => {
      switch (comparison?.value) {
        case 'is':
          return `l."${dateField}" = '${getFormattedDate(start)}'`;
        case 'is-not':
          return `l."${dateField}" != '${getFormattedDate(start)}'`;
        case 'is-before':
          return `l."${dateField}" < '${getFormattedDate(start)}'`;
        case 'is-on-or-before':
          return `l."${dateField}" <= '${getFormattedDate(start)}'`;
        case 'is-after':
          return `l."${dateField}" > '${getFormattedDate(start)}'`;
        case 'is-on-or-after':
          return `l."${dateField}" >= '${getFormattedDate(start)}'`;
        case 'is-between':
          if (end) {
            return `l."${dateField}" BETWEEN '${getFormattedDate(start)}' AND '${getFormattedDate(end)}'`;
          }
          console.warn('is-between comparison requires both start and end dates');
          return '';
        default:
          console.warn(`Unhandled comparison type: ${comparison}`);
          return '';
      }
    };
  
    let startDate: DateTime;
    let endDate: DateTime | undefined;
  
    switch (DateFilterOption?.value) {
      case 'now':
        startDate = now.startOf('day');
        endDate = now.endOf('day');
        this.filters.push(applyComparison(comparison, 'createdAt', startDate, endDate));
        break;
      case 'today':
        startDate = now.startOf('day');
        endDate = now.endOf('day');
        this.filters.push(applyComparison(comparison, 'createdAt', startDate, endDate));
        break;
      case 'yesterday':
        startDate = now.minus({ days: 1 }).startOf('day');
        endDate = now.minus({ days: 1 }).endOf('day');
        this.filters.push(applyComparison(comparison, 'createdAt', startDate, endDate));
        break;
      case 'this_week':
        startDate = now.startOf('week');
        endDate = now.endOf('week');
        this.filters.push(applyComparison(comparison, 'createdAt', startDate, endDate));
        break;
      case 'last_week':
        startDate = now.minus({ weeks: 1 }).startOf('week');
        endDate = now.minus({ weeks: 1 }).endOf('week');
        this.filters.push(applyComparison(comparison, 'createdAt', startDate, endDate));
        break;
      case 'this_month':
        startDate = now.startOf('month');
        endDate = now.endOf('month');
        console.log(startDate, endDate)
        this.filters.push(applyComparison(comparison, 'createdAt', startDate, endDate));
        break;
      case 'last_month':
        startDate = now.minus({ months: 1 }).startOf('month');
        endDate = now.minus({ months: 1 }).endOf('month');
        this.filters.push(applyComparison(comparison, 'createdAt', startDate, endDate));
        break;
      case 'this_year':
        startDate = now.startOf('year');
        endDate = now.endOf('year');
        this.filters.push(applyComparison(comparison, 'createdAt', startDate, endDate));
        break;
      case 'last_year':
        startDate = now.minus({ years: 1 }).startOf('year');
        endDate = now.minus({ years: 1 }).endOf('year');
        this.filters.push(applyComparison(comparison, 'createdAt', startDate, endDate));
        break;
      case 'custom_date':
        if (createdAt.startDate && createdAt.endDate) {
          startDate = DateTime.fromISO(createdAt.startDate).startOf('day');
          endDate = DateTime.fromISO(createdAt.endDate).endOf('day');
          this.filters.push(applyComparison(comparison, 'createdAt', startDate, endDate));
        } else {
          console.warn('Custom date range requires both startDate and endDate');
        }
        break;
      default:
        console.warn(`Unhandled date filter option: ${DateFilterOption}`);
        break;
    }
    console.log(this.filters);
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
