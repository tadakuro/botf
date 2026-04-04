import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { Command } from '../../types/Command';
import { successEmbed } from '../../utils/embeds';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('masskick')
    .setDescription('Kick multiple members by ID')
    .addStringOption(o => o.setName('ids').setDescription('User IDs separated by spaces').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason')),
  userPermissions: [PermissionFlagsBits.KickMembers],
  botPermissions: [PermissionFlagsBits.KickMembers],
  async execute(interaction) {
    const ids = interaction.options.getString('ids', true).split(/\s+/).filter(Boolean);
    const reason = interaction.options.getString('reason') ?? 'Mass kick';
    await interaction.deferReply();
    let success = 0, failed = 0;
    for (const id of ids) {
      try { const m = await interaction.guild!.members.fetch(id); await m.kick(reason); success++; }
      catch { failed++; }
    }
    await interaction.editReply({ embeds: [successEmbed(`Mass kick complete. ✅ ${success} kicked, ❌ ${failed} failed.`)] });
  },
};
export default command;
