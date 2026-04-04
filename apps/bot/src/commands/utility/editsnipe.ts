import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { baseEmbed, infoEmbed } from '../../utils/embeds';
const command: Command = {
  data: new SlashCommandBuilder().setName('editsnipe').setDescription('Show last edited message'),
  async execute(interaction, client) {
    const s = client.editSnipes.get(interaction.channelId)?.[0];
    if (!s) return interaction.reply({ embeds: [infoEmbed('Nothing to snipe.')], ephemeral: true });
    await interaction.reply({ embeds: [baseEmbed().setAuthor({ name: s.author.tag, iconURL: s.author.displayAvatarURL() }).addFields({ name:'Before', value:s.oldContent||'*empty*' },{ name:'After', value:s.newContent||'*empty*' }).setTimestamp(s.editedAt)] });
  },
};
export default command;
