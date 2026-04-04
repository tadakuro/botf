import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { baseEmbed } from '../../utils/embeds';
const command: Command = {
  data: new SlashCommandBuilder().setName('serverinfo').setDescription('View server info'),
  async execute(interaction) {
    const g = interaction.guild!;
    await interaction.reply({ embeds: [baseEmbed().setTitle(g.name).setThumbnail(g.iconURL()).addFields(
      { name: 'Owner', value: `<@${g.ownerId}>`, inline: true },
      { name: 'Members', value: g.memberCount.toString(), inline: true },
      { name: 'Channels', value: g.channels.cache.size.toString(), inline: true },
      { name: 'Roles', value: g.roles.cache.size.toString(), inline: true },
      { name: 'Created', value: `<t:${Math.floor(g.createdTimestamp/1000)}:R>`, inline: true },
      { name: 'Boost Level', value: `Level ${g.premiumTier}`, inline: true },
    )] });
  },
};
export default command;
