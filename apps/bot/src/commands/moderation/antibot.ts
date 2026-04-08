import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { Command } from '../../types/Command';
import { successEmbed } from '../../utils/embeds';
import { GuildModel } from '../../services/cacheService';
import type { IGuild } from '@botforge/database';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('antibot')
    .setDescription('Toggle antibot protection')
    .addBooleanOption(o => o.setName('enabled').setDescription('Enable or disable').setRequired(true)),
  userPermissions: [PermissionFlagsBits.Administrator],
  async execute(interaction) {
    const enabled = interaction.options.getBoolean('enabled', true);
    await GuildModel.findOneAndUpdate(
      { guildId: interaction.guild!.id },
      { $set: { antibotEnabled: enabled } },
      { upsert: true },
    ) as IGuild | null;
    await interaction.reply({ embeds: [successEmbed(`antibot has been ${enabled ? '✅ enabled' : '❌ disabled'}.`)] });
  },
};
export default command;
