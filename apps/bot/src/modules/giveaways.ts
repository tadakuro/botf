import { TextChannel } from 'discord.js';
import { BotClient } from '../client';
import { GiveawayModel } from '../services/cacheService';
import { baseEmbed } from '../utils/embeds';
import { logger } from '../utils/logger';
import type { IGiveaway } from '@botforge/database';

export async function endGiveaway(client: BotClient, giveawayId: string): Promise<void> {
  try {
    const Model = GiveawayModel as any;
    const giveawayRaw = await Model.findById(giveawayId);
    const giveaway = giveawayRaw as IGiveaway | null;
    if (!giveaway || giveaway.ended) return;

    const guild = client.guilds.cache.get(giveaway.guildId);
    const channel = guild?.channels.cache.get(giveaway.channelId) as TextChannel;
    const message = await channel?.messages.fetch(giveaway.messageId).catch(() => null);
    if (!message) return;

    const reaction = message.reactions.cache.get('🎉');
    const users = await reaction?.users.fetch();
    const eligible = users?.filter(u => !u.bot).map(u => u.id) ?? [];

    if (!eligible.length) {
      await channel.send('No valid entries for the giveaway. No winner picked.');
      return;
    }

    const winners = [];
    const pool = [...eligible];
    for (let i = 0; i < Math.min(giveaway.winnerCount, pool.length); i++) {
      const idx = Math.floor(Math.random() * pool.length);
      winners.push(pool.splice(idx, 1)[0]);
    }

    await channel.send({
      content: winners.map(w => `<@${w}>`).join(', '),
      embeds: [baseEmbed(0xffd700).setTitle('🎉 Giveaway Ended').setDescription(`**Prize:** ${giveaway.prize}\n**Winners:** ${winners.map(w => `<@${w}>`).join(', ')}`)],
    });

    const updateRaw = await Model.findByIdAndUpdate(giveawayId, { ended: true });
    // We don't need the result, just wait for the update to complete
    await updateRaw;
  } catch (err) {
    logger.error('endGiveaway error:', err);
  }
}
