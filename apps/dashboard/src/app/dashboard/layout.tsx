import { requireSession } from '@/lib/session';
import { TopNav } from '@/components/dashboard/TopNav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireSession();
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}
