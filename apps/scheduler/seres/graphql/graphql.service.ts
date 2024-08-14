// graphql.service.ts

import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { getShopifyEventsQuery, SHOPIFY_GRAPHQL_URL, ACCESS_TOKEN } from './queries/shopify-queries';

@Injectable()
export class GraphQLService {
  // async fetchShopifyEvents(cursor: string | null): Promise<any[]> {
  //   const query = getShopifyEventsQuery(cursor);

  //   try {
  //     const response = await axios.post(
  //       SHOPIFY_GRAPHQL_URL,
  //       { query, variables: { cursor } },
  //       { headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': ACCESS_TOKEN } },
  //     );

  //     const { edges, pageInfo } = response.data.data?.app?.events || { edges: [], pageInfo: { hasNextPage: false } };
  //     // return { edges, pageInfo };
  //   } catch (error) {
  //     throw new Error(`Failed to fetch Shopify events: ${error.message}`);
  //   }
  // }
}
