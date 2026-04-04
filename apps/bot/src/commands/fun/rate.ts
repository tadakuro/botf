import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { infoEmbed } from '../../utils/embeds';
const command: Command = {
  data: new SlashCommandBuilder().setName('rate').setDescription('Rate something').addStringOption(o=>o.setName('thing').setDescription('What to rate').setRequired(true)),
  async execute(interaction) {
    const thing=interaction.options.getString('thing',true);
    const score=Math.floor(Math.random()*101);
    await interaction.reply({ embeds:[infoEmbed(`I rate **${thing}** a **${score}/100** ${'⭐'.repeat(Math.round(score/20))}`)] });
  },
};
export default command;
