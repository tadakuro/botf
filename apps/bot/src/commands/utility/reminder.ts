import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { successEmbed, errorEmbed } from '../../utils/embeds';
import { ReminderModel } from '../../services/cacheService';
import { parseDuration, formatDuration } from '../../utils/parseDuration';
import type { IReminder } from '@botforge/database';
const command: Command = {
  data: new SlashCommandBuilder().setName('reminder').setDescription('Set a reminder')
    .addStringOption(o=>o.setName('time').setDescription('e.g. 10m, 2h').setRequired(true))
    .addStringOption(o=>o.setName('reason').setDescription('Reminder').setRequired(true)),
  async execute(interaction) {
    const ms = parseDuration(interaction.options.getString('time',true));
    if (!ms) return interaction.reply({ embeds: [errorEmbed('Invalid time.')], ephemeral: true });
    const Model = ReminderModel as any;
    await Model.create({ userId: interaction.user.id, guildId: interaction.guild?.id, reason: interaction.options.getString('reason',true), remindAt: new Date(Date.now()+ms) });
    await interaction.reply({ embeds: [successEmbed(`⏰ Reminder in **${formatDuration(ms)}**`)] });
  },
};
export default command;
