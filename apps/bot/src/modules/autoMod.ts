import { Message, TextChannel, NewsChannel } from 'discord.js';
import { BotClient } from '../client';
import { GuildModel } from '../services/cacheService';
import { logger } from '../utils/logger';

const inviteRegex = /(discord\.gg|discord\.com\/invite)\/[a-zA-Z0-9]+/i;

export async function autoModCheck(client: BotClient, message: Message): Promise<void> {
  if (!message.guild || message.author.bot) return;
  try {
    const settings = await GuildModel.findOne({ guildId: message.guild.id });
    if (!settings) return;

    if (settings.antiInviteEnabled && inviteRegex.test(message.content)) {
      await message.delete().catch(() => {});
      if (message.channel.isTextBased()) {
        await (message.channel as TextChannel | NewsChannel).send(`<@${message.author.id}>, Discord invites are not allowed here.`).then(m => setTimeout(() => m.delete().catch(() => {}), 5000));
      }
    }
  } catch (err) {
    logger.error('autoModCheck error:', err);
  }
}
