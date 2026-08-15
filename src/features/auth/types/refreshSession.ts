export type RefreshSessionResponse = {
  data?: {
    refreshSession?: {
      user?: {
        id: string;
      };
    };
  };
  errors?: { extensions?: { code?: string } }[];
};
