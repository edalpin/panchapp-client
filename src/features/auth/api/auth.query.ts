import { gql, type TypedDocumentNode } from '@apollo/client';
import type { MeQuery } from '@/features/auth/types/auth.query';

export const ME: TypedDocumentNode<MeQuery, Record<string, never>> = gql`
  query Me {
    me {
      id
      email
      name
    }
  }
`;
