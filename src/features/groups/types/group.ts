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
