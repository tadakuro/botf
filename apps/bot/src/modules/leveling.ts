import { Message, TextChannel } from 'discord.js';
import { BotClient } from '../client';
import { GuildModel, LevelModel } from '../services/cacheService';
import { logger } from '../utils/logger';
import type { ILevel } from '@botforge/database';

export function xpForLevel(level: number): number {
  return 100 * level * (level + 1);
}

export async function handleXp(client: BotClient, message: Message): Promise<void> {
  if (!message.guild || message.author.bot) return;
  try {
    const settings = await GuildModel.findOne({ guildId: message.guild.id });
    if (!settings?.levelsEnabled) return;

    const xpGain = Math.floor(Math.random() * 10) + 15;
    const Model = LevelModel as any;
    const doc = await Model.findOneAndUpdate(
      { guildId: message.guild.id, userId: message.author.id },
      { $inc: { xp: xpGain } },
      { upsert: true, new: true },
    );

    if (!doc) return;
    const required = xpForLevel(doc.level);
    if (doc.xp >= required) {
      await (LevelModel as any).updateOne(
        { guildId: message.guild.id, userId: message.author.id },
        { $inc: { level: 1 }, $set: { xp: 0 } },
      );

      const channelId = settings.levelUpChannel ?? message.channelId;
      const channel = message.guild.channels.cache.get(channelId) as TextChannel;
      const msg = (settings.levelUpMessage ?? '🎉 {user} reached level **{level}**!')
        .replace('{user}', `<@${message.author.id}>`)
        .replace('{level}', (doc.level + 1).toString());

      if (channel) await channel.send(msg).catch(() => {});
    }
  } catch (err) {
    logger.error('handleXp error:', err);
  }
}
