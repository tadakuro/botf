import { SlashCommandBuilder, PermissionFlagsBits, TextChannel } from 'discord.js';
import { Command } from '../../types/Command';
import { successEmbed } from '../../utils/embeds';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set slowmode for a channel')
    .addIntegerOption(o => o.setName('seconds').setDescription('Slowmode in seconds (0 to disable)').setRequired(true).setMinValue(0).setMaxValue(21600)),
  userPermissions: [PermissionFlagsBits.ManageChannels],
  botPermissions: [PermissionFlagsBits.ManageChannels],
  async execute(interaction) {
    const seconds = interaction.options.getInteger('seconds', true);
    await (interaction.channel as TextChannel).setRateLimitPerUser(seconds);
    await interaction.reply({ embeds: [successEmbed(seconds === 0 ? 'Slowmode disabled.' : `Slowmode set to **${seconds}s**.`)] });
  },
};
export default command;
