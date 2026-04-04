import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { Command } from '../../types/Command';
import { successEmbed } from '../../utils/embeds';
import { GuildModel } from '../../services/cacheService';
const command: Command = {
  data: new SlashCommandBuilder().setName('prefix').setDescription('Set bot prefix').addStringOption(o=>o.setName('prefix').setDescription('New prefix').setRequired(true)),
  userPermissions: [PermissionFlagsBits.Administrator],
  async execute(interaction) {
    const prefix=interaction.options.getString('prefix',true);
    await GuildModel.findOneAndUpdate({ guildId:interaction.guild!.id },{ $set:{ prefix } },{ upsert:true });
    await interaction.reply({ embeds:[successEmbed(`Prefix set to \`${prefix}\``)] });
  },
};
export default command;
