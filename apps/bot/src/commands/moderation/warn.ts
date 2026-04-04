import { SlashCommandBuilder, PermissionFlagsBits, GuildMember } from 'discord.js';
import { Command } from '../../types/Command';
import { successEmbed, errorEmbed } from '../../utils/embeds';
import { addWarning, logModAction } from '../../modules/moderation';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a member')
    .addUserOption(o => o.setName('user').setDescription('Member to warn').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true)),
  userPermissions: [PermissionFlagsBits.ModerateMembers],
  async execute(interaction, client) {
    const target = interaction.options.getMember('user') as GuildMember;
    const reason = interaction.options.getString('reason', true);
    if (!target) return interaction.reply({ embeds: [errorEmbed('Member not found.')], ephemeral: true });
    const count = await addWarning(interaction.guild!.id, target.id, interaction.user.id, reason);
    await logModAction(client, interaction.guild!, 'Warn', target, interaction.member as GuildMember, reason, { 'Total Warnings': count.toString() });
    await interaction.reply({ embeds: [successEmbed(`**${target.user.tag}** has been warned. They now have **${count}** warning(s).`)] });
    await target.user.send(`⚠️ You have been warned in **${interaction.guild!.name}**.\n**Reason:** ${reason}`).catch(() => {});
  },
};
export default command;
