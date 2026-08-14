import { gql } from '@apollo/client';

export type GroupStatus = 'ACTIVE' | 'ARCHIVED';

export type Group = {
  id: string;
  name: string;
  isPersonal: boolean;
  status: GroupStatus;
};

export type PageInfo = {
  endCursor: string | null;
  hasNextPage: boolean;
};

export type GroupConnection = {
  nodes: Group[];
  pageInfo: PageInfo;
};

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

export type MyGroupsQuery = {
  myGroups: GroupConnection;
};

export type MyGroupsQueryVariables = {
  first?: number;
  after?: string;
};
