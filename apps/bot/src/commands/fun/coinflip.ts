import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { infoEmbed } from '../../utils/embeds';
const command: Command = {
  data: new SlashCommandBuilder().setName('coinflip').setDescription('Flip a coin'),
  async execute(interaction) {
    await interaction.reply({ embeds:[infoEmbed(`🪙 It's **${Math.random()<0.5?'Heads':'Tails'}**!`)] });
  },
};
export default command;
