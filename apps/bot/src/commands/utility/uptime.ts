import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { infoEmbed } from '../../utils/embeds';
import { formatDuration } from '../../utils/parseDuration';
const command: Command = {
  data: new SlashCommandBuilder().setName('uptime').setDescription('View bot uptime'),
  async execute(interaction, client) {
    await interaction.reply({ embeds: [infoEmbed(`⏱️ Uptime: **${formatDuration(client.uptime??0)}**`)] });
  },
};
export default command;
