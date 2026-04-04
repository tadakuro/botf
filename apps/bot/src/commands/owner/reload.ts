import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { successEmbed, errorEmbed } from '../../utils/embeds';
import { loadCommands } from '../../handlers/commandHandler';
const command: Command = {
  data: new SlashCommandBuilder().setName('reload').setDescription('Reload all commands'),
  ownerOnly: true,
  async execute(interaction, client) {
    try {
      client.commands.clear();
      await loadCommands(client);
      await interaction.reply({ embeds:[successEmbed(`Reloaded ${client.commands.size} commands.`)] });
    } catch(err:any) {
      await interaction.reply({ embeds:[errorEmbed(err.message)], ephemeral:true });
    }
  },
};
export default command;
