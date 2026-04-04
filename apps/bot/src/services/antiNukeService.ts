import { Guild, PermissionFlagsBits } from 'discord.js';
import { BotClient } from '../client';
import { AntiNukeModel } from './cacheService';
import { logger } from '../utils/logger';

const actionLog = new Map<string, { count: number; timer: NodeJS.Timeout }>();

export class AntiNukeService {
  constructor(private client: BotClient) {}

  async processAction(guild: Guild, executorId: string, action: string): Promise<void> {
    const config = await AntiNukeModel.findOne({ guildId: guild.id });
    if (!config?.enabled) return;
    if (config.whitelist.includes(executorId)) return;
    if (executorId === this.client.user?.id) return;

    const key = `${guild.id}:${executorId}:${action}`;
    const threshold = (config.thresholds as any)[action] ?? 3;

    const current = actionLog.get(key) ?? { count: 0, timer: null as any };
    current.count++;

    if (current.timer) clearTimeout(current.timer);
    current.timer = setTimeout(() => actionLog.delete(key), 10_000);
    actionLog.set(key, current);

    if (current.count >= threshold) {
      actionLog.delete(key);
      await this.punish(guild, executorId, config.punishment, action);
    }
  }

  private async punish(guild: Guild, userId: string, punishment: string, action: string): Promise<void> {
    const member = await guild.members.fetch(userId).catch(() => null);
    if (!member) return;

    const reason = `AntiNuke: exceeded threshold for ${action}`;
    try {
      switch (punishment) {
        case 'ban':
          await guild.bans.create(userId, { reason });
          break;
        case 'kick':
          await member.kick(reason);
          break;
        case 'strip':
          await member.roles.set([], reason);
          break;
        case 'deafen':
          if (member.voice.channel) await member.voice.setDeaf(true, reason);
          break;
      }
      logger.warn(`[AntiNuke] ${punishment} applied to ${userId} in ${guild.name} for ${action}`);
    } catch (err) {
      logger.error('AntiNuke punish error:', err);
    }
  }
}
