import { SlashCommandBuilder, PermissionFlagsBits, TextChannel } from 'discord.js';
import { Command } from '../../types/Command';
import { successEmbed } from '../../utils/embeds';
const command: Command = {
  data: new SlashCommandBuilder().setName('say').setDescription('Make bot say something')
    .addStringOption(o=>o.setName('message').setDescription('Message').setRequired(true))
    .addChannelOption(o=>o.setName('channel').setDescription('Channel')),
  userPermissions: [PermissionFlagsBits.ManageMessages],
  async execute(interaction) {
    const msg = interaction.options.getString('message',true);
    const ch = (interaction.options.getChannel('channel')??interaction.channel) as TextChannel;
    await ch.send(msg);
    await interaction.reply({ embeds: [successEmbed('Sent.')], ephemeral: true });
  },
};
export default command;
