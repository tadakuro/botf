import { SlashCommandBuilder, GuildMember } from 'discord.js';
import { Command } from '../../types/Command';
import { baseEmbed } from '../../utils/embeds';
const command: Command = {
  data: new SlashCommandBuilder().setName('userinfo').setDescription('View user info').addUserOption(o => o.setName('user').setDescription('User')),
  async execute(interaction) {
    const member = (interaction.options.getMember('user') ?? interaction.member) as GuildMember;
    const user = member.user;
    await interaction.reply({ embeds: [baseEmbed().setTitle(user.tag).setThumbnail(user.displayAvatarURL()).addFields(
      { name: 'ID', value: user.id, inline: true },
      { name: 'Nickname', value: member.nickname ?? 'None', inline: true },
      { name: 'Created', value: `<t:${Math.floor(user.createdTimestamp/1000)}:R>`, inline: true },
      { name: 'Joined', value: `<t:${Math.floor((member.joinedTimestamp??0)/1000)}:R>`, inline: true },
      { name: 'Roles', value: member.roles.cache.filter(r=>r.id!==interaction.guild!.id).map(r=>`<@&${r.id}>`).join(', ')||'None' },
    )] });
  },
};
export default command;
