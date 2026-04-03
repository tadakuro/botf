import { requireSession } from '@/lib/session';
import { connectDB } from '@/lib/db';
import { WarningModel } from '../../../../../../../packages/database/src/schemas/Warning';
import { AntiNukeModel } from '../../../../../../../packages/database/src/schemas/AntiNuke';

export default async function LogsPage({ params }: { params: { guildId: string } }) {
  await requireSession();
  await connectDB();

  const [warnings, antiNukeConfig] = await Promise.all([
    WarningModel.find({ guildId: params.guildId }).sort({ createdAt: -1 }).limit(50).lean(),
    AntiNukeModel.findOne({ guildId: params.guildId }).lean(),
  ]);

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Logs</h1>
        <p className="text-gray-400 mt-1">Moderation history and server protection status</p>
      </div>

      <div className="card space-y-3">
        <h2 className="text-base font-semibold text-white">AntiNuke Status</h2>
        {antiNukeConfig ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Status', value: (antiNukeConfig as any).enabled ? 'Enabled' : 'Disabled', color: (antiNukeConfig as any).enabled ? 'text-green-400' : 'text-red-400' },
              { label: 'Punishment', value: (antiNukeConfig as any).punishment, color: 'text-white' },
              { label: 'Whitelisted', value: `${(antiNukeConfig as any).whitelist?.length ?? 0} roles`, color: 'text-white' },
              { label: 'Ban threshold', value: `${(antiNukeConfig as any).thresholds?.ban ?? 3} actions`, color: 'text-white' },
            ].map(item => (
              <div key={item.label} className="bg-surface rounded-lg p-3">
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className={`text-sm font-semibold mt-0.5 capitalize ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">AntiNuke not configured. Set it up in the AntiNuke page.</p>
        )}
      </div>

      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Warning Log</h2>
          <span className="text-xs text-gray-500">Last {warnings.length} entries</span>
        </div>
        {warnings.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-6">No warnings on record.</p>
        ) : (
          <div className="divide-y divide-surface-border">
            {warnings.map((w: any) => (
              <div key={w._id.toString()} className="py-3 flex items-start gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-900/40 text-yellow-400 border border-yellow-800">
                      Warning
                    </span>
                    <code className="text-brand text-xs">{w.userId}</code>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{w.reason}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    By <code className="text-gray-400">{w.moderatorId}</code> · {new Date(w.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
