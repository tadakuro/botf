import { SlashCommandBuilder, PermissionFlagsBits, TextChannel } from 'discord.js';
import { Command } from '../../types/Command';
import { baseEmbed, successEmbed } from '../../utils/embeds';
const command: Command = {
  data: new SlashCommandBuilder().setName('embed').setDescription('Send a custom embed')
    .addStringOption(o=>o.setName('title').setDescription('Title').setRequired(true))
    .addStringOption(o=>o.setName('description').setDescription('Description').setRequired(true))
    .addStringOption(o=>o.setName('color').setDescription('Hex color'))
    .addChannelOption(o=>o.setName('channel').setDescription('Channel')),
  userPermissions: [PermissionFlagsBits.ManageMessages],
  async execute(interaction) {
    const title=interaction.options.getString('title',true), desc=interaction.options.getString('description',true), color=interaction.options.getString('color')??'#5865f2';
    const ch=(interaction.options.getChannel('channel')??interaction.channel) as TextChannel;
    await ch.send({ embeds: [baseEmbed(color as any).setTitle(title).setDescription(desc)] });
    await interaction.reply({ embeds: [successEmbed('Embed sent.')], ephemeral:true });
  },
};
export default command;
