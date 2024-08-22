// src/queries/shopify-queries.ts

export const APP_INSTALLS_UNINSTALLS_QUERY = (appId: string, lastOccurredAt: string | null) => `
  query appInstallsAndUninstalls {
    app(id: "gid://partners/App/${appId}") {
      id
      events(
        first: 100
        types: [RELATIONSHIP_INSTALLED, RELATIONSHIP_UNINSTALLED]
        ${lastOccurredAt && lastOccurredAt !== 'none' ? `occurredAtMax: "${lastOccurredAt}"` : ''}
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
      type
      shop {
        id
        myshopifyDomain
        avatarUrl
        name
        __typename
      }
      occurredAt
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
      occurredAt
      reason
    }
  }
`;
