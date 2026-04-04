import { SlashCommandBuilder, Role } from 'discord.js';
import { Command } from '../../types/Command';
import { baseEmbed } from '../../utils/embeds';
const command: Command = {
  data: new SlashCommandBuilder().setName('roleinfo').setDescription('View role info').addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true)),
  async execute(interaction) {
    const role = interaction.options.getRole('role') as Role;
    await interaction.reply({ embeds: [baseEmbed(role.color||undefined).setTitle(`@${role.name}`).addFields(
      { name: 'ID', value: role.id, inline: true },
      { name: 'Color', value: role.hexColor, inline: true },
      { name: 'Members', value: role.members.size.toString(), inline: true },
      { name: 'Hoisted', value: role.hoist?'Yes':'No', inline: true },
      { name: 'Mentionable', value: role.mentionable?'Yes':'No', inline: true },
    )] });
  },
};
export default command;
