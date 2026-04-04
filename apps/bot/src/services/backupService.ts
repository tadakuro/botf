import {
  Guild,
  ChannelType,
  OverwriteType,
  GuildVerificationLevel,
  TextChannel,
  VoiceChannel,
  StageChannel,
  NewsChannel,
  CategoryChannel,
} from 'discord.js';
import { BotClient } from '../client';
import {
  BackupModel,
  IBackup,
  IBackupRole,
  IBackupCategory,
  IBackupChannel,
  IBackupChannelOverwrite,
  IBackupEmoji,
  IBackupSticker,
  IBackupBan,
  IBackupServerSettings,
  IBackupBotforgeSettings,
} from '../../../packages/database/src/schemas/Backup';
import { GuildModel } from './cacheService';
import { logger } from '../utils/logger';

const MAX_BACKUPS_PER_GUILD = 10;

// ─── CREATE ────────────────────────────────────────────────────────────────

export async function captureBackup(
  client: BotClient,
  guild: Guild,
  createdBy: string,
  label: string,
): Promise<IBackup> {
  const count = await BackupModel.countDocuments({ guildId: guild.id });
  if (count >= MAX_BACKUPS_PER_GUILD) {
    throw new Error(`Maximum of ${MAX_BACKUPS_PER_GUILD} backups reached. Delete one first.`);
  }

  await guild.fetch();

  const serverSettings: IBackupServerSettings = {
    name: guild.name,
    description: guild.description,
    iconURL: guild.iconURL({ size: 4096, extension: 'png' }),
    bannerURL: guild.bannerURL({ size: 4096, extension: 'png' }),
    splashURL: guild.splashURL({ size: 4096, extension: 'png' }),
    verificationLevel: guild.verificationLevel,
    defaultMessageNotifications: guild.defaultMessageNotifications,
    explicitContentFilter: guild.explicitContentFilter,
    afkTimeout: guild.afkTimeout,
    afkChannelName: guild.afkChannel?.name ?? null,
    systemChannelName: guild.systemChannel?.name ?? null,
    preferredLocale: guild.preferredLocale,
    features: [...guild.features],
  };

  const guildSettings = await GuildModel.findOne({ guildId: guild.id });
  const botforgeSettings: IBackupBotforgeSettings = {
    prefix: guildSettings?.prefix ?? '!',
    language: guildSettings?.language ?? 'en',
    modLogChannel: resolveChannelName(guild, guildSettings?.modLogChannel),
    logChannel: resolveChannelName(guild, guildSettings?.logChannel),
    welcomeChannel: resolveChannelName(guild, guildSettings?.welcomeChannel),
    welcomeMessage: guildSettings?.welcomeMessage ?? null,
    goodbyeChannel: resolveChannelName(guild, guildSettings?.goodbyeChannel),
    goodbyeMessage: guildSettings?.goodbyeMessage ?? null,
    autoRoles: (guildSettings?.autoRoles ?? [])
      .map((id: string) => guild.roles.cache.get(id)?.name)
      .filter(Boolean) as string[],
    muteRole: guild.roles.cache.get(guildSettings?.muteRole ?? '')?.name ?? null,
    jailRole: guild.roles.cache.get(guildSettings?.jailRole ?? '')?.name ?? null,
    antiNukeEnabled: guildSettings?.antiNukeEnabled ?? false,
    antiRaidEnabled: guildSettings?.antiRaidEnabled ?? false,
    autoModEnabled: guildSettings?.autoModEnabled ?? false,
    antiInviteEnabled: guildSettings?.antiInviteEnabled ?? false,
    antiSpamEnabled: guildSettings?.antiSpamEnabled ?? false,
  };

  const roles: IBackupRole[] = guild.roles.cache
    .filter(r => !r.managed && r.id !== guild.id)
    .sort((a, b) => a.position - b.position)
    .map(r => ({
      name: r.name,
      color: r.color,
      hoist: r.hoist,
      mentionable: r.mentionable,
      permissions: r.permissions.bitfield.toString(),
      position: r.position,
      icon: r.icon ? (r.iconURL({ extension: 'png', size: 256 }) ?? null) : null,
      unicodeEmoji: r.unicodeEmoji ?? null,
    }));

  const categories: IBackupCategory[] = guild.channels.cache
    .filter(c => c.type === ChannelType.GuildCategory)
    .sort((a, b) => (a as CategoryChannel).position - (b as CategoryChannel).position)
    .map(c => ({
      name: c.name,
      position: (c as CategoryChannel).position,
      permissionOverwrites: serializeOverwrites(c as CategoryChannel),
    }));

  const channels: IBackupChannel[] = guild.channels.cache
    .filter(c => c.type !== ChannelType.GuildCategory)
    .sort((a, b) => ((a as any).position ?? 0) - ((b as any).position ?? 0))
    .map(c => {
      const base: IBackupChannel = {
        name: c.name,
        type: c.type,
        position: (c as any).position ?? 0,
        parentName: (c as any).parent?.name ?? undefined,
        permissionOverwrites: serializeOverwrites(c as any),
      };
      if (c.type === ChannelType.GuildText || c.type === ChannelType.GuildAnnouncement) {
        const tc = c as TextChannel | NewsChannel;
        base.topic = tc.topic ?? undefined;
        base.nsfw = tc.nsfw;
        base.rateLimitPerUser = tc.rateLimitPerUser;
      }
      if (c.type === ChannelType.GuildVoice || c.type === ChannelType.GuildStageVoice) {
        const vc = c as VoiceChannel | StageChannel;
        base.userLimit = vc.userLimit;
        base.bitrate = vc.bitrate;
      }
      return base;
    });

  const emojis: IBackupEmoji[] = guild.emojis.cache.map(e => ({
    name: e.name ?? 'unknown',
    url: e.url,
    animated: e.animated ?? false,
    roles: e.roles.cache.map(r => r.name),
  }));

  await guild.stickers.fetch();
  const stickers: IBackupSticker[] = guild.stickers.cache.map(s => ({
    name: s.name,
    description: s.description,
    url: s.url,
  }));

  let bans: IBackupBan[] = [];
  try {
    const banList = await guild.bans.fetch();
    bans = banList.map(b => ({ userId: b.user.id, reason: b.reason ?? null }));
  } catch {
    logger.warn('[Backup] Could not fetch bans (missing BAN_MEMBERS permission)');
  }

  const backup = await BackupModel.create({
    guildId: guild.id,
    guildName: guild.name,
    createdBy,
    label,
    memberCount: guild.memberCount,
    serverSettings,
    botforgeSettings,
    roles,
    categories,
    channels,
    emojis,
    stickers,
    bans,
  });

  logger.info(`[Backup] Created "${label}" for ${guild.name}`);
  return backup as IBackup;
}

// ─── LOAD ──────────────────────────────────────────────────────────────────

export interface LoadOptions {
  restoreRoles: boolean;
  restoreChannels: boolean;
  restoreBans: boolean;
  restoreSettings: boolean;
  restoreEmojis: boolean;
  restoreBotforgeSettings: boolean;
}

export interface LoadResult {
  success: boolean;
  restored: string[];
  errors: string[];
}

export async function loadBackup(
  client: BotClient,
  guild: Guild,
  backupId: string,
  options: LoadOptions,
): Promise<LoadResult> {
  const backup = await BackupModel.findById(backupId) as IBackup | null;
  if (!backup) throw new Error('Backup not found.');
  if (backup.guildId !== guild.id) throw new Error('This backup does not belong to this server.');

  const result: LoadResult = { success: true, restored: [], errors: [] };

  // Server settings
  if (options.restoreSettings) {
    try {
      await guild.edit({
        name: backup.serverSettings.name,
        verificationLevel: backup.serverSettings.verificationLevel as GuildVerificationLevel,
        defaultMessageNotifications: backup.serverSettings.defaultMessageNotifications as any,
        explicitContentFilter: backup.serverSettings.explicitContentFilter as any,
        preferredLocale: backup.serverSettings.preferredLocale as any,
        afkTimeout: backup.serverSettings.afkTimeout as any,
      });
      result.restored.push('Server settings');
    } catch (err: any) {
      result.errors.push(`Server settings: ${err.message}`);
    }
  }

  // Roles
  if (options.restoreRoles) {
    const botHighest = guild.members.me!.roles.highest.position;
    const toDelete = guild.roles.cache.filter(r => !r.managed && r.id !== guild.id && r.position < botHighest);
    for (const [, r] of toDelete) await r.delete('Backup restore').catch(() => {});

    const roleNameToId = new Map<string, string>();
    for (const r of [...backup.roles].sort((a, b) => a.position - b.position)) {
      try {
        const created = await guild.roles.create({
          name: r.name,
          color: r.color,
          hoist: r.hoist,
          mentionable: r.mentionable,
          permissions: BigInt(r.permissions),
          reason: 'Backup restore',
        });
        roleNameToId.set(r.name, created.id);
      } catch (err: any) {
        result.errors.push(`Role "${r.name}": ${err.message}`);
      }
    }
    result.restored.push(`Roles (${roleNameToId.size})`);
  }

  // Channels
  if (options.restoreChannels) {
    for (const [, ch] of guild.channels.cache.filter(c => c.deletable)) {
      await ch.delete('Backup restore').catch(() => {});
    }

    const roleMap = new Map(guild.roles.cache.map(r => [r.name, r.id]));
    const catNameToId = new Map<string, string>();

    for (const cat of [...backup.categories].sort((a, b) => a.position - b.position)) {
      try {
        const created = await guild.channels.create({
          name: cat.name,
          type: ChannelType.GuildCategory,
          permissionOverwrites: deserializeOverwrites(cat.permissionOverwrites, roleMap),
          reason: 'Backup restore',
        });
        catNameToId.set(cat.name, created.id);
      } catch (err: any) {
        result.errors.push(`Category "${cat.name}": ${err.message}`);
      }
    }

    let channelCount = 0;
    for (const ch of [...backup.channels].sort((a, b) => a.position - b.position)) {
      try {
        const parentId = ch.parentName ? catNameToId.get(ch.parentName) : undefined;
        const overwrites = deserializeOverwrites(ch.permissionOverwrites, roleMap);

        if (ch.type === ChannelType.GuildVoice) {
          await guild.channels.create({ name: ch.name, type: ChannelType.GuildVoice, userLimit: ch.userLimit, bitrate: ch.bitrate, parent: parentId, permissionOverwrites: overwrites, reason: 'Backup restore' });
        } else {
          await guild.channels.create({ name: ch.name, type: ch.type as any, topic: ch.topic, nsfw: ch.nsfw, rateLimitPerUser: ch.rateLimitPerUser, parent: parentId, permissionOverwrites: overwrites, reason: 'Backup restore' });
        }
        channelCount++;
      } catch (err: any) {
        result.errors.push(`Channel "${ch.name}": ${err.message}`);
      }
    }
    result.restored.push(`Channels (${channelCount})`);
  }

  // Bans
  if (options.restoreBans) {
    let count = 0;
    for (const ban of backup.bans) {
      try { await guild.bans.create(ban.userId, { reason: ban.reason ?? 'Backup restore' }); count++; } catch {}
    }
    result.restored.push(`Bans (${count})`);
  }

  // Emojis
  if (options.restoreEmojis) {
    for (const [, e] of guild.emojis.cache.filter(e => !e.managed)) {
      await e.delete('Backup restore').catch(() => {});
    }
    let count = 0;
    for (const emoji of backup.emojis) {
      try { await guild.emojis.create({ attachment: emoji.url, name: emoji.name, reason: 'Backup restore' }); count++; } catch {}
    }
    result.restored.push(`Emojis (${count})`);
  }

  // BotForge settings
  if (options.restoreBotforgeSettings) {
    try {
      const roleMap = new Map(guild.roles.cache.map(r => [r.name, r.id]));
      const channelMap = new Map(guild.channels.cache.map(c => [c.name, c.id]));
      const bf = backup.botforgeSettings;
      await GuildModel.findOneAndUpdate({ guildId: guild.id }, {
        $set: {
          prefix: bf.prefix, language: bf.language,
          modLogChannel: bf.modLogChannel ? channelMap.get(bf.modLogChannel) : undefined,
          logChannel: bf.logChannel ? channelMap.get(bf.logChannel) : undefined,
          welcomeChannel: bf.welcomeChannel ? channelMap.get(bf.welcomeChannel) : undefined,
          welcomeMessage: bf.welcomeMessage,
          goodbyeChannel: bf.goodbyeChannel ? channelMap.get(bf.goodbyeChannel) : undefined,
          goodbyeMessage: bf.goodbyeMessage,
          autoRoles: bf.autoRoles.map((n: string) => roleMap.get(n)).filter(Boolean),
          muteRole: bf.muteRole ? roleMap.get(bf.muteRole) : undefined,
          jailRole: bf.jailRole ? roleMap.get(bf.jailRole) : undefined,
          antiNukeEnabled: bf.antiNukeEnabled, antiRaidEnabled: bf.antiRaidEnabled,
          autoModEnabled: bf.autoModEnabled, antiInviteEnabled: bf.antiInviteEnabled,
          antiSpamEnabled: bf.antiSpamEnabled,
        },
      }, { upsert: true });
      result.restored.push('BotForge settings');
    } catch (err: any) {
      result.errors.push(`BotForge settings: ${err.message}`);
    }
  }

  if (result.errors.length > 0) result.success = false;
  logger.info(`[Backup] Loaded "${backup.label}" into ${guild.name}. Restored: ${result.restored.join(', ')}`);
  return result;
}

// ─── HELPERS ───────────────────────────────────────────────────────────────

function resolveChannelName(guild: Guild, channelId?: string): string | null {
  if (!channelId) return null;
  return guild.channels.cache.get(channelId)?.name ?? null;
}

function serializeOverwrites(channel: { permissionOverwrites: { cache: Map<string, any> } }): IBackupChannelOverwrite[] {
  return [...channel.permissionOverwrites.cache.values()].map(o => ({
    id: o.id,
    type: o.type as number,
    allow: o.allow.bitfield.toString(),
    deny: o.deny.bitfield.toString(),
  }));
}

function deserializeOverwrites(overwrites: IBackupChannelOverwrite[], roleMap: Map<string, string>): any[] {
  return overwrites.map(o => ({
    id: o.type === OverwriteType.Role ? (roleMap.get(o.id) ?? o.id) : o.id,
    type: o.type,
    allow: BigInt(o.allow),
    deny: BigInt(o.deny),
  }));
}
