import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { successEmbed } from '../../utils/embeds';
const command: Command = {
  data: new SlashCommandBuilder().setName('afk').setDescription('Set AFK status').addStringOption(o=>o.setName('reason').setDescription('Reason')),
  async execute(interaction, client) {
    const reason = interaction.options.getString('reason')??'AFK';
    client.afkUsers.set(interaction.user.id, { reason, time: Date.now() });
    await interaction.reply({ embeds: [successEmbed(`You are now AFK: **${reason}**`)] });
  },
};
export default command;
