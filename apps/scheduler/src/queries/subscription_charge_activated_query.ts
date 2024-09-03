export const SUBSCRIPTION_CHARGE_ACTIVATED_QUERY = (
    appId: string,
    occurredAtMin: string | null
  ) => `
    query subscriptionChargeActivated {
      app(id: "gid://partners/App/${appId}") {
        id
        events(
          first: 100
          types: [SUBSCRIPTION_CHARGE_ACTIVATED]
          ${occurredAtMin ? `occurredAtMin: "${occurredAtMin}"` : ''}
        ) {
          edges {
            node {
              ...subscriptionChargeActivated
            }
            cursor
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    }
  
    fragment subscriptionChargeActivated on AppEvent {
      ... on SubscriptionChargeActivated {
        type
        shop {
          id
          myshopifyDomain
        }
        charge {
          amount {
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
    }
  `;
  