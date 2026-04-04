import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { baseEmbed } from '../../utils/embeds';
const command: Command = {
  data: new SlashCommandBuilder().setName('help').setDescription('View all commands'),
  async execute(interaction, client) {
    const cats=new Map<string,string[]>();
    for (const [name,cmd] of client.commands) {
      const c=cmd.category??'misc';
      if (!cats.has(c)) cats.set(c,[]);
      cats.get(c)!.push(`\`/${name}\``);
    }
    const embed=baseEmbed().setTitle('📖 Commands');
    for (const [c,cmds] of cats) embed.addFields({ name:`${c} (${cmds.length})`, value:cmds.join(', ') });
    await interaction.reply({ embeds:[embed], ephemeral:true });
  },
};
export default command;
