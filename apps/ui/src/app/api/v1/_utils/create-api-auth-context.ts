import { AuthContext } from '@/core/auth-context';
import { drizzle } from '@/core/services/drizzle';
import { and, eq, inArray } from 'drizzle-orm';
import { headers } from 'next/headers';
import { Collection } from '@/core/ressources/schema.drizzle';

export const createApiAuthContext = async (): Promise<AuthContext> => {
  const apiKey = headers().get('authorization');

  const hasCollectionAccess: AuthContext['hasCollectionAccess'] = async (collectionIDs: string[]) => {
    if (!apiKey) return false;

    const collections = await drizzle.query.Collection.findMany({
      where: and(eq(Collection.apiKey, apiKey), inArray(Collection.id, collectionIDs)),
      columns: { id: true },
    });

    return collections.length === collectionIDs.length;
  };

  return { user: null, hasCollectionAccess };
};
