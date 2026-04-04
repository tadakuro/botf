import { SlashCommandBuilder, PermissionFlagsBits, GuildMember } from 'discord.js';
import { Command } from '../../types/Command';
import { successEmbed, errorEmbed } from '../../utils/embeds';
import { GuildModel } from '../../services/cacheService';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('unjail')
    .setDescription('Release a jailed member')
    .addUserOption(o => o.setName('user').setDescription('Member').setRequired(true)),
  userPermissions: [PermissionFlagsBits.ModerateMembers],
  botPermissions: [PermissionFlagsBits.ManageRoles],
  async execute(interaction) {
    const target = interaction.options.getMember('user') as GuildMember;
    if (!target) return interaction.reply({ embeds: [errorEmbed('Member not found.')], ephemeral: true });
    const settings = await GuildModel.findOne({ guildId: interaction.guild!.id });
    if (!settings?.jailRole) return interaction.reply({ embeds: [errorEmbed('No jail role configured.')], ephemeral: true });
    const role = interaction.guild!.roles.cache.get(settings.jailRole);
    if (!role) return interaction.reply({ embeds: [errorEmbed('Jail role not found.')], ephemeral: true });
    await target.roles.remove(role);
    await interaction.reply({ embeds: [successEmbed(`**${target.user.tag}** has been released from jail.`)] });
  },
};
export default command;
