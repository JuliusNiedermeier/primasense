import { Prettify } from '@/utils/type-utils';
import { z } from 'zod';

export const ClerkPublicMetadataSchema = z.object({ stripe_customer: z.string().optional(), stripe_subscription: z.string().optional() });
export type ClerkPublicMetadata = Prettify<z.infer<typeof ClerkPublicMetadataSchema>>;

declare global {
  interface CustomJwtSessionClaims {
    public_metadata: z.infer<typeof ClerkPublicMetadataSchema>;
  }
}
