import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { Command } from '../../types/Command';
import { infoEmbed } from '../../utils/embeds';
const command: Command = {
  data: new SlashCommandBuilder().setName('transcript').setDescription('Configure transcript settings'),
  userPermissions: [PermissionFlagsBits.Administrator],
  async execute(interaction) {
    await interaction.reply({ embeds:[infoEmbed('transcript configuration — coming soon.')], ephemeral:true });
  },
};
export default command;
