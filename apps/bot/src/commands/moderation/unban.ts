import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { Command } from '../../types/Command';
import { successEmbed, errorEmbed } from '../../utils/embeds';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user by ID')
    .addStringOption(o => o.setName('user_id').setDescription('User ID to unban').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason')),
  userPermissions: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],
  async execute(interaction) {
    const userId = interaction.options.getString('user_id', true);
    const reason = interaction.options.getString('reason') ?? 'No reason provided';
    try {
      await interaction.guild!.bans.remove(userId, reason);
      await interaction.reply({ embeds: [successEmbed(`User \`${userId}\` has been unbanned.`)] });
    } catch {
      await interaction.reply({ embeds: [errorEmbed('Could not unban. User may not be banned or ID is invalid.')], ephemeral: true });
    }
  },
};
export default command;
