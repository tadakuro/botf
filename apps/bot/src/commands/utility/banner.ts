import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { baseEmbed, infoEmbed } from '../../utils/embeds';
const command: Command = {
  data: new SlashCommandBuilder().setName('banner').setDescription("Get a user's banner").addUserOption(o => o.setName('user').setDescription('User')),
  async execute(interaction) {
    const user = await (interaction.options.getUser('user') ?? interaction.user).fetch();
    const url = user.bannerURL({ size: 4096 });
    if (!url) return interaction.reply({ embeds: [infoEmbed('No banner.')], ephemeral: true });
    await interaction.reply({ embeds: [baseEmbed().setTitle(`${user.tag}'s Banner`).setImage(url)] });
  },
};
export default command;
