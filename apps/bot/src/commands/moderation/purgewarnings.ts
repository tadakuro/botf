import { SlashCommandBuilder, PermissionFlagsBits, GuildMember } from 'discord.js';
import { Command } from '../../types/Command';
import { successEmbed, errorEmbed } from '../../utils/embeds';
import { WarningModel } from '../../services/cacheService';
import type { IWarning } from '@botforge/database';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('purgewarnings')
    .setDescription('Clear all warnings for a member')
    .addUserOption(o => o.setName('user').setDescription('Member').setRequired(true)),
  userPermissions: [PermissionFlagsBits.ModerateMembers],
  async execute(interaction) {
    const target = interaction.options.getMember('user') as GuildMember;
    if (!target) return interaction.reply({ embeds: [errorEmbed('Member not found.')], ephemeral: true });
    const Model = WarningModel as any;
    await Model.deleteMany({ guildId: interaction.guild!.id, userId: target.id });
    await interaction.reply({ embeds: [successEmbed(`All warnings cleared for **${target.user.tag}**.`)] });
  },
};
export default command;
