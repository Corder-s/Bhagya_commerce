import type { Metadata } from 'next';
import { constructMetadata } from '@/config/seo';
import { MarketingDashboardView } from '@/features/merchant/marketing/marketing-dashboard-view';

export const metadata: Metadata = constructMetadata({
  title: 'Marketing & Promotions',
  description: 'Manage store promotions, coupons, customer audiences, and multichannel campaigns.',
  path: '/merchant/marketing',
  noIndex: true,
});

export default function MerchantMarketingPage() {
  return <MarketingDashboardView />;
}
