// src/queries/shopify-queries.ts

export const APP_INSTALLS_UNINSTALLS_QUERY = (
  appId: string,
  lastOccurredAt: string | null
) => `
  query appInstallsAndUninstalls {
    app(id: "gid://partners/App/${appId}") {
      id
      events(
        first: 100
        types: [
          RELATIONSHIP_INSTALLED,
          RELATIONSHIP_UNINSTALLED,
          RELATIONSHIP_DEACTIVATED,
          RELATIONSHIP_REACTIVATED,
        ]
        ${lastOccurredAt && (lastOccurredAt !== 'none') ? `occurredAtMax: "${lastOccurredAt}"` : ''}
      ) {
        edges {
          node {
            ...relationshipInstalled
            ...relationshipUninstalled
            ...relationshipDeactivated
            ...relationshipReactivated
          }
          cursor
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  }

  fragment relationshipInstalled on AppEvent {
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
  }

  fragment relationshipUninstalled on AppEvent {
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



  fragment relationshipDeactivated on AppEvent {
    ... on RelationshipDeactivated {
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
  }

  fragment relationshipReactivated on AppEvent {
    ... on RelationshipReactivated {
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
  }
`;

export const APP_INSTALLS_UNINSTALLS_AFTER_QUERY = (
  appId: string,
  occurredAtMin: string | null
) => `
  query appInstallsAndUninstallsAfter {
    app(id: "gid://partners/App/${appId}") {
      id
      events(
        first: 100
        types: [
          RELATIONSHIP_INSTALLED,
          RELATIONSHIP_UNINSTALLED,
          RELATIONSHIP_DEACTIVATED,
          RELATIONSHIP_REACTIVATED,
        ]
        ${occurredAtMin ? `occurredAtMin: "${occurredAtMin}"` : ''}
      ) {
        edges {
          node {
            ...relationshipInstalled
            ...relationshipUninstalled
            ...relationshipDeactivated
            ...relationshipReactivated
          }
          cursor
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  }

  fragment relationshipInstalled on AppEvent {
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
  }

  fragment relationshipUninstalled on AppEvent {
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


  fragment relationshipDeactivated on AppEvent {
    ... on RelationshipDeactivated {
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
  }

  fragment relationshipReactivated on AppEvent {
    ... on RelationshipReactivated {
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
  }
`;
