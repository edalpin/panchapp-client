import type { GroupConnection } from '@/features/groups/types/group';

export type MyGroupsQuery = {
  myGroups: GroupConnection;
};

export type MyGroupsQueryVariables = {
  first?: number;
  after?: string;
};
