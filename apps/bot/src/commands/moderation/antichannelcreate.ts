import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { Command } from '../../types/Command';
import { successEmbed } from '../../utils/embeds';
import { GuildModel } from '../../services/cacheService';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('antichannelcreate')
    .setDescription('Toggle antichannelcreate protection')
    .addBooleanOption(o => o.setName('enabled').setDescription('Enable or disable').setRequired(true)),
  userPermissions: [PermissionFlagsBits.Administrator],
  async execute(interaction) {
    const enabled = interaction.options.getBoolean('enabled', true);
    await GuildModel.findOneAndUpdate(
      { guildId: interaction.guild!.id },
      { $set: { antichannelcreateEnabled: enabled } },
      { upsert: true },
    );
    await interaction.reply({ embeds: [successEmbed(`antichannelcreate has been ${enabled ? '✅ enabled' : '❌ disabled'}.`)] });
  },
};
export default command;
