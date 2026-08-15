import { gql, type TypedDocumentNode } from '@apollo/client';
import type { MyGroupsQuery, MyGroupsQueryVariables } from '@/features/groups/types/groups.query';

export const MY_GROUPS: TypedDocumentNode<MyGroupsQuery, MyGroupsQueryVariables> = gql`
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
