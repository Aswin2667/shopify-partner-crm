// src/queries/shopify-queries.ts

export const APP_INSTALLS_UNINSTALLS_QUERY = (appId: string, lastOccurredAt: string | null) => `
  query appInstallsAndUninstalls {
    app(id: "gid://partners/App/${appId}") {
      id
      events(
        first: 100
        types: [RELATIONSHIP_INSTALLED, RELATIONSHIP_UNINSTALLED]
        ${lastOccurredAt && (lastOccurredAt !== 'none') ? `occurredAtMax: "${lastOccurredAt}"` : ''}
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


export const APP_INSTALLS_UNINSTALLS_AFTER_QUERY = (appId: string, occurredAtMin: string | null) => `
  query appInstallsAndUninstallsAfter {
    app(id: "gid://partners/App/${appId}") {
      id
      events(
        first: 100
        types: [RELATIONSHIP_INSTALLED, RELATIONSHIP_UNINSTALLED]
        ${occurredAtMin ? `occurredAtMin: "${occurredAtMin}"` : ''}
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
