import type { GroupConnection } from './group';

export type MyGroupsQuery = {
  myGroups: GroupConnection;
};

export type MyGroupsQueryVariables = {
  first?: number;
  after?: string;
};
