import { SlashCommandBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { Command } from '../../types/Command';
import { successEmbed } from '../../utils/embeds';

const command: Command = {
  data: new SlashCommandBuilder().setName('unlockdown').setDescription('Unlock all text channels'),
  userPermissions: [PermissionFlagsBits.ManageChannels],
  botPermissions: [PermissionFlagsBits.ManageChannels],
  async execute(interaction) {
    await interaction.deferReply();
    const channels = interaction.guild!.channels.cache.filter(c => c.type === ChannelType.GuildText);
    for (const [, ch] of channels) {
      await (ch as any).permissionOverwrites.edit(interaction.guild!.roles.everyone, { SendMessages: null }).catch(() => {});
    }
    await interaction.editReply({ embeds: [successEmbed(`🔓 Server lockdown lifted. ${channels.size} channels unlocked.`)] });
  },
};
export default command;
