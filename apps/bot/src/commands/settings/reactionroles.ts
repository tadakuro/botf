import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { Command } from '../../types/Command';
import { infoEmbed } from '../../utils/embeds';
const command: Command = {
  data: new SlashCommandBuilder().setName('reactionroles').setDescription('Configure reactionroles settings'),
  userPermissions: [PermissionFlagsBits.Administrator],
  async execute(interaction) {
    await interaction.reply({ embeds:[infoEmbed('reactionroles configuration — coming soon.')], ephemeral:true });
  },
};
export default command;
