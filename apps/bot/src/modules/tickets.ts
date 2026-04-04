import {
  ButtonInteraction, Guild, GuildMember, PermissionFlagsBits,
  TextChannel, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle,
} from 'discord.js';
import { BotClient } from '../client';
import { GuildModel } from '../services/cacheService';
import { baseEmbed, successEmbed } from '../utils/embeds';
import { logger } from '../utils/logger';

export async function openTicket(client: BotClient, interaction: ButtonInteraction): Promise<void> {
  if (!interaction.guild) return;
  try {
    const settings = await GuildModel.findOne({ guildId: interaction.guild.id });
    const category = settings?.ticketCategory;

    const channel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: ChannelType.GuildText,
      parent: category ?? undefined,
      permissionOverwrites: [
        { id: interaction.guild.roles.everyone, deny: [PermissionFlagsBits.ViewChannel] },
        { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
      ],
    });

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId('tickets:close').setLabel('Close Ticket').setStyle(ButtonStyle.Danger),
    );

    await channel.send({
      content: `<@${interaction.user.id}>`,
      embeds: [baseEmbed().setTitle('🎫 Ticket Opened').setDescription('Support will be with you shortly. Click **Close Ticket** when resolved.')],
      components: [row],
    });

    await interaction.reply({ embeds: [successEmbed(`Ticket created: ${channel}`)], ephemeral: true });
  } catch (err) {
    logger.error('openTicket error:', err);
  }
}

export async function handleComponent(client: BotClient, interaction: ButtonInteraction): Promise<void> {
  const [, action] = interaction.customId.split(':');
  if (action === 'close') {
    await interaction.reply({ embeds: [successEmbed('Ticket closing in 5 seconds...')], ephemeral: true });
    setTimeout(() => (interaction.channel as TextChannel)?.delete().catch(() => {}), 5000);
  }
}
