import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { baseEmbed, infoEmbed } from '../../utils/embeds';
const command: Command = {
  data: new SlashCommandBuilder().setName('snipe').setDescription('Show last deleted message'),
  async execute(interaction, client) {
    const s = client.snipes.get(interaction.channelId)?.[0];
    if (!s) return interaction.reply({ embeds: [infoEmbed('Nothing to snipe.')], ephemeral: true });
    await interaction.reply({ embeds: [baseEmbed().setAuthor({ name: s.author.tag, iconURL: s.author.displayAvatarURL() }).setDescription(s.content||'*[no content]*').setTimestamp(s.deletedAt)] });
  },
};
export default command;
