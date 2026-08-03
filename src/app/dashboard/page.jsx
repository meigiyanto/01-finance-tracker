import DashboardClient from './dashboard-client';

export const metadata = {
  title: 'Dashboard | Finance Tracker',
  description: 'Ringkasan keuangan Anda di Finance Tracker.',
};

export default function DashboardPage() {
  return <DashboardClient />;
}
