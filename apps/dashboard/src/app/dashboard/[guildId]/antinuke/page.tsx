import { requireSession } from '@/lib/session';
import { connectDB } from '@/lib/db';
import { AntiNukeModel } from '@botforge/database/src/schemas/AntiNuke';
import { getGuildRoles } from '@/lib/discord';
import { AntiNukeForm } from '@/components/dashboard/AntiNukeForm';

export default async function AntiNukePage({ params }: { params: { guildId: string } }) {
  await requireSession();
  await connectDB();

  const [config, roles] = await Promise.all([
    AntiNukeModel.findOne({ guildId: params.guildId }).lean(),
    getGuildRoles(params.guildId),
  ]);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">AntiNuke</h1>
        <p className="text-gray-400 mt-1">Protect your server from nuke attacks</p>
      </div>
      <AntiNukeForm guildId={params.guildId} config={config as any} roles={roles} />
    </div>
  );
}
