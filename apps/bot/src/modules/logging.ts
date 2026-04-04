import { Guild, AuditLogEvent, TextChannel, EmbedBuilder } from 'discord.js';
import { BotClient } from '../client';
import { GuildModel } from '../services/cacheService';
import { logger } from '../utils/logger';

export async function logEvent(
  client: BotClient,
  guild: Guild,
  title: string,
  description: string,
  color: number = 0x5865f2,
): Promise<void> {
  try {
    const settings = await GuildModel.findOne({ guildId: guild.id });
    if (!settings?.logChannel) return;
    const channel = guild.channels.cache.get(settings.logChannel) as TextChannel;
    if (!channel) return;
    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor(color)
      .setTimestamp();
    await channel.send({ embeds: [embed] });
  } catch (err) {
    logger.error('logEvent error:', err);
  }
}
