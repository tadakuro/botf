import { requireSession } from '@/lib/session';
import { connectDB } from '@/lib/db';
import { CommandPermissionModel } from '../../../../../../../packages/database/src/schemas/CommandPermission';
import { getGuildRoles } from '@/lib/discord';
import { PermissionsPanel } from '@/components/dashboard/PermissionsPanel';

const CATEGORIES = ['moderation', 'utility', 'settings', 'fun'];
const COMMANDS: Record<string, string[]> = {
  moderation: ['ban','unban','kick','mute','unmute','timeout','warn','warnings','purgewarnings','clear','slowmode','lock','unlock','nickname','role','unrole','jail','unjail','massban','masskick','lockdown','unlockdown'],
  utility: ['ping','avatar','banner','userinfo','serverinfo','roleinfo','channelinfo','botinfo','uptime','stats','help','say','embed','snipe','editsnipe','afk','reminder','reminderlist','translate','calculator','timestamp'],
  settings: ['prefix','language','welcome','goodbye','autorole','modlog','logs','verification','ticket','starboard','levels','backup'],
  fun: ['poll','giveaway','coinflip','dice','rate','8ball','ship','meme','trivia'],
};

export default async function PermissionsPage({ params }: { params: { guildId: string } }) {
  await requireSession();
  await connectDB();

  const [permissions, roles] = await Promise.all([
    CommandPermissionModel.find({ guildId: params.guildId }).lean(),
    getGuildRoles(params.guildId),
  ]);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Command Permissions</h1>
        <p className="text-gray-400 mt-1">Control which roles can use each command or category</p>
      </div>
      <PermissionsPanel
        guildId={params.guildId}
        categories={CATEGORIES}
        commands={COMMANDS}
        permissions={permissions as any[]}
        roles={roles}
      />
    </div>
  );
}
