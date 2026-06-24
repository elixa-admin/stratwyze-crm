'use client';

import Breadcrumbs from '@/components/shared/Breadcrumbs';
import PageHeader from '@/components/shared/PageHeader';
import DashboardHome from '@/components/dashboard/DashboardHome';

export default function DashboardPage() {
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard' }]} />
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          subtitle="Sales pipeline at a glance — tasks, metrics, quick actions."
        />
        <DashboardHome />
      </div>
    </div>
  );
}
