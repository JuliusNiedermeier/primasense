'use server';

import { createServerAuthContext } from '@/app/(ui)/_utils/create-server-auth-context';
import { createVideo as _createVideo } from '@/core/ressources/video/actions/video-upload/create-video';
import { revalidatePath } from 'next/cache';

export const createVideo = async (title: string, collectionID: string) => {
  const auth = await createServerAuthContext();
  const result = await _createVideo(auth, { title, collectionID });
  revalidatePath(`/dashboard/collections/${collectionID}/videos`);
  return result;
};
