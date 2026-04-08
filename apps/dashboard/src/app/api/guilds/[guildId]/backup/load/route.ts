import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { connectDB } from '@/lib/db';
import { BackupModel } from '@botforge/database/src/schemas/Backup';
import { GuildModel } from '@botforge/database/src/schemas/Guild';

export async function POST(req: NextRequest, { params }: any) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { backupId, options } = await req.json();
  await connectDB();

  const backup = await BackupModel.findById(backupId).lean() as any;
  if (!backup) return NextResponse.json({ error: 'Backup not found' }, { status: 404 });
  if (backup.guildId !== params.guildId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const restored: string[] = [];
  const errors: string[] = [];

  // ── BotForge DB settings (no bot required) ──
  if (options?.restoreBotforgeSettings && backup.botforgeSettings) {
    try {
      await GuildModel.findOneAndUpdate(
        { guildId: params.guildId },
        { $set: backup.botforgeSettings },
        { upsert: true },
      );
      restored.push('BotForge settings');
    } catch (err: any) {
      errors.push(`BotForge settings: ${err.message}`);
    }
  }

  // ── Mark backup as pending structural restore ──
  // The bot polls this flag on next interaction and runs backupService.loadBackup()
  const structuralRequested = ['restoreRoles', 'restoreChannels', 'restoreBans', 'restoreEmojis', 'restoreSettings']
    .filter(k => options?.[k]);

  if (structuralRequested.length > 0) {
    try {
      await BackupModel.findByIdAndUpdate(backupId, {
        $set: {
          pendingRestore: {
            requestedAt: new Date(),
            requestedBy: session.user.id,
            options,
          },
        },
      });
      restored.push(`Structural restore queued (${structuralRequested.join(', ')}). The bot will apply it within 60 seconds.`);
    } catch (err: any) {
      errors.push(`Failed to queue restore: ${err.message}`);
    }
  }

  return NextResponse.json({ result: { restored, errors } });
}
