import { SlashCommandBuilder, PermissionFlagsBits, GuildMember } from 'discord.js';
import { Command } from '../../types/Command';
import { baseEmbed, errorEmbed } from '../../utils/embeds';
import { WarningModel } from '../../services/cacheService';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('View warnings for a member')
    .addUserOption(o => o.setName('user').setDescription('Member').setRequired(true)),
  userPermissions: [PermissionFlagsBits.ModerateMembers],
  async execute(interaction) {
    const target = interaction.options.getMember('user') as GuildMember;
    if (!target) return interaction.reply({ embeds: [errorEmbed('Member not found.')], ephemeral: true });
    const warnings = await WarningModel.find({ guildId: interaction.guild!.id, userId: target.id }).sort({ createdAt: -1 });
    const embed = baseEmbed(0xf39c12).setTitle(`Warnings for ${target.user.tag}`);
    if (!warnings.length) {
      embed.setDescription('No warnings found.');
    } else {
      embed.setDescription(warnings.map((w, i) => `**${i+1}.** ${w.reason} — <@${w.moderatorId}> <t:${Math.floor(new Date(w.createdAt).getTime()/1000)}:R>`).join('\n'));
    }
    await interaction.reply({ embeds: [embed] });
  },
};
export default command;
