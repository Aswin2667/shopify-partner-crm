export const SHOPIFY_GRAPHQL_URL = 'https://partners.shopify.com/3767841/api/2024-10/graphql.json';
export const ACCESS_TOKEN = 'prtapi_c37b0344cace141df5c89f694f4c15aa';
export const APP_ID = 'gid://partners/App/146380521473';

export const getShopifyEventsQuery = (cursor: string | null) => `
query appInstallsAndUninstalls {
app(id: "gid://partners/App/146380521473") {
 id
 
 events(
  first: 100
  types: [RELATIONSHIP_INSTALLED, RELATIONSHIP_UNINSTALLED]
 ) {
  edges {
   node {
    ...installs
   }
   cursor
  }
  pageInfo {
   hasNextPage
  }
 }
}
}

fragment installs on AppEvent {
... on RelationshipInstalled {
 shop {
  id
  myshopifyDomain
  avatarUrl
  name
  __typename
 }
 occurredAt
 type
}
... on RelationshipUninstalled {
 type
 shop {
  id
  myshopifyDomain
  avatarUrl
  name
  __typename
 }
 reason
}

}
`;
