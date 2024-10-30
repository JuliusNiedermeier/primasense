import { currentUser } from '@clerk/nextjs';
import { AuthContext } from '@/core/auth-context';
import { drizzle } from '@/core/services/drizzle';
import { and, eq, inArray } from 'drizzle-orm';
import { Collection } from '@/core/ressources/schema.drizzle';

export const createServerAuthContext = async (): Promise<AuthContext> => {
  const user = await currentUser();

  const hasCollectionAccess: AuthContext['hasCollectionAccess'] = async (collectionIDs: string[]) => {
    if (!user) return false;

    const collections = await drizzle.query.Collection.findMany({
      where: and(eq(Collection.userId, user.id), inArray(Collection.id, collectionIDs)),
      columns: { id: true },
    });

    return collections.length === collectionIDs.length;
  };

  return { user, hasCollectionAccess };
};
