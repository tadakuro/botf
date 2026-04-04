import { Guild, TextChannel, EmbedBuilder, ColorResolvable } from 'discord.js';
import { GuildModel } from './cacheService';
import { logger } from '../utils/logger';

export class LoggingService {
  constructor(private guild: Guild) {}

  async log(title: string, description: string, color: ColorResolvable = 0x5865f2): Promise<void> {
    try {
      const settings = await GuildModel.findOne({ guildId: this.guild.id });
      if (!settings?.logChannel) return;
      const channel = this.guild.channels.cache.get(settings.logChannel) as TextChannel;
      if (!channel) return;
      await channel.send({
        embeds: [new EmbedBuilder().setTitle(title).setDescription(description).setColor(color).setTimestamp()],
      });
    } catch (err) {
      logger.error('LoggingService.log error:', err);
    }
  }

  async modLog(title: string, description: string): Promise<void> {
    try {
      const settings = await GuildModel.findOne({ guildId: this.guild.id });
      if (!settings?.modLogChannel) return;
      const channel = this.guild.channels.cache.get(settings.modLogChannel) as TextChannel;
      if (!channel) return;
      await channel.send({
        embeds: [new EmbedBuilder().setTitle(title).setDescription(description).setColor(0xe74c3c).setTimestamp()],
      });
    } catch (err) {
      logger.error('LoggingService.modLog error:', err);
    }
  }
}
