import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { baseEmbed } from '../../utils/embeds';
import { addPollReactions, POLL_EMOJIS } from '../../modules/polls';
const command: Command = {
  data: new SlashCommandBuilder().setName('poll').setDescription('Create a poll')
    .addStringOption(o=>o.setName('question').setDescription('Poll question').setRequired(true))
    .addStringOption(o=>o.setName('options').setDescription('Options separated by | e.g. Yes|No|Maybe').setRequired(true)),
  async execute(interaction) {
    const question=interaction.options.getString('question',true);
    const opts=interaction.options.getString('options',true).split('|').map(s=>s.trim()).filter(Boolean).slice(0,10);
    const embed=baseEmbed(0x3498db).setTitle('📊 '+question).setDescription(opts.map((o,i)=>`${POLL_EMOJIS[i]} ${o}`).join('\n'));
    await interaction.reply({ embeds:[embed] });
    const msg=await interaction.fetchReply();
    await addPollReactions(msg as any, opts.length);
  },
};
export default command;
