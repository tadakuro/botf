import { SlashCommandBuilder, PermissionFlagsBits, GuildMember } from 'discord.js';
import { Command } from '../../types/Command';
import { successEmbed, errorEmbed } from '../../utils/embeds';
import { logModAction } from '../../modules/moderation';
import { isHigherRole } from '../../utils/permissions';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server')
    .addUserOption(o => o.setName('user').setDescription('User to ban').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason for ban'))
    .addIntegerOption(o => o.setName('days').setDescription('Delete message history (days)').setMinValue(0).setMaxValue(7)),
  userPermissions: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],
  async execute(interaction, client) {
    const target = interaction.options.getMember('user') as GuildMember;
    const reason = interaction.options.getString('reason') ?? 'No reason provided';
    const days = interaction.options.getInteger('days') ?? 0;

    if (!target) return interaction.reply({ embeds: [errorEmbed('User not found.')], ephemeral: true });
    if (!isHigherRole(interaction.member as GuildMember, target))
      return interaction.reply({ embeds: [errorEmbed('You cannot ban someone with a higher or equal role.')], ephemeral: true });

    await target.ban({ reason, deleteMessageSeconds: days * 86400 });
    await logModAction(client, interaction.guild!, 'Ban', target, interaction.member as GuildMember, reason);
    await interaction.reply({ embeds: [successEmbed(`**${target.user.tag}** has been banned.\n**Reason:** ${reason}`)] });
  },
};
export default command;
