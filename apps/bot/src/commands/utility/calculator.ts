import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { infoEmbed, errorEmbed } from '../../utils/embeds';
const command: Command = {
  data: new SlashCommandBuilder().setName('calculator').setDescription('Evaluate math expression').addStringOption(o=>o.setName('expression').setDescription('e.g. 2+2*10').setRequired(true)),
  async execute(interaction) {
    const expr=interaction.options.getString('expression',true);
    try {
      const safe=expr.replace(/[^0-9+\-*/.() ]/g,'');
      const result=Function('"use strict";return ('+safe+')')();
      await interaction.reply({ embeds: [infoEmbed(`\`${expr}\` = \`${result}\``)] });
    } catch { await interaction.reply({ embeds: [errorEmbed('Invalid expression.')], ephemeral:true }); }
  },
};
export default command;
