import { requireSession } from '@/lib/session';
import { connectDB } from '@/lib/db';
import { GuildModel } from '../../../../../../../packages/database/src/schemas/Guild';
import { getGuildRoles, getGuildChannels } from '@/lib/discord';
import { ModerationSettingsForm } from '@/components/dashboard/ModerationSettingsForm';

export default async function ModerationPage({ params }: { params: { guildId: string } }) {
  await requireSession();
  await connectDB();

  const [settings, roles, channels] = await Promise.all([
    GuildModel.findOne({ guildId: params.guildId }).lean(),
    getGuildRoles(params.guildId),
    getGuildChannels(params.guildId),
  ]);

  const textChannels = (channels as any[]).filter(c => c.type === 0);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Moderation</h1>
        <p className="text-gray-400 mt-1">Configure moderation roles and log channels</p>
      </div>
      <ModerationSettingsForm
        guildId={params.guildId}
        settings={settings as any}
        roles={roles}
        channels={textChannels}
      />
    </div>
  );
}
