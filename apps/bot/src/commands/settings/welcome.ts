import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { Command } from '../../types/Command';
import { successEmbed } from '../../utils/embeds';
import { GuildModel } from '../../services/cacheService';
const command: Command = {
  data: new SlashCommandBuilder().setName('welcome').setDescription('Configure welcome messages')
    .addChannelOption(o=>o.setName('channel').setDescription('Welcome channel').setRequired(true))
    .addStringOption(o=>o.setName('message').setDescription('Welcome message. Use {user}, {server}, {memberCount}')),
  userPermissions: [PermissionFlagsBits.ManageGuild],
  async execute(interaction) {
    const ch=interaction.options.getChannel('channel',true);
    const msg=interaction.options.getString('message')??'Welcome {user} to **{server}**!';
    await GuildModel.findOneAndUpdate({ guildId:interaction.guild!.id },{ $set:{ welcomeChannel:ch.id, welcomeMessage:msg } },{ upsert:true });
    await interaction.reply({ embeds:[successEmbed(`Welcome channel set to <#${ch.id}>`)] });
  },
};
export default command;
