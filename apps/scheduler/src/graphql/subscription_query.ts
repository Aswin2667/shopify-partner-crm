export const SUBSCRIPTION_CHARGE_QUERY = (
  appId: string,
  lastOccurredAt: string | null
) => `
  query subscriptionEvents {
    app(id: "gid://partners/App/${appId}") {
      id
      events(
        first: 100
        types: [
          SUBSCRIPTION_CHARGE_ACCEPTED,
          SUBSCRIPTION_CHARGE_ACTIVATED,
          SUBSCRIPTION_CHARGE_CANCELED,
          SUBSCRIPTION_CHARGE_DECLINED,
          SUBSCRIPTION_CHARGE_EXPIRED,
          SUBSCRIPTION_CHARGE_FROZEN,
          SUBSCRIPTION_CHARGE_UNFROZEN
        ]
        ${lastOccurredAt && lastOccurredAt !== 'none' ? `occurredAtMax: "${lastOccurredAt}"` : ''}
      ) {
        edges {
          node {
            ...subscriptionChargeAccepted
            ...subscriptionChargeActivated
            ...subscriptionChargeCanceled
            ...subscriptionChargeDeclined
            ...subscriptionChargeExpired
            ...subscriptionChargeFrozen
            ...subscriptionChargeUnfrozen
          }
          cursor
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  }

  fragment subscriptionChargeAccepted on SubscriptionChargeAccepted {
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

  fragment subscriptionChargeActivated on SubscriptionChargeActivated {
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

  fragment subscriptionChargeCanceled on SubscriptionChargeCanceled {
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

  fragment subscriptionChargeDeclined on SubscriptionChargeDeclined {
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

  fragment subscriptionChargeExpired on SubscriptionChargeExpired {
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

  fragment subscriptionChargeFrozen on SubscriptionChargeFrozen {
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

  fragment subscriptionChargeUnfrozen on SubscriptionChargeUnfrozen {
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
`;


export const SUBSCRIPTION_CHARGE_AFTER_QUERY = (
  appId: string,
  occurredAtMin: string | null
) => `
  query subscriptionEventsAfter {
    app(id: "gid://partners/App/${appId}") {
      id
      events(
        first: 100
        types: [
          SUBSCRIPTION_CHARGE_ACCEPTED,
          SUBSCRIPTION_CHARGE_ACTIVATED,
          SUBSCRIPTION_CHARGE_CANCELED,
          SUBSCRIPTION_CHARGE_DECLINED,
          SUBSCRIPTION_CHARGE_EXPIRED,
          SUBSCRIPTION_CHARGE_FROZEN,
          SUBSCRIPTION_CHARGE_UNFROZEN
        ]
        ${occurredAtMin ? `occurredAtMin: "${occurredAtMin}"` : ''}
      ) {
        edges {
          node {
            ...subscriptionChargeAccepted
            ...subscriptionChargeActivated
            ...subscriptionChargeCanceled
            ...subscriptionChargeDeclined
            ...subscriptionChargeExpired
            ...subscriptionChargeFrozen
            ...subscriptionChargeUnfrozen
          }
          cursor
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  }

  fragment subscriptionChargeAccepted on SubscriptionChargeAccepted {
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

  fragment subscriptionChargeActivated on SubscriptionChargeActivated {
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

  fragment subscriptionChargeCanceled on SubscriptionChargeCanceled {
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

  fragment subscriptionChargeDeclined on SubscriptionChargeDeclined {
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

  fragment subscriptionChargeExpired on SubscriptionChargeExpired {
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

  fragment subscriptionChargeFrozen on SubscriptionChargeFrozen {
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

  fragment subscriptionChargeUnfrozen on SubscriptionChargeUnfrozen {
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
`;
