import { SlashCommandBuilder, PermissionFlagsBits, GuildMember } from 'discord.js';
import { Command } from '../../types/Command';
import { successEmbed, errorEmbed } from '../../utils/embeds';
import { logModAction } from '../../modules/moderation';
import { isHigherRole } from '../../utils/permissions';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member')
    .addUserOption(o => o.setName('user').setDescription('Member to kick').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason')),
  userPermissions: [PermissionFlagsBits.KickMembers],
  botPermissions: [PermissionFlagsBits.KickMembers],
  async execute(interaction, client) {
    const target = interaction.options.getMember('user') as GuildMember;
    const reason = interaction.options.getString('reason') ?? 'No reason provided';
    if (!target) return interaction.reply({ embeds: [errorEmbed('Member not found.')], ephemeral: true });
    if (!isHigherRole(interaction.member as GuildMember, target))
      return interaction.reply({ embeds: [errorEmbed('You cannot kick someone with a higher or equal role.')], ephemeral: true });
    await target.kick(reason);
    await logModAction(client, interaction.guild!, 'Kick', target, interaction.member as GuildMember, reason);
    await interaction.reply({ embeds: [successEmbed(`**${target.user.tag}** has been kicked.\n**Reason:** ${reason}`)] });
  },
};
export default command;
