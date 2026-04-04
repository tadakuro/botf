import { SlashCommandBuilder, codeBlock } from 'discord.js';
import { Command } from '../../types/Command';
import { baseEmbed, errorEmbed } from '../../utils/embeds';
const command: Command = {
  data: new SlashCommandBuilder().setName('eval').setDescription('Evaluate JavaScript code').addStringOption(o=>o.setName('code').setDescription('Code to run').setRequired(true)),
  ownerOnly: true,
  async execute(interaction, client) {
    const code=interaction.options.getString('code',true);
    try {
      let result=eval(code);
      if (result instanceof Promise) result=await result;
      if (typeof result!=='string') result=require('util').inspect(result,{ depth:1 });
      await interaction.reply({ embeds:[baseEmbed(0x2ecc71).setTitle('✅ Eval').setDescription(codeBlock('js',String(result).slice(0,4000)))] });
    } catch(err:any) {
      await interaction.reply({ embeds:[errorEmbed(codeBlock('js',err.message))], ephemeral:true });
    }
  },
};
export default command;
