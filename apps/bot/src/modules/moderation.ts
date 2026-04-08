import { Guild, GuildMember, TextChannel } from 'discord.js';
import { BotClient } from '../client';
import { GuildModel } from '../services/cacheService';
import { WarningModel } from '../services/cacheService';
import { baseEmbed } from '../utils/embeds';
import { logger } from '../utils/logger';
import type { IWarning } from '@botforge/database';

export async function logModAction(
  client: BotClient,
  guild: Guild,
  action: string,
  target: GuildMember | { id: string; tag: string },
  moderator: GuildMember,
  reason: string,
  extra?: Record<string, string>,
): Promise<void> {
  try {
    const settings = await GuildModel.findOne({ guildId: guild.id });
    if (!settings?.modLogChannel) return;

    const channel = guild.channels.cache.get(settings.modLogChannel) as TextChannel;
    if (!channel) return;

    const embed = baseEmbed(0xe74c3c)
      .setTitle(`🔨 ${action}`)
      .addFields(
        {
          name: 'Target',
          value: `<@${target.id}> (${'tag' in target ? target.tag : ((target as { user: { tag: string } })?.user?.tag || 'Unknown')})`,
          inline: true
        },
        { name: 'Moderator', value: `<@${moderator.id}> (${moderator.user.tag})`, inline: true },
        { name: 'Reason', value: reason },
      );

    if (extra) {
      for (const [k, v] of Object.entries(extra)) {
        embed.addFields({ name: k, value: v, inline: true });
      }
    }

    await channel.send({ embeds: [embed] });
  } catch (err) {
    logger.error('logModAction error:', err);
  }
}

export async function addWarning(
  guildId: string,
  userId: string,
  moderatorId: string,
  reason: string,
): Promise<number> {
  await (WarningModel as any).create({ guildId, userId, moderatorId, reason });
  return await (WarningModel as any).countDocuments({ guildId, userId });
}
