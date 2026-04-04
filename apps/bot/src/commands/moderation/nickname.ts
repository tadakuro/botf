import { SlashCommandBuilder, PermissionFlagsBits, GuildMember } from 'discord.js';
import { Command } from '../../types/Command';
import { successEmbed, errorEmbed } from '../../utils/embeds';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('nickname')
    .setDescription('Change a member nickname')
    .addUserOption(o => o.setName('user').setDescription('Member').setRequired(true))
    .addStringOption(o => o.setName('nickname').setDescription('New nickname (leave empty to reset)')),
  userPermissions: [PermissionFlagsBits.ManageNicknames],
  botPermissions: [PermissionFlagsBits.ManageNicknames],
  async execute(interaction) {
    const target = interaction.options.getMember('user') as GuildMember;
    const nick = interaction.options.getString('nickname');
    if (!target) return interaction.reply({ embeds: [errorEmbed('Member not found.')], ephemeral: true });
    await target.setNickname(nick);
    await interaction.reply({ embeds: [successEmbed(nick ? `Nickname set to **${nick}**.` : 'Nickname reset.')] });
  },
};
export default command;
