import { requireSession } from '@/lib/session';
import { connectDB } from '@/lib/db';
import { BackupModel } from '../../../../../../../packages/database/src/schemas/Backup';
import { BackupPanel } from '@/components/dashboard/BackupPanel';

export default async function BackupPage({ params }: { params: { guildId: string } }) {
  const session = await requireSession();
  await connectDB();

  const backups = await BackupModel.find({ guildId: params.guildId })
    .select('_id label guildName createdBy createdAt memberCount')
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Server Backup</h1>
        <p className="text-gray-400 mt-1">
          Capture and restore your server structure — roles, channels, settings, bans, emojis and more.
          Max 10 backups per server.
        </p>
      </div>
      <BackupPanel
        guildId={params.guildId}
        userId={session.user.id}
        backups={backups.map(b => ({ ...b, _id: (b._id as any).toString() }))}
      />
    </div>
  );
}
