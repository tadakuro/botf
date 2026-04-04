import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { baseEmbed, infoEmbed } from '../../utils/embeds';
import { ReminderModel } from '../../services/cacheService';
const command: Command = {
  data: new SlashCommandBuilder().setName('reminderlist').setDescription('View reminders'),
  async execute(interaction) {
    const r = await ReminderModel.find({ userId: interaction.user.id, sent: false }).sort({ remindAt:1 });
    if (!r.length) return interaction.reply({ embeds: [infoEmbed('No reminders.')], ephemeral: true });
    await interaction.reply({ embeds: [baseEmbed().setTitle('Reminders').setDescription(r.map((x,i)=>`**${i+1}.** ${x.reason} — <t:${Math.floor(new Date(x.remindAt).getTime()/1000)}:R>`).join('\n'))], ephemeral: true });
  },
};
export default command;
