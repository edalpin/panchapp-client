import { gql } from '@apollo/client';

export const MY_GROUPS = gql`
  query MyGroups($first: Int, $after: String) {
    myGroups(first: $first, after: $after) {
      nodes {
        id
        name
        isPersonal
        status
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;
