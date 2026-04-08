import { requireSession } from '@/lib/session';
import { connectDB } from '@/lib/db';
import { GuildModel } from '@botforge/database/src/schemas/Guild';
import { AutoModForm } from '@/components/dashboard/AutoModForm';

export default async function AutoModPage({ params }: { params: { guildId: string } }) {
  await requireSession();
  await connectDB();
  const settings = await GuildModel.findOne({ guildId: params.guildId }).lean();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">AutoMod</h1>
        <p className="text-gray-400 mt-1">Automated moderation and protection toggles</p>
      </div>
      <AutoModForm guildId={params.guildId} settings={settings as any} />
    </div>
  );
}
