import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { Command } from '../../types/Command';
import { successEmbed } from '../../utils/embeds';
import { GuildModel } from '../../services/cacheService';
const command: Command = {
  data: new SlashCommandBuilder().setName('logs').setDescription('Set log channel').addChannelOption(o=>o.setName('channel').setDescription('Channel').setRequired(true)),
  userPermissions: [PermissionFlagsBits.ManageGuild],
  async execute(interaction) {
    const ch=interaction.options.getChannel('channel',true);
    await GuildModel.findOneAndUpdate({ guildId:interaction.guild!.id },{ $set:{ logChannel:ch.id } },{ upsert:true });
    await interaction.reply({ embeds:[successEmbed(`Log channel set to <#${ch.id}>`)] });
  },
};
export default command;
