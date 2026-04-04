import { SlashCommandBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { Command } from '../../types/Command';
import { successEmbed } from '../../utils/embeds';

const command: Command = {
  data: new SlashCommandBuilder().setName('lockdown').setDescription('Lock all text channels in the server'),
  userPermissions: [PermissionFlagsBits.ManageChannels],
  botPermissions: [PermissionFlagsBits.ManageChannels],
  async execute(interaction) {
    await interaction.deferReply();
    const channels = interaction.guild!.channels.cache.filter(c => c.type === ChannelType.GuildText);
    for (const [, ch] of channels) {
      await (ch as any).permissionOverwrites.edit(interaction.guild!.roles.everyone, { SendMessages: false }).catch(() => {});
    }
    await interaction.editReply({ embeds: [successEmbed(`🔒 Server lockdown activated. ${channels.size} channels locked.`)] });
  },
};
export default command;
