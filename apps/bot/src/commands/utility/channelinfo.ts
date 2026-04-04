import { SlashCommandBuilder, TextChannel } from 'discord.js';
import { Command } from '../../types/Command';
import { baseEmbed } from '../../utils/embeds';
const command: Command = {
  data: new SlashCommandBuilder().setName('channelinfo').setDescription('View channel info'),
  async execute(interaction) {
    const ch = interaction.channel as TextChannel;
    await interaction.reply({ embeds: [baseEmbed().setTitle(`#${ch.name}`).addFields(
      { name: 'ID', value: ch.id, inline: true },
      { name: 'Created', value: `<t:${Math.floor(ch.createdTimestamp!/1000)}:R>`, inline: true },
      { name: 'Topic', value: ch.topic??'None' },
    )] });
  },
};
export default command;
