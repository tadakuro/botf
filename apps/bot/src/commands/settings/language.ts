import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { Command } from '../../types/Command';
import { successEmbed } from '../../utils/embeds';
import { GuildModel } from '../../services/cacheService';
const command: Command = {
  data: new SlashCommandBuilder().setName('language').setDescription('Set bot language').addStringOption(o=>o.setName('lang').setDescription('Language code e.g. en, es').setRequired(true)),
  userPermissions: [PermissionFlagsBits.Administrator],
  async execute(interaction) {
    const language=interaction.options.getString('lang',true);
    await GuildModel.findOneAndUpdate({ guildId:interaction.guild!.id },{ $set:{ language } },{ upsert:true });
    await interaction.reply({ embeds:[successEmbed(`Language set to \`${language}\``)] });
  },
};
export default command;
