import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { baseEmbed } from '../../utils/embeds';
const command: Command = {
  data: new SlashCommandBuilder().setName('ship').setDescription('Ship two users')
    .addUserOption(o=>o.setName('user1').setDescription('First user').setRequired(true))
    .addUserOption(o=>o.setName('user2').setDescription('Second user').setRequired(true)),
  async execute(interaction) {
    const u1=interaction.options.getUser('user1',true), u2=interaction.options.getUser('user2',true);
    const score=Math.floor(Math.random()*101);
    const bar='█'.repeat(Math.round(score/10))+'░'.repeat(10-Math.round(score/10));
    await interaction.reply({ embeds:[baseEmbed(0xff69b4).setTitle('💘 Ship').setDescription(`**${u1.username}** 💗 **${u2.username}**\n\n\`${bar}\` **${score}%**`)] });
  },
};
export default command;
