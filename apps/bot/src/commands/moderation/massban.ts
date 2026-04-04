import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { Command } from '../../types/Command';
import { successEmbed, errorEmbed } from '../../utils/embeds';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('massban')
    .setDescription('Ban multiple users by ID (space-separated)')
    .addStringOption(o => o.setName('ids').setDescription('User IDs separated by spaces').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason')),
  userPermissions: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],
  async execute(interaction) {
    const ids = interaction.options.getString('ids', true).split(/\s+/).filter(Boolean);
    const reason = interaction.options.getString('reason') ?? 'Mass ban';
    await interaction.deferReply();
    let success = 0, failed = 0;
    for (const id of ids) {
      try { await interaction.guild!.bans.create(id, { reason }); success++; }
      catch { failed++; }
    }
    await interaction.editReply({ embeds: [successEmbed(`Mass ban complete. ✅ ${success} banned, ❌ ${failed} failed.`)] });
  },
};
export default command;
