'use client';

import { Button } from '@/app/(ui)/_components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { FC } from 'react';
import { redirectToUserPortal } from '@/app/(ui)/dashboard/(account)/billing/_server-actions/redirect-to-user-portal';

type CheckoutButtonProps = {
  returnUrl: string;
};

export const ManageSubscriptionButton: FC<CheckoutButtonProps> = ({ returnUrl }) => {
  const redirectToUserPortalMutation = useMutation({ mutationFn: () => redirectToUserPortal({ returnUrl }) });

  return (
    <Button onClick={() => redirectToUserPortalMutation.mutate()}>
      {redirectToUserPortalMutation.isLoading && <Loader2 size="16" className="gap-4 animate-spin" />}
      Manage subscription
    </Button>
  );
};
