import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { infoEmbed } from '../../utils/embeds';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('backup')
    .setDescription('Manage server backups'),
  async execute(interaction) {
    await interaction.reply({
      embeds: [infoEmbed(
        '💾 **Server Backup is managed via the BotForge Dashboard.**\n\nVisit the dashboard to create, load, or delete backups:\n**https://botforge.vercel.app**',
        'Backup',
      )],
      ephemeral: true,
    });
  },
};

export default command;
