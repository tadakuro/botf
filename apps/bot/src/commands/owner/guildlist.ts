import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { baseEmbed } from '../../utils/embeds';
import { chunkArray } from '../../utils/formatters';
const command: Command = {
  data: new SlashCommandBuilder().setName('guildlist').setDescription('List all guilds the bot is in'),
  ownerOnly: true,
  async execute(interaction, client) {
    const guilds=[...client.guilds.cache.values()];
    const desc=guilds.map(g=>`**${g.name}** (${g.memberCount} members) \`${g.id}\``).join('\n').slice(0,4000);
    await interaction.reply({ embeds:[baseEmbed().setTitle(`Guilds (${guilds.length})`).setDescription(desc)], ephemeral:true });
  },
};
export default command;
