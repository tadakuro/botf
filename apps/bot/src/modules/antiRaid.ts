import { GuildMember, Message } from 'discord.js';
import { BotClient } from '../client';
import { GuildModel } from '../services/cacheService';
import { RAID_THRESHOLD, RAID_WINDOW, SPAM_THRESHOLD, SPAM_WINDOW } from '../utils/constants';
import { logger } from '../utils/logger';

const joinTimestamps = new Map<string, number[]>();
const messageTimestamps = new Map<string, number[]>();

export async function handleRaidCheck(client: BotClient, member: GuildMember): Promise<void> {
  try {
    const settings = await GuildModel.findOne({ guildId: member.guild.id });
    if (!settings?.antiRaidEnabled) return;

    const key = member.guild.id;
    const now = Date.now();
    const timestamps = (joinTimestamps.get(key) ?? []).filter(t => now - t < RAID_WINDOW);
    timestamps.push(now);
    joinTimestamps.set(key, timestamps);

    if (timestamps.length >= RAID_THRESHOLD) {
      await member.kick('Anti-raid: mass join detected').catch(() => {});
      logger.warn(`[AntiRaid] Kicked ${member.user.tag} in ${member.guild.name} — mass join`);
    }
  } catch (err) {
    logger.error('handleRaidCheck error:', err);
  }
}

export async function antiSpamCheck(client: BotClient, message: Message): Promise<void> {
  if (!message.guild || message.author.bot) return;
  try {
    const settings = await GuildModel.findOne({ guildId: message.guild.id });
    if (!settings?.antiSpamEnabled) return;

    const key = `${message.guild.id}:${message.author.id}`;
    const now = Date.now();
    const timestamps = (messageTimestamps.get(key) ?? []).filter(t => now - t < SPAM_WINDOW);
    timestamps.push(now);
    messageTimestamps.set(key, timestamps);

    if (timestamps.length >= SPAM_THRESHOLD) {
      await message.delete().catch(() => {});
      const member = message.guild.members.cache.get(message.author.id);
      if (member) {
        await member.timeout(30_000, 'Anti-spam').catch(() => {});
      }
      messageTimestamps.delete(key);
    }
  } catch (err) {
    logger.error('antiSpamCheck error:', err);
  }
}
