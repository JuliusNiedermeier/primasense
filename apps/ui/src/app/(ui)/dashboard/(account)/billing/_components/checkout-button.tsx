'use client';

import { Button } from '@/app/(ui)/_components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { FC } from 'react';
import { redirectToCheckout } from '../_server-actions/redirect-to-checkout';

type CheckoutButtonProps = {
  successUrl: string;
  cancelUrl: string;
};

export const CheckoutButton: FC<CheckoutButtonProps> = ({ successUrl, cancelUrl }) => {
  const redirectToCheckoutMutation = useMutation({ mutationFn: () => redirectToCheckout({ successUrl, cancelUrl }) });

  return <Button onClick={() => redirectToCheckoutMutation.mutate()}>{redirectToCheckoutMutation.isLoading && <Loader2 size="16" className="gap-4 animate-spin" />}Upgrade</Button>;
};
