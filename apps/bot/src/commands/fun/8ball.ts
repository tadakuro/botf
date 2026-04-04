import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { infoEmbed } from '../../utils/embeds';
const responses=['It is certain.','Without a doubt.','Yes, definitely.','You may rely on it.','As I see it, yes.','Most likely.','Outlook good.','Signs point to yes.','Reply hazy, try again.','Ask again later.','Better not tell you now.','Cannot predict now.','Concentrate and ask again.','Don\'t count on it.','My reply is no.','My sources say no.','Outlook not so good.','Very doubtful.'];
const command: Command = {
  data: new SlashCommandBuilder().setName('8ball').setDescription('Ask the magic 8-ball').addStringOption(o=>o.setName('question').setDescription('Your question').setRequired(true)),
  async execute(interaction) {
    const q=interaction.options.getString('question',true);
    await interaction.reply({ embeds:[infoEmbed(`🎱 **Q:** ${q}\n**A:** ${responses[Math.floor(Math.random()*responses.length)]}`)] });
  },
};
export default command;
