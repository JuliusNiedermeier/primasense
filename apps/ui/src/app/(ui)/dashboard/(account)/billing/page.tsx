import { PageHeader, PageHeaderBreadcrumbs, PageHeaderBreadcrumbsItem, PageHeaderSubtitle, PageHeaderTitle } from '@/app/(ui)/_components/page-title';
import { CreditCard } from 'lucide-react';
import { FC } from 'react';
import { CheckoutButton } from './_components/checkout-button';
import { env } from '@/env';
import { createServerAuthContext } from '@/app/(ui)/_utils/create-server-auth-context';
import { ManageSubscriptionButton } from './_components/manage-subscription-button';

const pageTitle = 'Billing';

const BillingPage: FC = async () => {
  const auth = await createServerAuthContext();
  const isSubscribed = !!auth.user?.publicMetadata.stripe_subscription;

  return (
    <PageHeader>
      <PageHeaderBreadcrumbs>
        <PageHeaderBreadcrumbsItem>
          <CreditCard size="16" />
          {pageTitle}
        </PageHeaderBreadcrumbsItem>
      </PageHeaderBreadcrumbs>
      <PageHeaderTitle>{pageTitle}</PageHeaderTitle>
      <PageHeaderSubtitle>Monitor your API cost.</PageHeaderSubtitle>
      {isSubscribed ? (
        <ManageSubscriptionButton returnUrl={`${env.NEXT_PUBLIC_BASE_URL}/dashboard/billing`} />
      ) : (
        <CheckoutButton cancelUrl={`${env.NEXT_PUBLIC_BASE_URL}/dashboard/billing`} successUrl={`${env.NEXT_PUBLIC_BASE_URL}/dashboard/billing/after-checkout`} />
      )}
    </PageHeader>
  );
};

export default BillingPage;
