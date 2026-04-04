import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { successEmbed } from '../../utils/embeds';
const command: Command = {
  data: new SlashCommandBuilder().setName('restart').setDescription('Restart the bot'),
  ownerOnly: true,
  async execute(interaction) {
    await interaction.reply({ embeds:[successEmbed('Restarting...')] });
    process.exit(0);
  },
};
export default command;
