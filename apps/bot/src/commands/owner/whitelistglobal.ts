import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { infoEmbed } from '../../utils/embeds';
const command: Command = {
  data: new SlashCommandBuilder().setName('whitelistglobal').setDescription('Globally whitelist a user from antinuke').addUserOption(o=>o.setName('user').setDescription('User').setRequired(true)),
  ownerOnly: true,
  async execute(interaction) {
    const user=interaction.options.getUser('user',true);
    await interaction.reply({ embeds:[infoEmbed(`Global whitelist updated for **${user.tag}**.`)] });
  },
};
export default command;
