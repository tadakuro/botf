import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { successEmbed } from '../../utils/embeds';
const command: Command = {
  data: new SlashCommandBuilder().setName('shutdown').setDescription('Shut down the bot'),
  ownerOnly: true,
  async execute(interaction, client) {
    await interaction.reply({ embeds:[successEmbed('Shutting down...')] });
    await client.destroy();
    process.exit(0);
  },
};
export default command;
