// // src/queries/credit-events-query.ts

// export const CREDIT_EVENTS_QUERY = (appId: string, lastOccurredAt: string | null) => `
//   query creditEvents {
//     app(id: "${appId}") {
//       id
//       events(
//         first: 100
//         types: [CREDIT_APPLIED, CREDIT_FAILED, CREDIT_PENDING]
//         ${lastOccurredAt && lastOccurredAt !== 'none' ? `occurredAtMax: "${lastOccurredAt}"` : ''}
//       ) {
//         edges {
//           node {
//             ...creditEventDetails
//           }
//           cursor
//         }
//         pageInfo {
//           hasNextPage
//         }
//       }
//     }
//   }

//   fragment creditEventDetails on AppEvent {
//     ... on CreditApplied {
//       type
//       shop {
//         id
//         myshopifyDomain
//         avatarUrl
//         name
//         __typename
//       }
//       occurredAt
//     }
//     ... on CreditFailed {
//       type
//       shop {
//         id
//         myshopifyDomain
//         avatarUrl
//         name
//         __typename
//       }
//       occurredAt
//     }
//     ... on CreditPending {
//       type
//       shop {
//         id
//         myshopifyDomain
//         avatarUrl
//         name
//         __typename
//       }
//       occurredAt
//     }
//   }
// `;
