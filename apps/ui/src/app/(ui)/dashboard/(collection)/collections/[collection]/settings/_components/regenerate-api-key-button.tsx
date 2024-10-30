'use client';

import { Button } from '@/app/(ui)/_components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { FC } from 'react';
import { regenerateApiKey } from '../_server-actions/regenerate-api-key';

type RegenerateApiKeyButtonProps = {
  collectionId: string;
};

export const RegenerateApiKeyButton: FC<RegenerateApiKeyButtonProps> = ({ collectionId }) => {
  const regenerateApiKeyMutation = useMutation({ mutationFn: () => regenerateApiKey(collectionId) });

  return <Button onClick={() => regenerateApiKeyMutation.mutate()}>{regenerateApiKeyMutation.isLoading && <Loader2 size="16" className="gap-4 animate-spin" />}Regenerate</Button>;
};
