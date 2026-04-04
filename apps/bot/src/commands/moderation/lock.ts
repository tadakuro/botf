import { SlashCommandBuilder, PermissionFlagsBits, TextChannel } from 'discord.js';
import { Command } from '../../types/Command';
import { successEmbed } from '../../utils/embeds';

const command: Command = {
  data: new SlashCommandBuilder().setName('lock').setDescription('Lock the current channel'),
  userPermissions: [PermissionFlagsBits.ManageChannels],
  botPermissions: [PermissionFlagsBits.ManageChannels],
  async execute(interaction) {
    await (interaction.channel as TextChannel).permissionOverwrites.edit(interaction.guild!.roles.everyone, { SendMessages: false });
    await interaction.reply({ embeds: [successEmbed('🔒 Channel locked.')] });
  },
};
export default command;
