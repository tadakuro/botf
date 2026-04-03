import { requireSession } from '@/lib/session';
import { Sidebar } from '@/components/dashboard/Sidebar';

export default async function GuildLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { guildId: string };
}) {
  await requireSession();
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Sidebar guildId={params.guildId} />
      <div className="flex-1 p-8 overflow-auto">{children}</div>
    </div>
  );
}
