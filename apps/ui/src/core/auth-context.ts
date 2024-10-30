import { User } from '@clerk/nextjs/server';

export type AuthContext = {
  user: User | null;
  hasCollectionAccess: (collectionIDs: string[]) => Promise<boolean>;
};
