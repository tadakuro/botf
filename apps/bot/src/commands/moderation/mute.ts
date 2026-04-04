import { SlashCommandBuilder, PermissionFlagsBits, GuildMember } from 'discord.js';
import { Command } from '../../types/Command';
import { successEmbed, errorEmbed } from '../../utils/embeds';
import { logModAction } from '../../modules/moderation';
import { GuildModel } from '../../services/cacheService';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute a member using the mute role')
    .addUserOption(o => o.setName('user').setDescription('Member to mute').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason')),
  userPermissions: [PermissionFlagsBits.ModerateMembers],
  botPermissions: [PermissionFlagsBits.ManageRoles],
  async execute(interaction, client) {
    const target = interaction.options.getMember('user') as GuildMember;
    const reason = interaction.options.getString('reason') ?? 'No reason provided';
    if (!target) return interaction.reply({ embeds: [errorEmbed('Member not found.')], ephemeral: true });
    const settings = await GuildModel.findOne({ guildId: interaction.guild!.id });
    if (!settings?.muteRole) return interaction.reply({ embeds: [errorEmbed('No mute role configured. Use `/muterole` to set one.')], ephemeral: true });
    const role = interaction.guild!.roles.cache.get(settings.muteRole);
    if (!role) return interaction.reply({ embeds: [errorEmbed('Mute role not found.')], ephemeral: true });
    await target.roles.add(role, reason);
    await logModAction(client, interaction.guild!, 'Mute', target, interaction.member as GuildMember, reason);
    await interaction.reply({ embeds: [successEmbed(`**${target.user.tag}** has been muted.`)] });
  },
};
export default command;
