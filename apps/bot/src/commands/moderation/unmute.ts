import { SlashCommandBuilder, PermissionFlagsBits, GuildMember } from 'discord.js';
import { Command } from '../../types/Command';
import { successEmbed, errorEmbed } from '../../utils/embeds';
import { GuildModel } from '../../services/cacheService';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Unmute a member')
    .addUserOption(o => o.setName('user').setDescription('Member to unmute').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason')),
  userPermissions: [PermissionFlagsBits.ModerateMembers],
  botPermissions: [PermissionFlagsBits.ManageRoles],
  async execute(interaction) {
    const target = interaction.options.getMember('user') as GuildMember;
    const reason = interaction.options.getString('reason') ?? 'No reason provided';
    if (!target) return interaction.reply({ embeds: [errorEmbed('Member not found.')], ephemeral: true });
    const settings = await GuildModel.findOne({ guildId: interaction.guild!.id });
    if (!settings?.muteRole) return interaction.reply({ embeds: [errorEmbed('No mute role configured.')], ephemeral: true });
    const role = interaction.guild!.roles.cache.get(settings.muteRole);
    if (!role) return interaction.reply({ embeds: [errorEmbed('Mute role not found.')], ephemeral: true });
    await target.roles.remove(role, reason);
    await interaction.reply({ embeds: [successEmbed(`**${target.user.tag}** has been unmuted.`)] });
  },
};
export default command;
