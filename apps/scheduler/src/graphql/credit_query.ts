export const CREDIT_EVENTS_QUERY = (
    appId: string,
    lastOccurredAt: string | null
  ) => `
    query creditEvents {
      app(id: "gid://partners/App/${appId}") {
        id
        events(
          first: 100
          types: [
            CREDIT_APPLIED,
            CREDIT_FAILED,
            CREDIT_PENDING
          ]
          ${lastOccurredAt && lastOccurredAt !== 'none' ? `occurredAtMax: "${lastOccurredAt}"` : ''}
        ) {
          edges {
            node {
              ...creditApplied
              ...creditFailed
              ...creditPending
            }
            cursor
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    }
  
    fragment creditApplied on CreditApplied {
      type
      shop {
        id
        myshopifyDomain
        name
      }
      appCredit {
        amount {
          amount
          currencyCode
        }
        id
        name
        test
      }
      occurredAt
    }
  
    fragment creditFailed on CreditFailed {
      type
      shop {
        id
        myshopifyDomain
        name
      }
      occurredAt
    }
  
    fragment creditPending on CreditPending {
      type
      shop {
        id
        myshopifyDomain
        name
      }
      occurredAt
    }
  `;
  

  export const CREDIT_EVENTS_AFTER_QUERY = (
    appId: string,
    occurredAtMin: string | null
  ) => `
    query creditEventsAfter {
      app(id: "gid://partners/App/${appId}") {
        id
        events(
          first: 100
          types: [
            CREDIT_APPLIED,
            CREDIT_FAILED,
            CREDIT_PENDING
          ]
          ${occurredAtMin ? `occurredAtMin: "${occurredAtMin}"` : ''}
        ) {
          edges {
            node {
              ...creditApplied
              ...creditFailed
              ...creditPending
            }
            cursor
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    }
  
    fragment creditApplied on CreditApplied {
      type
      shop {
        id
        myshopifyDomain
        name
      }
      appCredit {
        amount {
          amount
          currencyCode
        }
        id
        name
        test
      }
      occurredAt
    }
  
    fragment creditFailed on CreditFailed {
      type
      shop {
        id
        myshopifyDomain
        name
      }
      occurredAt
    }
  
    fragment creditPending on CreditPending {
      type
      shop {
        id
        myshopifyDomain
        name
      }
      occurredAt
    }
  `;
  