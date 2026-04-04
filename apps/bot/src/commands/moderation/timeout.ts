import { SlashCommandBuilder, PermissionFlagsBits, GuildMember } from 'discord.js';
import { Command } from '../../types/Command';
import { successEmbed, errorEmbed } from '../../utils/embeds';
import { parseDuration, formatDuration } from '../../utils/parseDuration';
import { logModAction } from '../../modules/moderation';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a member')
    .addUserOption(o => o.setName('user').setDescription('Member to timeout').setRequired(true))
    .addStringOption(o => o.setName('duration').setDescription('Duration e.g. 10m, 1h').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason')),
  userPermissions: [PermissionFlagsBits.ModerateMembers],
  botPermissions: [PermissionFlagsBits.ModerateMembers],
  async execute(interaction, client) {
    const target = interaction.options.getMember('user') as GuildMember;
    const durationStr = interaction.options.getString('duration', true);
    const reason = interaction.options.getString('reason') ?? 'No reason provided';
    if (!target) return interaction.reply({ embeds: [errorEmbed('Member not found.')], ephemeral: true });
    const ms = parseDuration(durationStr);
    if (!ms) return interaction.reply({ embeds: [errorEmbed('Invalid duration. Use formats like `10m`, `1h`, `2d`.')], ephemeral: true });
    if (ms > 2_419_200_000) return interaction.reply({ embeds: [errorEmbed('Timeout cannot exceed 28 days.')], ephemeral: true });
    await target.timeout(ms, reason);
    await logModAction(client, interaction.guild!, 'Timeout', target, interaction.member as GuildMember, reason, { Duration: formatDuration(ms) });
    await interaction.reply({ embeds: [successEmbed(`**${target.user.tag}** timed out for **${formatDuration(ms)}**.\n**Reason:** ${reason}`)] });
  },
};
export default command;
