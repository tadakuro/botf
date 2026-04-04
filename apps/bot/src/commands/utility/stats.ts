import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { baseEmbed } from '../../utils/embeds';
import { formatDuration } from '../../utils/parseDuration';
const command: Command = {
  data: new SlashCommandBuilder().setName('stats').setDescription('Bot statistics'),
  async execute(interaction, client) {
    const mem=process.memoryUsage();
    await interaction.reply({ embeds: [baseEmbed().setTitle('📊 Statistics').addFields(
      { name:'Guilds', value:client.guilds.cache.size.toString(), inline:true },
      { name:'Users', value:client.users.cache.size.toString(), inline:true },
      { name:'Commands', value:client.commands.size.toString(), inline:true },
      { name:'Uptime', value:formatDuration(client.uptime??0), inline:true },
      { name:'Heap', value:`${(mem.heapUsed/1024/1024).toFixed(2)} MB`, inline:true },
    )] });
  },
};
export default command;
