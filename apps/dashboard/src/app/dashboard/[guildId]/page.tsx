import { requireSession } from '@/lib/session';
import { connectDB } from '@/lib/db';
import { GuildModel } from '../../../../../../packages/database/src/schemas/Guild';
import { WarningModel } from '../../../../../../packages/database/src/schemas/Warning';
import { BackupModel } from '../../../../../../packages/database/src/schemas/Backup';
import { StatCard } from '@/components/dashboard/StatCard';

export default async function GuildOverviewPage({ params }: { params: { guildId: string } }) {
  await requireSession();
  await connectDB();

  const [settings, warningCount, backupCount] = await Promise.all([
    GuildModel.findOne({ guildId: params.guildId }).lean(),
    WarningModel.countDocuments({ guildId: params.guildId }),
    BackupModel.countDocuments({ guildId: params.guildId }),
  ]);

  const features = [
    { label: 'AntiNuke', enabled: (settings as any)?.antiNukeEnabled ?? false },
    { label: 'AntiRaid', enabled: (settings as any)?.antiRaidEnabled ?? false },
    { label: 'AutoMod', enabled: (settings as any)?.autoModEnabled ?? false },
    { label: 'Anti-Invite', enabled: (settings as any)?.antiInviteEnabled ?? false },
    { label: 'Anti-Spam', enabled: (settings as any)?.antiSpamEnabled ?? false },
    { label: 'Levels', enabled: (settings as any)?.levelsEnabled ?? false },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="text-gray-400 mt-1">Server at a glance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Warnings" value={warningCount} icon="⚠️" />
        <StatCard label="Backups Stored" value={`${backupCount} / 10`} icon="💾" />
        <StatCard label="Prefix" value={(settings as any)?.prefix ?? '!'} icon="⌨️" />
      </div>

      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-white">Feature Status</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {features.map(f => (
            <div key={f.label} className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${f.enabled ? 'bg-green-400' : 'bg-gray-600'}`} />
              <span className="text-sm text-gray-300">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
