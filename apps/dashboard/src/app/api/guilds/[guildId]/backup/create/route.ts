import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { connectDB } from '@/lib/db';
import { BackupModel } from '../../../../../../../../packages/database/src/schemas/Backup';
import { GuildModel } from '../../../../../../../../packages/database/src/schemas/Guild';

export async function POST(req: NextRequest, { params }: { params: { guildId: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { label, createdBy } = await req.json();
  if (!label?.trim()) return NextResponse.json({ error: 'Label required' }, { status: 400 });

  await connectDB();

  const count = await BackupModel.countDocuments({ guildId: params.guildId });
  if (count >= 10) return NextResponse.json({ error: 'Maximum of 10 backups reached.' }, { status: 400 });

  const settings = await GuildModel.findOne({ guildId: params.guildId }).lean() as any;

  // Dashboard backup captures DB-level data only (no live Discord API calls from Next.js).
  // Full structural backup (roles/channels) must be triggered via the bot.
  // Here we capture the BotForge config snapshot.
  const backup = await BackupModel.create({
    guildId: params.guildId,
    guildName: params.guildId, // will be enriched by bot
    createdBy,
    label: label.trim(),
    memberCount: 0,
    serverSettings: {
      name: '', description: null, iconURL: null, bannerURL: null, splashURL: null,
      verificationLevel: 0, defaultMessageNotifications: 0, explicitContentFilter: 0,
      afkTimeout: 60, afkChannelName: null, systemChannelName: null,
      preferredLocale: 'en-US', features: [],
    },
    botforgeSettings: {
      prefix: settings?.prefix ?? '!',
      language: settings?.language ?? 'en',
      modLogChannel: settings?.modLogChannel ?? null,
      logChannel: settings?.logChannel ?? null,
      welcomeChannel: settings?.welcomeChannel ?? null,
      welcomeMessage: settings?.welcomeMessage ?? null,
      goodbyeChannel: settings?.goodbyeChannel ?? null,
      goodbyeMessage: settings?.goodbyeMessage ?? null,
      autoRoles: settings?.autoRoles ?? [],
      muteRole: settings?.muteRole ?? null,
      jailRole: settings?.jailRole ?? null,
      antiNukeEnabled: settings?.antiNukeEnabled ?? false,
      antiRaidEnabled: settings?.antiRaidEnabled ?? false,
      autoModEnabled: settings?.autoModEnabled ?? false,
      antiInviteEnabled: settings?.antiInviteEnabled ?? false,
      antiSpamEnabled: settings?.antiSpamEnabled ?? false,
    },
    roles: [], categories: [], channels: [], emojis: [], stickers: [], bans: [],
  });

  return NextResponse.json({
    backup: {
      _id: backup._id.toString(),
      label: backup.label,
      guildName: backup.guildName,
      createdBy: backup.createdBy,
      createdAt: backup.createdAt,
      memberCount: backup.memberCount,
    },
  });
}
