import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { infoEmbed } from '../../utils/embeds';
const command: Command = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Check bot latency'),
  async execute(interaction, client) {
    const sent = await interaction.reply({ embeds: [infoEmbed('Pinging...')], fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply({ embeds: [infoEmbed(`🏓 Pong!\n**Latency:** ${latency}ms\n**API:** ${Math.round(client.ws.ping)}ms`)] });
  },
};
export default command;
