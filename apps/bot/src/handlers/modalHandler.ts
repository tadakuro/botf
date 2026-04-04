import { Interaction } from 'discord.js';
import { BotClient } from '../client';
import { errorEmbed } from '../utils/embeds';
import { logger } from '../utils/logger';

export async function handleModal(client: BotClient, interaction: Interaction): Promise<void> {
  if (!interaction.isModalSubmit()) return;

  const [handlerName] = interaction.customId.split(':');

  try {
    const handler = await import(`../modules/${handlerName}`).catch(() => null);
    if (handler?.handleModal) {
      await handler.handleModal(client, interaction);
    }
  } catch (err) {
    logger.error(`Modal handler error for ${interaction.customId}:`, err);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        embeds: [errorEmbed('An error occurred handling this modal.')],
        ephemeral: true,
      });
    }
  }
}
