import { Interaction } from 'discord.js';
import { BotClient } from '../client';
import { errorEmbed } from '../utils/embeds';
import { logger } from '../utils/logger';

export async function handleComponent(client: BotClient, interaction: Interaction): Promise<void> {
  if (!interaction.isButton() && !interaction.isStringSelectMenu()) return;

  const [handlerName] = interaction.customId.split(':');

  try {
    const handler = await import(`../modules/${handlerName}`).catch(() => null);
    if (handler?.handleComponent) {
      await handler.handleComponent(client, interaction);
    }
  } catch (err) {
    logger.error(`Component handler error for ${interaction.customId}:`, err);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        embeds: [errorEmbed('An error occurred handling this interaction.')],
        ephemeral: true,
      });
    }
  }
}
