import { Guild, TextChannel, ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { BotClient } from '../client';
import { GuildModel, TicketModel } from './cacheService';
import { baseEmbed } from '../utils/embeds';
import { logger } from '../utils/logger';
import type { ITicket, IGuild } from '@botforge/database';

export class TicketService {
  constructor(private client: BotClient) {}

  async openTicket(guild: Guild, userId: string): Promise<TextChannel | null> {
    try {
      const settings = await GuildModel.findOne({ guildId: guild.id });
      const channel = await guild.channels.create({
        name: `ticket-${guild.members.cache.get(userId)?.user.username ?? userId}`,
        type: ChannelType.GuildText,
        parent: settings?.ticketCategory ?? undefined,
        permissionOverwrites: [
          { id: guild.roles.everyone, deny: [PermissionFlagsBits.ViewChannel] },
          { id: userId, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        ],
      });

      await (TicketModel as any).create({ guildId: guild.id, channelId: channel.id, userId });

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId('tickets:close').setLabel('Close Ticket').setStyle(ButtonStyle.Danger),
      );

      await channel.send({
        content: `<@${userId}>`,
        embeds: [baseEmbed().setTitle('🎫 Ticket Opened').setDescription('Support will be with you shortly.')],
        components: [row],
      });

      return channel;
    } catch (err) {
      logger.error('TicketService.openTicket error:', err);
      return null;
    }
  }

  async closeTicket(channel: TextChannel): Promise<void> {
    try {
      await (TicketModel as any).findOneAndUpdate({ channelId: channel.id }, { $set: { closed: true } });
      await channel.delete('Ticket closed');
    } catch (err) {
      logger.error('TicketService.closeTicket error:', err);
    }
  }
}
