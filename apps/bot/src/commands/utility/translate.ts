import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { infoEmbed, errorEmbed } from '../../utils/embeds';
import axios from 'axios';
const command: Command = {
  data: new SlashCommandBuilder().setName('translate').setDescription('Translate text')
    .addStringOption(o=>o.setName('text').setDescription('Text').setRequired(true))
    .addStringOption(o=>o.setName('to').setDescription('Target lang code e.g. es').setRequired(true))
    .addStringOption(o=>o.setName('from').setDescription('Source lang (default en)')),
  cooldown: 5,
  async execute(interaction) {
    await interaction.deferReply();
    const text=interaction.options.getString('text',true), to=interaction.options.getString('to',true), from=interaction.options.getString('from')??'en';
    try {
      const res = await axios.get('https://api.mymemory.translated.net/get', { params:{ q:text, langpair:`${from}|${to}` } });
      const t = res.data?.responseData?.translatedText;
      if (!t) throw new Error();
      await interaction.editReply({ embeds: [infoEmbed(`**Original:** ${text}\n**Translated (${to}):** ${t}`)] });
    } catch { await interaction.editReply({ embeds: [errorEmbed('Translation failed.')] }); }
  },
};
export default command;
