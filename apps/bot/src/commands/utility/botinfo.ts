import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { baseEmbed } from '../../utils/embeds';
const command: Command = {
  data: new SlashCommandBuilder().setName('botinfo').setDescription('View bot info'),
  async execute(interaction, client) {
    await interaction.reply({ embeds: [baseEmbed().setTitle(client.user!.tag).setThumbnail(client.user!.displayAvatarURL()).addFields(
      { name: 'Guilds', value: client.guilds.cache.size.toString(), inline: true },
      { name: 'Commands', value: client.commands.size.toString(), inline: true },
      { name: 'Node.js', value: process.version, inline: true },
    )] });
  },
};
export default command;
