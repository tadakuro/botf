import { SlashCommandBuilder, PermissionFlagsBits, TextChannel } from 'discord.js';
import { Command } from '../../types/Command';
import { successEmbed, errorEmbed } from '../../utils/embeds';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Bulk delete messages')
    .addIntegerOption(o => o.setName('amount').setDescription('Number of messages (1-100)').setRequired(true).setMinValue(1).setMaxValue(100))
    .addUserOption(o => o.setName('user').setDescription('Filter by user')),
  userPermissions: [PermissionFlagsBits.ManageMessages],
  botPermissions: [PermissionFlagsBits.ManageMessages],
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount', true);
    const user = interaction.options.getUser('user');
    const channel = interaction.channel as TextChannel;
    await interaction.deferReply({ ephemeral: true });
    let messages = await channel.messages.fetch({ limit: amount });
    if (user) messages = messages.filter(m => m.author.id === user.id);
    const deleted = await channel.bulkDelete(messages, true);
    await interaction.editReply({ embeds: [successEmbed(`Deleted **${deleted.size}** messages.`)] });
  },
};
export default command;
