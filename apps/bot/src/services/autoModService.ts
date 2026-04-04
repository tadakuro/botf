import { Message } from 'discord.js';
import { BotClient } from '../client';
import { GuildModel } from './cacheService';
import { logger } from '../utils/logger';

const INVITE_REGEX = /(discord\.gg|discord\.com\/invite|discordapp\.com\/invite)\/[a-zA-Z0-9-]+/i;
const SPAM_LINKS = /bit\.ly|tinyurl\.com|grabify\.link/i;

export class AutoModService {
  constructor(private client: BotClient) {}

  async check(message: Message): Promise<boolean> {
    if (!message.guild || message.author.bot) return false;
    try {
      const settings = await GuildModel.findOne({ guildId: message.guild.id });
      if (!settings?.autoModEnabled) return false;

      if (settings.antiInviteEnabled && INVITE_REGEX.test(message.content)) {
        await message.delete().catch(() => {});
        await message.channel.send(`<@${message.author.id}>, Discord invites are not allowed.`).then(m => setTimeout(() => m.delete().catch(() => {}), 5000));
        return true;
      }

      if (SPAM_LINKS.test(message.content)) {
        await message.delete().catch(() => {});
        await message.channel.send(`<@${message.author.id}>, suspicious links are not allowed.`).then(m => setTimeout(() => m.delete().catch(() => {}), 5000));
        return true;
      }
    } catch (err) {
      logger.error('AutoModService.check error:', err);
    }
    return false;
  }
}
