import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { Command } from '../../types/Command';
import { baseEmbed, successEmbed, errorEmbed } from '../../utils/embeds';
import { GiveawayModel } from '../../services/cacheService';
import { parseDuration, formatDuration } from '../../utils/parseDuration';
import { endGiveaway } from '../../modules/giveaways';
const command: Command = {
  data: new SlashCommandBuilder().setName('giveaway').setDescription('Start a giveaway')
    .addStringOption(o=>o.setName('prize').setDescription('Prize').setRequired(true))
    .addStringOption(o=>o.setName('duration').setDescription('Duration e.g. 1h, 1d').setRequired(true))
    .addIntegerOption(o=>o.setName('winners').setDescription('Number of winners').setMinValue(1).setMaxValue(10)),
  userPermissions: [PermissionFlagsBits.ManageEvents],
  async execute(interaction, client) {
    const prize=interaction.options.getString('prize',true);
    const dur=parseDuration(interaction.options.getString('duration',true));
    if (!dur) return interaction.reply({ embeds:[errorEmbed('Invalid duration.')], ephemeral:true });
    const winners=interaction.options.getInteger('winners')??1;
    const endsAt=new Date(Date.now()+dur);
    const embed=baseEmbed(0xffd700).setTitle('🎉 GIVEAWAY').setDescription(`**Prize:** ${prize}\n**Winners:** ${winners}\n**Ends:** <t:${Math.floor(endsAt.getTime()/1000)}:R>\n\nReact with 🎉 to enter!`).setFooter({ text:`Hosted by ${interaction.user.tag}` });
    await interaction.reply({ embeds:[embed] });
    const msg=await interaction.fetchReply();
    await (msg as any).react('🎉');
    const doc=await GiveawayModel.create({ guildId:interaction.guild!.id, channelId:interaction.channelId, messageId:msg.id, prize, winnerCount:winners, endsAt, hostedBy:interaction.user.id });
    setTimeout(()=>endGiveaway(client,doc._id.toString()), dur);
  },
};
export default command;
