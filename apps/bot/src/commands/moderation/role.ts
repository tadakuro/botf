import { SlashCommandBuilder, PermissionFlagsBits, GuildMember, Role } from 'discord.js';
import { Command } from '../../types/Command';
import { successEmbed, errorEmbed } from '../../utils/embeds';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('Add a role to a member')
    .addUserOption(o => o.setName('user').setDescription('Member').setRequired(true))
    .addRoleOption(o => o.setName('role').setDescription('Role to add').setRequired(true)),
  userPermissions: [PermissionFlagsBits.ManageRoles],
  botPermissions: [PermissionFlagsBits.ManageRoles],
  async execute(interaction) {
    const target = interaction.options.getMember('user') as GuildMember;
    const role = interaction.options.getRole('role') as Role;
    if (!target) return interaction.reply({ embeds: [errorEmbed('Member not found.')], ephemeral: true });
    await target.roles.add(role);
    await interaction.reply({ embeds: [successEmbed(`Added **${role.name}** to **${target.user.tag}**.`)] });
  },
};
export default command;
