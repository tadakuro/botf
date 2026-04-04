import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { baseEmbed } from '../../utils/embeds';
const command: Command = {
  data: new SlashCommandBuilder().setName('avatar').setDescription("Get a user's avatar").addUserOption(o => o.setName('user').setDescription('User')),
  async execute(interaction) {
    const user = interaction.options.getUser('user') ?? interaction.user;
    const url = user.displayAvatarURL({ size: 4096 });
    await interaction.reply({ embeds: [baseEmbed().setTitle(`${user.tag}'s Avatar`).setImage(url).setURL(url)] });
  },
};
export default command;
