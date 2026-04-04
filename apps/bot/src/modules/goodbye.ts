import { GuildMember, PartialGuildMember, TextChannel } from 'discord.js';
import { BotClient } from '../client';
import { GuildModel } from '../services/cacheService';
import { logger } from '../utils/logger';

export async function handleGoodbye(
  client: BotClient,
  member: GuildMember | PartialGuildMember,
): Promise<void> {
  try {
    const settings = await GuildModel.findOne({ guildId: member.guild.id });
    if (!settings?.goodbyeChannel) return;

    const channel = member.guild.channels.cache.get(settings.goodbyeChannel) as TextChannel;
    if (!channel) return;

    const message = (settings.goodbyeMessage ?? 'Goodbye {username}! We hope to see you again.')
      .replace('{username}', member.user?.username ?? 'Unknown')
      .replace('{server}', member.guild.name)
      .replace('{memberCount}', member.guild.memberCount.toString());

    await channel.send(message);
  } catch (err) {
    logger.error('handleGoodbye error:', err);
  }
}
