// src/queries/shopify-queries.ts

export const APP_INSTALLS_UNINSTALLS_QUERY = (appId: string, lastOccurredAt: string | null) => `
  query appInstallsAndUninstalls {
    app(id: "gid://partners/App/${appId}") {
      id
      events(
        first: 100
        types: [RELATIONSHIP_INSTALLED, RELATIONSHIP_UNINSTALLED, CREDIT_APPLIED, CREDIT_FAILED, CREDIT_PENDING, SUBSCRIPTION_CHARGE_ACTIVATED]
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
      ... on SubscriptionChargeActivated {
 type
 shop {
  id
  myshopifyDomain
 }
 charge{
    amount{
        amount
        currencyCode
    }
    billingOn
    id
    name
    test
 }
    occurredAt
}

    ... on CreditApplied {
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
    ... on CreditFailed {
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
    ... on CreditPending {
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



