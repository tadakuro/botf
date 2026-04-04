import { MessageReaction, TextChannel, User } from 'discord.js';
import { BotClient } from '../client';
import { GuildModel } from '../services/cacheService';
import { baseEmbed } from '../utils/embeds';
import { logger } from '../utils/logger';

export async function handleStarboard(client: BotClient, reaction: MessageReaction, user: User): Promise<void> {
  if (reaction.emoji.name !== '⭐' || !reaction.message.guild) return;
  try {
    const settings = await GuildModel.findOne({ guildId: reaction.message.guild.id });
    if (!settings?.starboardChannel) return;

    const threshold = settings.starboardThreshold ?? 3;
    if ((reaction.count ?? 0) < threshold) return;

    const starChannel = reaction.message.guild.channels.cache.get(settings.starboardChannel) as TextChannel;
    if (!starChannel) return;

    const msg = reaction.message;
    const embed = baseEmbed(0xffd700)
      .setAuthor({ name: msg.author?.tag ?? 'Unknown', iconURL: msg.author?.displayAvatarURL() })
      .setDescription(msg.content ?? null)
      .addFields({ name: 'Source', value: `[Jump to message](${msg.url})` })
      .setTimestamp(msg.createdAt);

    if (msg.attachments.size > 0) {
      embed.setImage(msg.attachments.first()!.url);
    }

    await starChannel.send({ content: `⭐ **${reaction.count}** | <#${msg.channelId}>`, embeds: [embed] });
  } catch (err) {
    logger.error('handleStarboard error:', err);
  }
}
