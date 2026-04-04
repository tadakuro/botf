import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { successEmbed } from '../../utils/embeds';
const blacklist=new Set<string>();
const command: Command = {
  data: new SlashCommandBuilder().setName('blacklist').setDescription('Blacklist a user from using the bot').addUserOption(o=>o.setName('user').setDescription('User').setRequired(true)),
  ownerOnly: true,
  async execute(interaction) {
    const user=interaction.options.getUser('user',true);
    if (blacklist.has(user.id)) { blacklist.delete(user.id); await interaction.reply({ embeds:[successEmbed(`Removed **${user.tag}** from blacklist.`)] }); }
    else { blacklist.add(user.id); await interaction.reply({ embeds:[successEmbed(`Added **${user.tag}** to blacklist.`)] }); }
  },
};
export { blacklist };
export default command;
