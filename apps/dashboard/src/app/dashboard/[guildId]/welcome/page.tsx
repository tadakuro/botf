import { requireSession } from '@/lib/session';
import { connectDB } from '@/lib/db';
import { GuildModel } from '../../../../../../../packages/database/src/schemas/Guild';
import { getGuildChannels } from '@/lib/discord';
import { WelcomeForm } from '@/components/dashboard/WelcomeForm';

export default async function WelcomePage({ params }: { params: { guildId: string } }) {
  await requireSession();
  await connectDB();

  const [settings, channels] = await Promise.all([
    GuildModel.findOne({ guildId: params.guildId }).lean(),
    getGuildChannels(params.guildId),
  ]);

  const textChannels = (channels as any[]).filter(c => c.type === 0);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome & Goodbye</h1>
        <p className="text-gray-400 mt-1">Configure join and leave messages</p>
      </div>
      <WelcomeForm guildId={params.guildId} settings={settings as any} channels={textChannels} />
    </div>
  );
}
