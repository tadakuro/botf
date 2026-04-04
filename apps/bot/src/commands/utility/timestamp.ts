import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { infoEmbed } from '../../utils/embeds';
const command: Command = {
  data: new SlashCommandBuilder().setName('timestamp').setDescription('Get Discord timestamps').addStringOption(o=>o.setName('date').setDescription('Date string').setRequired(true)),
  async execute(interaction) {
    const d=new Date(interaction.options.getString('date',true));
    if (isNaN(d.getTime())) return interaction.reply({ embeds: [infoEmbed('Invalid date.')], ephemeral:true });
    const u=Math.floor(d.getTime()/1000);
    await interaction.reply({ embeds: [infoEmbed(['t','T','d','D','f','F','R'].map(f=>`\`<t:${u}:${f}>\` → <t:${u}:${f}>`).join('\n'),'Timestamps')] });
  },
};
export default command;
