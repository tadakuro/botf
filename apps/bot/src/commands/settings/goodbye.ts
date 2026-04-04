import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { Command } from '../../types/Command';
import { successEmbed } from '../../utils/embeds';
import { GuildModel } from '../../services/cacheService';
const command: Command = {
  data: new SlashCommandBuilder().setName('goodbye').setDescription('Configure goodbye messages')
    .addChannelOption(o=>o.setName('channel').setDescription('Goodbye channel').setRequired(true))
    .addStringOption(o=>o.setName('message').setDescription('Goodbye message. Use {username}, {server}')),
  userPermissions: [PermissionFlagsBits.ManageGuild],
  async execute(interaction) {
    const ch=interaction.options.getChannel('channel',true);
    const msg=interaction.options.getString('message')??'Goodbye {username}!';
    await GuildModel.findOneAndUpdate({ guildId:interaction.guild!.id },{ $set:{ goodbyeChannel:ch.id, goodbyeMessage:msg } },{ upsert:true });
    await interaction.reply({ embeds:[successEmbed(`Goodbye channel set to <#${ch.id}>`)] });
  },
};
export default command;
