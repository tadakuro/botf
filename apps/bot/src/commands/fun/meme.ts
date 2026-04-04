import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { baseEmbed, errorEmbed } from '../../utils/embeds';
import axios from 'axios';
const command: Command = {
  data: new SlashCommandBuilder().setName('meme').setDescription('Get a random meme'),
  cooldown: 5,
  async execute(interaction) {
    await interaction.deferReply();
    try {
      const res=await axios.get('https://meme-api.com/gimme');
      const { title, url, author, subreddit }=res.data;
      await interaction.editReply({ embeds:[baseEmbed().setTitle(title).setImage(url).setFooter({ text:`r/${subreddit} • u/${author}` })] });
    } catch { await interaction.editReply({ embeds:[errorEmbed('Could not fetch meme.')] }); }
  },
};
export default command;
