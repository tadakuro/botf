import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { baseEmbed, errorEmbed } from '../../utils/embeds';
import axios from 'axios';
const command: Command = {
  data: new SlashCommandBuilder().setName('trivia').setDescription('Get a trivia question'),
  cooldown: 5,
  async execute(interaction) {
    await interaction.deferReply();
    try {
      const res=await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
      const q=res.data.results[0];
      const options=[...q.incorrect_answers, q.correct_answer].sort(()=>Math.random()-0.5);
      const embed=baseEmbed(0x9b59b6).setTitle('🧠 Trivia').addFields(
        { name:'Question', value:q.question },
        { name:'Options', value:options.map((o:string,i:number)=>`${['A','B','C','D'][i]}. ${o}`).join('\n') },
        { name:'Category', value:q.category, inline:true },
        { name:'Difficulty', value:q.difficulty, inline:true },
      ).setFooter({ text:`Answer: ${q.correct_answer}` });
      await interaction.editReply({ embeds:[embed] });
    } catch { await interaction.editReply({ embeds:[errorEmbed('Could not fetch trivia.')] }); }
  },
};
export default command;
